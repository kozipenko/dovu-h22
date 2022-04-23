import { proxy, useSnapshot } from "valtio";
import projects from "../data/projects";

export const state = proxy({
  data: projects,
  selected: null,

  select: (id) => state.selected = state.data.find(p => p.id === id),

  deselect: () => state.selected = null,

  filterByPrice: (prices) =>
    state.data = projects.filter(p => p.price >= prices[0] && p.price <= prices[1]),
  
  filterBySupply: (supplies) =>
    state.data = projects.filter(p => p.supply >= supplies[0] && p.supply <= supplies[1]),

  filterByApy: (apy) =>
    state.data = projects.filter(p => p.maxApy >= apy[0] && p.maxApy <= apy[1]),

  filterByText: (text) =>
    state.data = projects.filter(p => p.name.toLowerCase().includes(text)),
  
  resetFilters: () => state.data = projects
});

export const useProjects = () => useSnapshot(state);