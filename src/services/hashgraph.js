import { AccountId, AccountBalanceQuery, Client, PrivateKey, ContractCallQuery, ContractFunctionParameters } from "@hashgraph/sdk";

const ACCOUNT_ID = process.env.REACT_APP_ACCOUNT_ID;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

const client = Client
  .forName("testnet")
  .setOperator(AccountId.fromString(ACCOUNT_ID), PrivateKey.fromString(PRIVATE_KEY));

export const getAccountBalance = async (accountId) =>
  await new AccountBalanceQuery({ accountId }).execute(client);

export const claimDemoTokensForStaking = (amount=10) => {
  const params = new ContractFunctionParameters()
    .addInt64(amount);

  return new ContractCallQuery()
    .setContractId("0.0.0")
    .setGas(1000)
    .setFunction("claimDemoTokensForStaking", params)
    .toBytes();
}