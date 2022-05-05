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

const ACCOUNT_ID = process.env.REACT_APP_ACCOUNT_ID;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;
const NETWORK = "testnet";
// token used for staking
const TOKEN_ID = "0.0.30875555";
// token name
export const TOKEN_NAME = "testDOV"; // TODO: get data from mirror node.
export const TOKEN_EXP = 10**6; // TODO: get data from mirror node & create function to correctly display precision.
// stakable contract id
export const CONTRACT_ID = "0.0.34400935";

// client needed for queries
const client = Client
  .forName(NETWORK)
  .setOperator(AccountId.fromString(ACCOUNT_ID), PrivateKey.fromString(PRIVATE_KEY));

// contract store
export const contract = proxy({
  accountBalance: null,
  treasuryBalance: null,
  maxClaimableTokens: null,
  totalTokensClaimed: null
});

export function SetContractMaxClaimableTokens(value) {
  contract.maxClaimableTokens = value * TOKEN_EXP; 

}

export function SetTreasuryBalance(value) {
  contract.treasuryBalance = parseFloat(contract.treasuryBalance) + parseFloat(value * TOKEN_EXP); // have to do this way or js does string concat.
}

export const useContract = () => useSnapshot(contract);

async function queryContract(method, params) {
  return await new ContractCallQuery()
    .setContractId(CONTRACT_ID)
    .setGas(3000000)
    .setQueryPayment(new Hbar(3))
    .setFunction(method, params)
    .execute(client);
}

/*
I believe this issue is fixed now.  Moved loadIsOwner check to PageWallet.js on each render

if (wallet.connection.pairedAccount != null) {
  loadIsOwner();
}
*/

// call contract helper
async function callContract(method, params) {
  const transaction = new ContractExecuteTransaction()
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

// load account balance
export async function loadAccountBalance() {
  try {
    const response = await new AccountBalanceQuery()
      .setAccountId(wallet.connection.pairedAccount)
      .execute(client);
    const balance = JSON.parse(response);
    const token = balance.tokens.find(t => t.tokenId === TOKEN_ID);
    contract.accountBalance = token.balance; // TODO: proper rounding
  } catch {
    contract.accountBalance = 0;
  }
}

// load contract ownership status
export async function loadIsOwner() {
  const response = await queryContract("owner");
  const owner = AccountId.fromSolidityAddress(response.getAddress(0));
  wallet.connection.isOwner = owner.toString() === wallet.connection.pairedAccount;
}

// load current max claimable tokens.
export async function loadMaxClaimableTokens() {
  const response = await queryContract("getMaximumClaimableTokens");
  contract.maxClaimableTokens = response.getInt64(0).toString();
}

// load total tokens already claimed by user
export async function loadTotalTokensClaimed() {
  const response = await queryContract("getTotalTokensClaimed");
  contract.totalTokensClaimed = response.getInt64(0).toString();
}

// load treasury balance
export async function loadTreasuryBalance() {
  const response = await queryContract("getTreasuryBalance");
  contract.treasuryBalance = response.getInt64(0).toString();
}

export async function getVerifiedCarbonForProject(projectId) {
  const func = "getVerifiedCarbonForProject";
  const params = new ContractFunctionParameters().addString(projectId);
  const response = await queryContract(func, params);
  
  return response.getInt64(0).toNumber();
}

export async function getStakedPosition(id) {
  const func = "getStakedPosition";
  const params = new ContractFunctionParameters().addString(id);
  const response = await queryContract(func, params);
  return [response.getInt64(0), response.getInt64(1), response.getUint256(2), response.getUint256(3), response.getBool(4)];
}

export async function getNumberOfTokensStakedToProject(id) {
  const func = "numberOfTokensStakedToProject";
  const params = new ContractFunctionParameters().addString(id);
  const response = await queryContract(func, params);
  return response.getInt64(0);
}
export async function claimDemoTokensForStaking(amount) {
  const params = new ContractFunctionParameters().addInt64(amount);
  const response = await callContract("claimDemoTokensForStaking", params);

  if (response.error)
    throw new Error(response.error);

  return response.success;
}

export async function addProject(projectId, verifiedKg) {
  const func = "addProject";
  const params = new ContractFunctionParameters().addString(projectId).addInt64(verifiedKg);
  const response = await callContract(func, params);

  if (response.error)
    throw new Error(response.error);

  return response.success;
}

export async function addVerifiedCarbon(projectId, verifiedKg) {
  const func = "addVerifiedCarbon";
  const params = new ContractFunctionParameters().addString(projectId).addInt64(verifiedKg);
  const response = await callContract(func, params);

  if (response.error)
    throw new Error(response.error);

  return response.success;
}

export async function removeVerifiedCarbon(projectId, verifiedKg) {
  const func = "removeVerifiedCarbon";
  const params = new ContractFunctionParameters().addString(projectId).addInt64(verifiedKg);
  const response = await callContract(func, params);

  if (response.error)
    throw new Error(response.error);

  return response.success;
}
//TODO: REVERTS ON DECIMAL FIX
export async function addTokensToTreasury(amount) {
  const func = "addTokensToTreasury";
  console.log(typeof(amount))
  const params = new ContractFunctionParameters().addInt64(amount*TOKEN_EXP);
  const response = await callContract(func, params);

  return response
}

export async function stakeTokensToProject(project, amount) {
  // TODO: implement emit events, record and mirror node.
  const func = "stakeTokensToProject";
  const params = new ContractFunctionParameters().addString(project).addInt64(amount*TOKEN_EXP);
  const response = await callContract(func, params);

  return response.success;
}

export async function unstakeTokensFromProject(project, amount) {
  // TODO: implement emit events, record and mirror node.
  const func = "unstakeTokensFromProject";
  const params = new ContractFunctionParameters().addString(project).addInt64(amount*TOKEN_EXP);
  const response = await callContract(func, params);

  return response.success;
}

export async function updateClaimableTokens(amount) {
  const func = "updateClaimableTokens";
  const params = new ContractFunctionParameters().addInt64(amount*TOKEN_EXP);
  const response = await callContract(func, params)
  // TODO: handle owner related errors.
  return response.success;
}
