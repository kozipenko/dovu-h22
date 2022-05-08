import axios from "axios";

const API_TOKEN = "3|X7zfL4pPstsqaqZsSa8IY1aS6ARCQVNSvwuDkxqP";

const api = axios.create({
  baseURL: "https://h22.dovu.dev/api/v1",
  headers: { "Authorization": `Bearer ${API_TOKEN}` }
});

export async function getProjects() {
  return await api.get("/projects").then(res => res.data.data);
}

export async function createProject(project) {
  return await api.post("/projects", project).status === 200;
}

export async function updateProject(project) {
  return await api.put(`/projects/${project.id}`, project);
}