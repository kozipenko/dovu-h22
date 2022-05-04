import { proxy, subscribe, useSnapshot } from "valtio";
import projectsData from "../data/projects";

// projects store
export const projects = proxy({
  filtered: projectsData,
  filters: {
    price: [0, 50],
    supply: [0, 100],
    maxApy: [0, 50],
    search: ""
  }
});

// use to access projects store from components
export const useProjects = () => useSnapshot(projects);

// update filtered projects when filters change
subscribe(projects.filters, () =>
  projects.filtered = projectsData
  .filter(p => p.price >= projects.filters.price[0] && p.price <= projects.filters.price[1])
  .filter(p => p.supply >= projects.filters.supply[0] && p.supply <= projects.filters.supply[1])
  .filter(p => p.maxApy >= projects.filters.maxApy[0] && p.maxApy <= projects.filters.maxApy[1])
  .filter(p => p.name.toLowerCase().includes(projects.filters.search))
);

// set price filter
export function setPriceFilter(price) {
  projects.filters.price = price;
}

// set max apy filter
export function setMaxApyFilter(maxApy) {
  projects.filters.maxApy = maxApy;
}

// set supply filter
export function setSupplyFilter(supply) {
  projects.filters.supply = supply;
}

// set search filter
export function setSearchFilter(search) {
  projects.filters.search = search;
}

// reset all filters
export function resetFilters() {
  projects.filters.price = [0, 50];
  projects.filters.maxApy = [0, 50];
  projects.filters.supply = [0, 100];
  projects.filters.search = "";
}