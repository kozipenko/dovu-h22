import { AccountId, AccountBalanceQuery, Client, PrivateKey, ContractCallQuery, ContractFunctionParameters, Hbar } from "@hashgraph/sdk";

const ACCOUNT_ID = process.env.REACT_APP_ACCOUNT_ID;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;
const CONTRACT_ID = "0.0.34204135";

const client = Client
  .forName("testnet")
  .setOperator(AccountId.fromString(ACCOUNT_ID), PrivateKey.fromString(PRIVATE_KEY));

export const getAccountBalance = async (accountId) =>
  await new AccountBalanceQuery({ accountId }).execute(client);

const contractCallQueryTx = (func, params) => new ContractCallQuery()
  .setContractId(CONTRACT_ID)
  .setGas(500000)
  .setFunction(func, params)
  .setMaxQueryPayment(new Hbar(0.00000001))
  .toBytes();

export const claimDemoTokensForStakingTx = (amount=1) =>
  contractCallQueryTx("claimDemoTokensForStaking", new ContractFunctionParameters()
    .addInt64(amount));

export const stakeTokensToProjectTx = (id, amount) => 
  contractCallQueryTx("stakeTokensToProject", new ContractFunctionParameters()
    .addString(id)
    .addInt64(amount));

export const unstakeTokensFromProjectTx = (id, amount) =>
  contractCallQueryTx("unstakeTokensFromProject", new ContractFunctionParameters()
    .addString(id)
    .addInt64(amount));

export const getTreasuryBalanceTx = () =>
  contractCallQueryTx("getTreasuryBalance");

export const getVerifiedCarbonForProjectTx = (id) =>
  contractCallQueryTx("getVerifiedCarbonForProject", new ContractFunctionParameters()
    .addString(id));

export const getCollateralRiskTx = (id) =>
  contractCallQueryTx("getCollateralRisk");

export const numberOfTokensStakedToProjectTx = (id) =>
  contractCallQueryTx("numberOfTokensStakedToProject", new ContractFunctionParameters()
    .addString(id));

export const getUserTokensStakedToProjectTx = (id) =>
  contractCallQueryTx("getUserTokensStakedToProject", new ContractFunctionParameters()
    .addString(id));