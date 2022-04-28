import { proxy, subscribe, useSnapshot } from "valtio";
import projects from "../data/projects";

export const state = proxy({
  data: projects,
  filters: {
    price: [0, 50],
    supply: [0, 100],
    maxApy: [0, 50],
    search: ""
  },

  openPurchaseDialog: (id) => {
    state.selected = state.data.find(p => p.id === id);
    state.isPurchaseDialogOpen = true;
  },

  openStakeDialog: (id) => {
    state.selected = state.data.find(p => p.id === id);
    state.isStakeDialogOpen = true;
  },

  closeDialog: () => {
    state.selected = null;
    state.isPurchaseDialogOpen = false;
    state.isStakeDialogOpen = false;
  },

  setPriceFilter: (price) => state.filters.price = price,

  setSupplyFilter: (supply) => state.filters.supply = supply,

  setMaxApyFilter: (maxApy) => state.filters.maxApy = maxApy,

  setSearchFilter: (search) => state.filters.search = search,
  
  resetFilters: () => {
    state.data = projects;
    state.filters.price = [0, 50];
    state.filters.supply = [0, 100];
    state.filters.maxApy = [0, 50];
    state.filters.search = "";
  }
});

export const useProjects = () => useSnapshot(state);

subscribe(state.filters, () =>
  state.data = projects
  .filter(p => p.price >= state.filters.price[0] && p.price <= state.filters.price[1])
  .filter(p => p.supply >= state.filters.supply[0] && p.supply <= state.filters.supply[1])
  .filter(p => p.maxApy >= state.filters.maxApy[0] && p.maxApy <= state.filters.maxApy[1])
  .filter(p => p.name.toLowerCase().includes(state.filters.search))
);