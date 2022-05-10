import qs from "qs";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

const API_TOKEN = "1|ufqTyAI5aFjQRMLMHglTW2GhiPwcofErytcx7Zws";

const api = axios.create({
  baseURL: "https://h22.dovu.dev/api/v1",
  headers: { "Authorization": `Bearer ${API_TOKEN}` }
});

export default function usePositions() {
  const queryClient = useQueryClient();

  const positions = useQuery("positions", () => api.get("/staked").then(res => res.data.data));

  const createPosition = useMutation((position) => api.post("/staked", qs.stringify(position)), {
    onSuccess: () => queryClient.invalidateQueries("positions")
  });

  const updatePosition = useMutation(({ id, ...rest }) => api.put(`/staked/${id}`, qs.stringify(rest)), {
    onSuccess: () => queryClient.invalidateQueries("positions")
  });

  return {
    positions,
    createPosition,
    updatePosition
  }
}