import { AccountId, ContractExecuteTransaction, ContractFunctionParameters, Hbar, TransactionId } from "@hashgraph/sdk";
import { useMutation, useQueryClient } from "react-query";
import { CONTRACT_ID, TOKEN_EXP } from "../utils/constants";
import { useWallet } from "./wallet";

export function useContract() {
  const cache = useQueryClient();
  const wallet = useWallet();

  function createContractExecuteTransaction(method, params) {
    return new ContractExecuteTransaction()
    .setContractId(CONTRACT_ID)
    .setGas(3000000)
    .setFunction(method, params)
    .setMaxTransactionFee(new Hbar(0.75))
    .setTransactionId(TransactionId.generate(wallet.local.accountId))
    .setNodeAccountIds([new AccountId(3)])
    .freeze()
    .toBytes();
  }

  const addProject = useMutation(async ({ id, verified_kg }) => {
    const func = "addProject";
    const params = new ContractFunctionParameters().addString(id).addInt64(verified_kg);
    const tx = createContractExecuteTransaction(func, params);
    return await wallet.sendTransaction.mutateAsync(tx);
  }, { onSuccess: () => cache.invalidateQueries("projects") });

  const addTokensToTreasury = useMutation(async (amount) => {
    const func = "addTokensToTreasury";
    const params = new ContractFunctionParameters().addInt64(amount*TOKEN_EXP);
    const tx = createContractExecuteTransaction(func, params);
    return await wallet.sendTransaction.mutateAsync(tx);
  }, {
    onSuccess: () => cache.invalidateQueries("treasuryBalance")
  });

  const addVerifiedCarbon = useMutation(async ({ id, verified_kg }) => {
    const func = "addVerifiedCarbon";
    const params = new ContractFunctionParameters().addString(id).addInt64(verified_kg);
    const tx = createContractExecuteTransaction(func, params);
    return await wallet.sendTransaction.mutateAsync(tx);
  });

  const claimDemoTokens = useMutation(async (amount) => {
    const params = new ContractFunctionParameters().addInt64(amount*TOKEN_EXP);
    const tx = createContractExecuteTransaction("claimDemoTokensForStaking", params);
    return await wallet.sendTransaction.mutateAsync(tx);
  });

  const removeTimelockForProject = useMutation(async (id) => {
    const func = "removeTimelockForProject";
    const params = new ContractFunctionParameters().addString(id);
    const tx = createContractExecuteTransaction(func, params)
    return await wallet.sendTransaction.mutateAsync(tx);
  });

  const removeVerifiedCarbon = useMutation(async ({ id, verified_kg }) => {
    const func = "removeVerifiedCarbon";
    const params = new ContractFunctionParameters().addString(id).addInt64(verified_kg);
    const tx = createContractExecuteTransaction(func, params);
    return await wallet.sendTransaction.mutateAsync(tx);
  });

  const stakeTokensToProject = useMutation(async ({ id, amount, term }) => {
    const func = "stakeTokensToProject";
    const params = new ContractFunctionParameters().addString(id).addInt64(amount*TOKEN_EXP).addUint256(term);
    const tx = createContractExecuteTransaction(func, params);
    return await wallet.sendTransaction.mutateAsync(tx);
  });

  const unstakeTokensFromProject = useMutation(async (id) => {
    const func = "endStakeToProject";
    const params = new ContractFunctionParameters().addString(id);//.addInt64(amount*TOKEN_EXP);
    const tx = createContractExecuteTransaction(func, params);
    return await wallet.sendTransaction.mutateAsync(tx);
  });

  const updateClaimableTokens = useMutation(async (amount) => {
    const func = "updateClaimableTokens";
    const params = new ContractFunctionParameters().addInt64(amount*TOKEN_EXP);
    const tx = createContractExecuteTransaction(func, params)
    return await wallet.sendTransaction.mutateAsync(tx);
  });

  return {
    addProject,
    addTokensToTreasury,
    addVerifiedCarbon,
    claimDemoTokens,
    removeTimelockForProject,
    removeVerifiedCarbon,
    stakeTokensToProject,
    unstakeTokensFromProject,
    updateClaimableTokens
  }
}