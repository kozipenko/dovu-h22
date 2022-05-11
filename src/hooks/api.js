import qs from "qs";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useWallet from "./wallet";

const API_TOKEN = "1|ufqTyAI5aFjQRMLMHglTW2GhiPwcofErytcx7Zws";

const api = axios.create({
  baseURL: "https://h22.dovu.dev/api/v1",
  headers: { "Authorization": `Bearer ${API_TOKEN}` }
});

export default function useApi() {
  const { wallet } = useWallet();
  const queryClient = useQueryClient();

  const getTreasuryBalance = useQuery("getTreasuryBalance", async () => {
    const res = await api.get("/owner");
    return res.data.data.treasury_balance;
  }, { initialData: 0 });

  const getClaimedTokens = useQuery("getClaimedTokens", async () => {
    const res = await api.get(`/account-token-claims/${wallet.accountId}`);
    return res.data.data.reduce((acc, obj) => acc + obj.amount, 0);
  }, { initialData: 0 });

  const getProjects = useQuery("getProjects", async () => {
    const res = await api.get("/projects");
    return res.data.data;
  }, { initialData: [] });

  const getPositions = useQuery("getPositions", async () => {
    const res = await api.get("/staked");
    return res.data.data;
  }, { initialData: [] });

  const getMaxClaimableTokens = useQuery("getMaxClaimableTokens", async () => {
    const res = await api.get("/max-claimable-tokens");
    return res.data.data.max_tokens;
  }, { initialData: 0 });

  const createClaimedToken = useMutation(async (amount) => {
    await api.post("/account-token-claims", qs.stringify({
      hedera_account: wallet.accountId,
      amount
    }));
  }, {
    onSuccess: () => queryClient.invalidateQueries("getClaimedTokens")
  });

  const createProject = useMutation(async (project) => {
    const res = await api.post("/projects", qs.stringify(project))
    return res.data.data;
  }, {
    onSuccess: () => queryClient.invalidateQueries("getProjects")
  });

  const createPosition = useMutation(async (position) => {
    await api.post("/staked", qs.stringify(position));
  }, {
    onSuccess: () => queryClient.invalidateQueries("getPositions")
  });

  const updateClaimedToken = useMutation(({ params }) =>
    api.put(`/account-token-claims/${wallet.accountId}`, qs.stringify(params)), {
    onSuccess: () => queryClient.invalidateQueries("getClaimedTokens")
  });

  const updateProject = useMutation(async ({ id, ...params }) => {
    await api.put(`/projects/${id}`, qs.stringify(params));
  }, {
    onSuccess: () => queryClient.invalidateQueries("getProjects")
  });

  const updatePosition = useMutation(async ({ id, ...params }) => {
    await api.put(`/staked/${id}`, qs.stringify(params));
  }, {
    onSuccess: () => queryClient.invalidateQueries("getPositions")
  });

  const updateMaxClaimableTokens = useMutation(async (amount) => {
    await api.put("/max-claimable-tokens/1", qs.stringify({ max_tokens: amount }));
  }, {
    onSuccess: () => queryClient.invalidateQueries("getMaxClaimableTokens")
  });

  const deleteProject = useMutation(async (id) => {
    await api.delete(`/projects/${id}`);
  }, {
    onSuccess: () => queryClient.invalidateQueries("getProjects")
  });

  return {
    getClaimedTokens,
    getProjects,
    getPositions,
    getMaxClaimableTokens,
    getTreasuryBalance,
    createClaimedToken,
    createProject,
    createPosition,
    updateClaimedToken,
    updateProject,
    updatePosition,
    updateMaxClaimableTokens,
    deleteProject
  }
}