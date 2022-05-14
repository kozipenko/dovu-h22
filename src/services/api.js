import qs from "qs";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { API_TOKEN } from "../utils/constants";
import { useWallet } from "./wallet";

const client = axios.create({
  baseURL: "https://h22.dovu.dev/api/v1",
  headers: { "Authorization": `Bearer ${API_TOKEN}` }
});

export function useApi() {
  const cache = useQueryClient();
  const wallet = useWallet();

  const treasuryBalance = useQuery("treasuryBalance", async () => {
    const res = await client.get("/owner");
    return res.data.data.treasury_balance;
  }, { initialData: 0 });

  const claimedTokens = useQuery("claimedTokens", async () => {
    let res = null; 
    try {
      res = await client.get(`/account-token-claims/${wallet.local.accountId}`);
      return res.data.data.reduce((acc, obj) => acc + obj.amount, 0);
    } catch(error) {
      if (error.response.status === 404) {
        await createTokenClaim.mutateAsync(0);
      }
    }
  }, { initialData: 0, enabled: !!wallet.local.accountId, retry: false });

  const projects = useQuery("projects", async () => {
    const res = await client.get("/projects");
    return res.data.data;
  }, { initialData: [] });

  const positions = useQuery("positions", async () => {
    const res = await client.get("/staked");
    return res.data.data;
  }, { initialData: [] });

  const maxClaimableTokens = useQuery("maxClaimableTokens", async () => {
    const res = await client.get("/max-claimable-tokens");
    return res.data.data.max_tokens;
  }, { initialData: 0 });

  const createTokenClaim = useMutation(async (amount) => {
    await client.post("/account-token-claims", qs.stringify({
      hedera_account: wallet.local.accountId,
      amount
    }));
  }, {
    onSuccess: () => cache.invalidateQueries("claimedTokens")
  });

  const createProject = useMutation(async (project) => {
    const res = await client.post("/projects", qs.stringify(project))
    return res.data.data;
  }, {
    onSuccess: () => cache.invalidateQueries("projects")
  });

  const createPosition = useMutation(async (position) => {
    const res = await client.post("/staked", qs.stringify(position));
    return res.data.data;
  }, {
    onSuccess: () => cache.invalidateQueries("positions")
  });

  const updateTokenClaim = useMutation((amount) =>
    client.put(`/account-token-claims/${wallet.local.accountId}`, qs.stringify({ amount })), {
    onSuccess: () => cache.invalidateQueries("claimedTokens")
  });

  const updateProject = useMutation(async ({ id, ...rest }) => {
    await client.put(`/projects/${id}`, qs.stringify(rest));
  }, {
    onSuccess: () => cache.invalidateQueries("projects")
  });

  const updatePosition = useMutation(async ({ id, ...rest }) => {
    const res = await client.put(`/staked/${id}`, qs.stringify(rest));
    return res.data.data;
  }, {
    onSuccess: () => cache.invalidateQueries("positions")
  });

  const updateMaxClaimableTokens = useMutation(async (amount) => {
    await client.put("/max-claimable-tokens/1", qs.stringify({ max_tokens: amount }));
  }, {
    onSuccess: () => cache.invalidateQueries("maxClaimableTokens")
  });

  const deleteProject = useMutation(async (id) => {
    await client.delete(`/projects/${id}`);
  }, {
    onSuccess: () => cache.invalidateQueries("projects")
  });

  return {
    claimedTokens,
    projects,
    positions,
    maxClaimableTokens,
    treasuryBalance,
    createTokenClaim,
    createProject,
    createPosition,
    updateTokenClaim,
    updateProject,
    updatePosition,
    updateMaxClaimableTokens,
    deleteProject
  }
}