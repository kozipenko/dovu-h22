import qs from "qs";
import axios from "axios";

const API_TOKEN = "1|PoLHrgSLCbhtzIlfEqseQq11g6Tc80cquSfRHaAu";

const api = axios.create({
  baseURL: "https://h22.dovu.dev/api/v1",
  headers: { "Authorization": `Bearer ${API_TOKEN}` }
});

export async function getProjects() {
  return await api.get("/projects").then(res => res.data.data);
}

export async function getProject(projectId) {
  return await api.get(`/projects/${projectId}`).then(res => res.data.data);
}

export async function updateProject(projectId, params) {
  return await api.put(`/projects/${projectId}`, qs.stringify(params));
}

export async function createProject(params) {
  return await api.post("/projects", qs.stringify(params)).then(res => res.data.data);
}

export async function getTotalStakedTokens(projectId) {
  const positions = await api.get("/staked").then(res => res.data.data);
  return positions.filter(pos => pos.project_id === projectId)
    .reduce((acc, obj) => acc + obj.dov_staked + obj.surrendered_dov, 0);
}

export async function getTotalSurrenderedTokens(projectId) {
  const positions = await api.get("/staked").then(res => res.data.data);
  return positions.filter(pos => pos.project_id === projectId)
    .reduce((acc, obj) => acc + obj.surrendered_dov, 0);
}

export async function getAllStakedTokens() {
  const positions = await api.get("/staked").then(res => res.data.data);
  return positions.reduce((acc, obj) => acc + obj.dov_staked + obj.surrendered_dov, 0);
}

export async function getAllSurrenderedTokens() {
  const positions = await api.get("/staked").then(res => res.data.data);
  return positions.reduce((acc, obj) => acc + obj.surrendered_dov, 0);
}

export async function getAllActiveStakingPositions() {
  const positions = await api.get("/staked").then(res => res.data.data);
  return positions.filter(pos => pos.is_closed === false).length;
}

// TODO: Hardcoded for now, will update SC to expose value.
export async function getStakingFee(amount) {
  return (amount * 5) / 100;
}

export async function getStakedPosition(accountId, projectId) {
  const positions = await api.get(`/staked/${accountId}/project/${projectId}`).then(res => res.data.data);
  return positions[positions.length-1];
}

export async function createStakedPosition(params) {
  return await api.post("/staked", qs.stringify(params)).then(res => res.data.data);
}

export async function closeStakedPosition(positionId, params) {
  return await api.put(`/staked/${positionId}`, qs.stringify(params))
    .then(res => res.status === 200);
}

export async function getStakePositions(accountId) {
  return await api.get(`/staked/${accountId}`).then(res => res.data.data);
}

export async function getAllStakedPositions() {
  return await api.get("/staked").then(res => res.data.data);
}