import qs from "qs";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

const API_TOKEN = "1|ufqTyAI5aFjQRMLMHglTW2GhiPwcofErytcx7Zws";

const api = axios.create({
  baseURL: "https://h22.dovu.dev/api/v1",
  headers: { "Authorization": `Bearer ${API_TOKEN}` }
});

export default function useProjects() {
  const queryClient = useQueryClient();

  const projects = useQuery("projects", () => api.get("/projects").then(res => res.data.data));

  const createProject = useMutation((project) => api.post("/projects", qs.stringify(project)).then(res => res.data.data), {
    onSuccess: () => queryClient.invalidateQueries("projects")
  });

  const updateProject = useMutation(({ id, ...rest }) => api.put(`/projects/${id}`, qs.stringify(rest)), {
    onSuccess: () => queryClient.invalidateQueries("projects")
  });

  const deleteProject = useMutation((id) => api.delete(`/projects/${id}`), {
    onSuccess: () => queryClient.invalidateQueries("projects")
  })

  return {
    projects,
    createProject,
    updateProject,
    deleteProject
  }
}