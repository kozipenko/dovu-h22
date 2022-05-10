import { AccountId, Client, ContractCallQuery, ContractExecuteTransaction, ContractFunctionParameters, Hbar, TransactionId } from "@hashgraph/sdk";
import { wallet, sendTransaction } from "./wallet";

const ACCOUNT_ID = process.env.REACT_APP_ACCOUNT_ID;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

export const NETWORK = "testnet";
export const TOKEN_ID = "0.0.30875555";
export const TOKEN_EXP = 10**6; // TODO: get data from mirror node & create function to correctly display precision.
export const TOKEN_NAME = "testDOV"; // TODO: get data from mirror node.
export const CONTRACT_ID = "0.0.34400935";
export const CONTRACT_OWNER = "0.0.34095176"; // TODO: Keep hardcoded to replace getIsOwner?

const client = Client.forName(NETWORK).setOperator(ACCOUNT_ID, PRIVATE_KEY);

async function queryContract(method, params) {
  return await new ContractCallQuery()
    .setContractId(CONTRACT_ID)
    .setGas(3000000)
    .setQueryPayment(new Hbar(3))
    .setFunction(method, params)
    .execute(client);
}

function createContractExecuteTransaction(method, params) {
  return new ContractExecuteTransaction()
  .setContractId(CONTRACT_ID)
  .setGas(3000000)
  .setFunction(method, params)
  .setMaxTransactionFee(new Hbar(0.75))
  .setTransactionId(TransactionId.generate(wallet.accountId))
  .setNodeAccountIds([new AccountId(3)])
  .freeze()
  .toBytes();
}

export async function getIsOwner() {
  const response = await queryContract("owner");
  const owner = AccountId.fromSolidityAddress(response.getAddress(0));
  return owner.toString() === wallet.accountId;
}

export async function getTreasuryBalance() {
  const response = await queryContract("getTreasuryBalance");
  return response.getInt64(0).toNumber() / TOKEN_EXP;
}

export async function getTotalTokensClaimed() {
  const response = await queryContract("getTotalTokensClaimed");
  return response.getInt64(0).toNumber() / TOKEN_EXP;
}

export async function getMaximumClaimableTokens() {
  const response = await queryContract("getMaximumClaimableTokens");
  return response.getInt64(0).toNumber() / TOKEN_EXP;
}

export async function getVerifiedCarbonForProject(projectId) {
  const func = "getVerifiedCarbonForProject";
  const params = new ContractFunctionParameters().addString(projectId);
  const response = await queryContract(func, params);
  return response.getInt64(0).toNumber();
}

export async function getStakedPosition(projectId) {
  const func = "getStakedPosition";
  const params = new ContractFunctionParameters().addString(projectId);
  const response = await queryContract(func, params);

  return {
    amount: response.getInt64(0).toNumber() / TOKEN_EXP,
    amountOnEnd: response.getInt64(1).toNumber(),
    numberOfDays: response.getUint256(2).toNumber(),
    unlockTime: response.getUint256(3).toNumber(),
    open: response.getBool(4)
  }
}

export async function getNumberOfTokensStakedToProject(projectId) {
  const func = "numberOfTokensStakedToProject";
  const params = new ContractFunctionParameters().addString(projectId);
  const response = await queryContract(func, params);
  return response.getInt64(0).toNumber() / TOKEN_EXP;
}

// TODO: to float for precision?
export async function getCollateralRisk(projectId) {
  const func = "getCollateralRisk";
  const params = new ContractFunctionParameters().addString(projectId);
  const response = await queryContract(func, params);
  return ((response.getInt64(0).toNumber() / TOKEN_EXP)/response.getInt64(1).toNumber())*100;
}

export async function claimDemoTokensForStaking(amount) {
  const params = new ContractFunctionParameters().addInt64(amount* TOKEN_EXP);
  const tx = createContractExecuteTransaction("claimDemoTokensForStaking", params);
  const res = await sendTransaction(tx);
}

export async function addProject(id, verifiedKg) {
  const func = "addProject";
  const params = new ContractFunctionParameters().addString(id).addInt64(verifiedKg);
  const tx = createContractExecuteTransaction(func, params);
  const res = await sendTransaction(tx);
}

export async function addVerifiedCarbon(id, verifiedKg) {
  const func = "addVerifiedCarbon";
  const params = new ContractFunctionParameters().addString(id).addInt64(verifiedKg);
  const tx = createContractExecuteTransaction(func, params);
  const res = await sendTransaction(tx);
  return res.success;
}

export async function removeVerifiedCarbon(id, verifiedKg) {
  const func = "removeVerifiedCarbon";
  const params = new ContractFunctionParameters().addString(id).addInt64(verifiedKg);
  const tx = createContractExecuteTransaction(func, params);
  const res = await sendTransaction(tx);
  return res.success;
}

// TODO: REVERTS ON DECIMAL FIX
export async function addTokensToTreasury(amount) {
  const func = "addTokensToTreasury";
  const params = new ContractFunctionParameters().addInt64(amount*TOKEN_EXP);
  const tx = createContractExecuteTransaction(func, params);
  const res = await sendTransaction(tx);
}

// TODO: implement emit events, record and mirror node.
export async function stakeTokensToProject(id, amount, term) {
  const func = "stakeTokensToProject";
  const params = new ContractFunctionParameters().addString(id).addInt64(amount*TOKEN_EXP).addUint256(term);
  const tx = createContractExecuteTransaction(func, params);
  const res = await sendTransaction(tx);
  return res.success;
}

// TODO: implement emit events, record and mirror node.
export async function unstakeTokensFromProject(id) {
  const func = "endStakeToProject";
  const params = new ContractFunctionParameters().addString(id);//.addInt64(amount*TOKEN_EXP);
  const tx = createContractExecuteTransaction(func, params);
  const res = await sendTransaction(tx);
  return res.success;
}

// TODO: handle owner related errors.
export async function updateClaimableTokens(amount) {
  const func = "updateClaimableTokens";
  const params = new ContractFunctionParameters().addInt64(amount*TOKEN_EXP);
  const tx = createContractExecuteTransaction(func, params)
  const res = await sendTransaction(tx);
}

// TODO: Remove after demo.
export async function removeTimelockForProject(projectId) {
  const func = "removeTimelockForProject";
  const params = new ContractFunctionParameters().addString(projectId);
  const tx = createContractExecuteTransaction(func, params)
  const res = await sendTransaction(tx)

  return res.success;
}