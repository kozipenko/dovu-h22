import { AccountId, AccountBalanceQuery, Client, PrivateKey, ContractCallQuery, ContractFunctionParameters, Hbar } from "@hashgraph/sdk";

const ACCOUNT_ID = process.env.REACT_APP_ACCOUNT_ID;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

const client = Client
  .forName("testnet")
  .setOperator(AccountId.fromString(ACCOUNT_ID), PrivateKey.fromString(PRIVATE_KEY));

export const getAccountBalance = async (accountId) =>
  await new AccountBalanceQuery({ accountId }).execute(client);

// Taken from hashconnect dapp example
// https://github.com/Hashpack/hashconnect/blob/main/example/dapp/src/app/components/smartcontract-call/smartcontract-call.component.ts
export const buildTestTransaction = () => new ContractCallQuery()
  .setContractId("0.0.30863001")
  .setGas(100000)
  .setFunction("getMobileNumber", new ContractFunctionParameters().addString("Alice"))
  .setMaxQueryPayment(new Hbar(0.00000001))
  .toBytes();

export const buildClaimTokensTransaction = () => new ContractCallQuery()
  .setContractId("0.0.34204135")
  .setGas(100000)
  .setFunction("claimDemoTokensForStaking", new ContractFunctionParameters().addInt64("1"))
  .setMaxQueryPayment(new Hbar(0.00000001))
  .toBytes();