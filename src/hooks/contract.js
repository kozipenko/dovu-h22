import { AccountId, ContractExecuteTransaction, ContractFunctionParameters, Hbar, TransactionId } from "@hashgraph/sdk";
import { useMutation, useQueryClient } from "react-query";
import { CONTRACT_ID, TOKEN_EXP } from "../utils/constants";
import useWallet from "./wallet";

export default function useContract() {
  const { sendTransaction, wallet } = useWallet();
  const queryClient = useQueryClient();

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

  const addProject = useMutation(async ({ projectId, verifiedKg }) => {
    const func = "addProject";
    const params = new ContractFunctionParameters().addString(projectId).addInt64(verifiedKg);
    const tx = createContractExecuteTransaction(func, params);
    return await sendTransaction.mutateAsync({ tx });
  });

  const addTokensToTreasury = useMutation(async (amount) => {
    const func = "addTokensToTreasury";
    const params = new ContractFunctionParameters().addInt64(amount*TOKEN_EXP);
    const tx = createContractExecuteTransaction(func, params);
    return await sendTransaction.mutateAsync({ tx });
  }, {
    onSuccess: () => queryClient.invalidateQueries("getTreasuryBalance")
  });

  const addVerifiedCarbon = useMutation(async ({ projectId, verifiedKg }) => {
    const func = "addVerifiedCarbon";
    const params = new ContractFunctionParameters().addString(projectId).addInt64(verifiedKg);
    const tx = createContractExecuteTransaction(func, params);
    return await sendTransaction.mutateAsync({ tx });
  });

  const claimDemoTokens = useMutation(async (amount) => {
    const params = new ContractFunctionParameters().addInt64(amount*TOKEN_EXP);
    const tx = createContractExecuteTransaction("claimDemoTokensForStaking", params);
    return await sendTransaction.mutateAsync({ tx });
  });

  const removeTimelockForProject = useMutation(async (projectId) => {
    const func = "removeTimelockForProject";
    const params = new ContractFunctionParameters().addString(projectId);
    const tx = createContractExecuteTransaction(func, params)
    return await sendTransaction.mutateAsync({ tx });
  });

  const removeVerifiedCarbon = useMutation(async ({ projectId, verifiedKg }) => {
    const func = "removeVerifiedCarbon";
    const params = new ContractFunctionParameters().addString(projectId).addInt64(verifiedKg);
    const tx = createContractExecuteTransaction(func, params);
    return await sendTransaction.mutateAsync({ tx });
  });

  const stakeTokensToProject = useMutation(async ({ projectId, amount, term }) => {
    const func = "stakeTokensToProject";
    const params = new ContractFunctionParameters().addString(projectId).addInt64(amount*TOKEN_EXP).addUint256(term);
    const tx = createContractExecuteTransaction(func, params);
    return await sendTransaction.mutateAsync({ tx });
  });

  const unstakeTokensFromProject = useMutation(async (projectId) => {
    const func = "endStakeToProject";
    const params = new ContractFunctionParameters().addString(projectId);//.addInt64(amount*TOKEN_EXP);
    const tx = createContractExecuteTransaction(func, params);
    return await sendTransaction.mutateAsync({ tx });
  });

  const updateClaimableTokens = useMutation(async (amount) => {
    const func = "updateClaimableTokens";
    const params = new ContractFunctionParameters().addInt64(amount*TOKEN_EXP);
    const tx = createContractExecuteTransaction(func, params)
    return await sendTransaction.mutateAsync({ tx });
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