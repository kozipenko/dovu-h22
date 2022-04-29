import { AccountId, AccountBalanceQuery, Client, PrivateKey, ContractCallQuery, ContractFunctionParameters, Hbar } from "@hashgraph/sdk";

const ACCOUNT_ID = process.env.REACT_APP_ACCOUNT_ID;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;
const CONTRACT_ID = "0.0.34204135";

const client = Client
  .forName("testnet")
  .setOperator(AccountId.fromString(ACCOUNT_ID), PrivateKey.fromString(PRIVATE_KEY));

export const getAccountBalance = async (accountId) =>
  await new AccountBalanceQuery({ accountId }).execute(client);

const contractCallQueryTxn = (func, params) => new ContractCallQuery()
  .setContractId(CONTRACT_ID)
  .setGas(500000)
  .setFunction(func, params)
  .setMaxQueryPayment(new Hbar(0.00000001))
  .toBytes();

export const claimDemoTokensForStakingTxn = (amount=1) =>
  contractCallQueryTxn("claimDemoTokensForStaking", new ContractFunctionParameters()
    .addInt64(amount));

export const stakeTokensToProjectTxn = (id, amount) => 
  contractCallQueryTxn("stakeTokensToProject", new ContractFunctionParameters()
    .addString(id)
    .addInt64(amount));

export const unstakeTokensFromProjectTxn = (id, amount) =>
  contractCallQueryTxn("unstakeTokensFromProject", new ContractFunctionParameters()
    .addString(id)
    .addInt64(amount));

export const getTreasuryBalanceTxn = () =>
  contractCallQueryTxn("getTreasuryBalance");

export const getVerifiedCarbonForProjectTxn = (id) =>
  contractCallQueryTxn("getVerifiedCarbonForProject", new ContractFunctionParameters()
    .addString(id));

export const getCollateralRiskTxn = (id) =>
  contractCallQueryTxn("getCollateralRisk");

export const numberOfTokensStakedToProjectTxn = (id) =>
  contractCallQueryTxn("numberOfTokensStakedToProject", new ContractFunctionParameters()
    .addString(id));

export const getUserTokensStakedToProjectTxn = (id) =>
  contractCallQueryTxn("getUserTokensStakedToProject", new ContractFunctionParameters()
    .addString(id));