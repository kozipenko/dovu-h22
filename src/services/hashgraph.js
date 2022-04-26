import { AccountId, AccountBalanceQuery, Client, PrivateKey } from "@hashgraph/sdk";

const ACCOUNT_ID = process.env.REACT_APP_ACCOUNT_ID;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

const client = Client
  .forName("testnet")
  .setOperator(AccountId.fromString(ACCOUNT_ID), PrivateKey.fromString(PRIVATE_KEY));

export async function getAccountBalance(accountId) {
  return await new AccountBalanceQuery({ accountId })
    .execute(client);
}