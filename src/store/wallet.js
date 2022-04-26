import { proxy, subscribe, useSnapshot } from "valtio";
import { initHashConnect } from "../services/hashconnect";
import { getAccountBalance } from "../services/hashgraph";

const initialData = {
  topic: "",
  privateKey: "",
  pairingString: "",
  pairedAccount: null,
  pairedWalletData: null
};

const loadInitialData = () => {
  const local = localStorage.getItem("hashconnect");
  return local ? JSON.parse(local) : initialData;
};

export const state = proxy({
  data: loadInitialData(),
  DOV: null,
  extensions: [],
  isModalOpen: false,

  init: async () => {
    const connection = await initHashConnect(
      state.data.pairedWalletData,
      state.data.privateKey, 
      state.data.topic,
      state.handlePairing,
      state.handleExtension
    );

    state.data.pairingString = connection.pairingString;
    state.data.privateKey = connection.privateKey;
    state.data.topic = connection.topic;
  },

  disconnect: () => {
    state.data.pairedAccount = null;
    state.data.pairedWalletData = null;
  },

  handlePairing: async (e) => {
    state.isModalOpen = false;
    state.data.pairedAccount = e.accountIds[0];
    state.data.pairedWalletData = e.metadata;
  },

  handleExtension: (e) => {
    if (!state.extensions.includes(e))
      state.extensions.push(e);
  },

  toggleModal: () => state.isModalOpen = !state.isModalOpen,

  loadAccountBalance: async () => {
    const balance = JSON.parse(await getAccountBalance(state.data.pairedAccount));
    state.DOV = balance.tokens.find(t => t.tokenId === "0.0.30875555");
  }
});

export const useWallet = () => useSnapshot(state);

subscribe(state.data, () => localStorage.setItem("hashconnect", JSON.stringify(state.data)));