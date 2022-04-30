import { proxy, useSnapshot } from "valtio";
import { sendTransaction, wallet } from "./wallet";
import {
  AccountBalanceQuery,
  AccountId,
  Client,
  ContractCallQuery,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  Hbar,
  PrivateKey,
  TransactionId
} from "@hashgraph/sdk";

// TODO: Remove below
// DUMMY SC  - 0.0.34359634
// TODO: Update to official
// Stakable (modified with no checks, for debugging) - 0.0.34359589
// testnet account needed for account balance queries
const ACCOUNT_ID = process.env.REACT_APP_ACCOUNT_ID;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;
const NETWORK = "testnet";
// token used for staking
const TOKEN_ID = "0.0.34185686"; // Token ID is the one sent for testing 0.0.34185686
// stakable contract id
const CONTRACT_ID = "0.0.34359589"; // in testing - project.id -> 0.0.169290 in contract

// client needed for account balance queries
const client = Client
  .forName(NETWORK)
  .setOperator(AccountId.fromString(ACCOUNT_ID), PrivateKey.fromString(PRIVATE_KEY));

export const contract = proxy({
  accountBalance: null,
  treasuryBalance: null
});

export const useContract = () => useSnapshot(contract);

async function queryContract(method, params) {
  return await new ContractCallQuery()
    .setContractId(CONTRACT_ID)
    .setGas(3000000)
    .setFunction(method, params)
    .execute(client);
}

async function callContract(method, params) {
  const transaction = await new ContractExecuteTransaction()
  .setContractId(CONTRACT_ID)
  .setGas(3000000)
  .setFunction(method, params)
  .setMaxTransactionFee(new Hbar(0.75))
  .setTransactionId(TransactionId.generate(wallet.connection.pairedAccount))
  .setNodeAccountIds([new AccountId(3)])
  .freeze()
  .toBytes();

  return await sendTransaction(transaction);
}

export async function getAccountBalance() {
  const response = await new AccountBalanceQuery()
    .setAccountId(wallet.connection.pairedAccount)
    .execute(client);
  const balance = JSON.parse(response);
  const token = balance.tokens.find(t => t.tokenId === TOKEN_ID);
  contract.accountBalance = token ? Math.round(token.balance/1000000).toLocaleString() : 0;
}

export async function getTreasuryBalance() {
  const response = await queryContract("getTreasuryBalance");
  contract.treasuryBalance = response.getInt64(0).toString();
}

export async function claimDemoTokensForStaking(amount=1) {
  const params = new ContractFunctionParameters().addInt64(amount);
  const response = await callContract("claimDemoTokensForStaking", params);

  console.log(response);
}

export async function changeStateOfTestContract(amount) {
  const func = "addTokens";
  const params = new ContractFunctionParameters().addInt64(amount);
  const transactionBytes = await callContract(func, params);

  const response = await sendTransaction(transactionBytes);
  console.log(response);
}

export async function addProjectForStaking(name) {
  const func = "addProject";
  const params = new ContractFunctionParameters().addString(name).addInt64(5);
  const transactionBytes = await callContract(func, params);

  const response = await sendTransaction(transactionBytes);

  console.log(response);
}

export async function addTokensToTreasury(amount) {
  const func = "addTokensToTreasury";
  const params = new ContractFunctionParameters().addInt64(amount);
  const transactionBytes = await callContract(func, params);
  
  const response = await sendTransaction(transactionBytes);

  console.log(response);
}
