import { proxy, subscribe, useSnapshot } from "valtio";
import projectsData from "../data/projects";

export const projects = proxy({
  list: projectsData,
  filtered: projectsData,
  filters: { priceKg: [0, 100], verifiedKg: [0, 1000], search: "" }
});

export const useProjects = () => useSnapshot(projects);

subscribe(projects.list, filterProjects);
subscribe(projects.filters, filterProjects);

export function createProject(newProject) {
  projects.list.push(newProject)
}

export function updateProject({ id, name, image, priceKg }) {
  const project = projects.list.find(p => p.id === id);
  project.name = name;
  project.image = image;
  project.priceKg = priceKg;
}

function filterProjects() {
  projects.filtered = projects.list
  .filter(p => p.priceKg >= projects.filters.priceKg[0] && p.priceKg <= projects.filters.priceKg[1])
  .filter(p => p.name.toLowerCase().includes(projects.filters.search))
}

// set price filter
export function setPriceKgFilter(values) {
  projects.filters.priceKg = values;
}

// set verified carbon filter
export function setVerifiedKgFilter(values) {
  projects.filters.verifiedKg = values;
}

// set search filter
export function setSearchFilter(value) {
  projects.filters.search = value;
}

// reset all filters
export function resetFilters() {
  projects.filters.priceKg = [0, 100];
  projects.filters.verifiedKg = [0, 1000];
  projects.filters.search = "";
}