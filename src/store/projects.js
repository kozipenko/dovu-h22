import { proxy, useSnapshot } from "valtio";
import projects from "../data/projects";

export const state = proxy({
  data: projects,
  activeProject: {},
  filters: {
    prices: [0, 50],
    supplies: [0, 100]
  },
  isProjectOpen: false,
  isFiltersOpen: false,

  openProject: (id) => {
    state.activeProject = projects.find(p => p.id === id);
    state.isProjectOpen = true;
  },

  closeProject: () => {
    state.activeProject = {};
    state.isProjectOpen = false;
  },

  openFilters: () => state.isFiltersOpen = true,

  closeFilters: () => state.isFiltersOpen = false,

  setPriceFilter: (prices) => state.filters.prices = prices,

  setSuppliesFilter: (supplies) => state.filters.supplies = supplies
});

export const useProjects = () => useSnapshot(state);