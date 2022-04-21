import { proxy, useSnapshot } from "valtio";
import { subscribeKey } from "valtio/utils";

export const state = proxy({
  data: {},
  isModalOpen: false,
  
  open: (project) => {
    state.data = project;
    state.isModalOpen = true;
  },

  close: () => {
    state.isModalOpen = false;
    state.data = {};
  }
});

export const useProject = () => useSnapshot(state);