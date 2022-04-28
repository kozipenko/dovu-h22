import { proxy, useSnapshot } from "valtio";
import projects from "../data/projects";

export const state = proxy({
  data: null,
  isPurchaseDialogOpen: false,
  isStakeDialogOpen: false,

  openPurchaseDialog: (id) => {
    state.isPurchaseDialogOpen = true;
    state.data = projects.find(p => p.id === id);
  },

  openStakeDialog: (id) => {
    state.isStakeDialogOpen = true;
    state.data = projects.find(p => p.id === id);
  },

  closeDialogs: () => {
    state.isPurchaseDialogOpen = false;
    state.isStakeDialogOpen = false;
    state.data = null;
  }
});

export const useProject = () => useSnapshot(state);