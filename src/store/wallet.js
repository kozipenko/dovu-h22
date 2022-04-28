import { proxy, subscribe, useSnapshot } from "valtio";
import { initHashConnect, connectToLocalWallet, sendTransaction } from "../services/hashconnect";
import { claimDemoTokensForStaking, getAccountBalance } from "../services/hashgraph";

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
  balance: null,
  extensions: [],
  isConnectDialogOpen: false,

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

  connect: (extension) => connectToLocalWallet(state.data.pairingString, extension),

  disconnect: () => {
    state.data.pairedAccount = null;
    state.data.pairedWalletData = null;
  },

  handlePairing: async (e) => {
    state.isConnectDialogOpen = false;
    state.data.pairedAccount = e.accountIds[0];
    state.data.pairedWalletData = e.metadata;
  },

  handleExtension: (e) => {
    if (!state.extensions.includes(e))
      state.extensions.push(e);
  },

  toggleConnectDialog: () => state.isConnectDialogOpen = !state.isConnectDialogOpen,

  loadAccountBalance: async () => {
    const response = JSON.parse(await getAccountBalance(state.data.pairedAccount));
    const DOV = response.tokens.find(t => t.tokenId === "0.0.30875555");
    state.balance = DOV ? Math.round(DOV.balance/1000000).toLocaleString() : 0;
  },

  claimDemoTokens: async () => {
    const txnBytes = claimDemoTokensForStaking();
    console.log(txnBytes)
    const response = await sendTransaction(state.data.pairedAccount, state.data.topic, txnBytes);
    console.log(response);
  }
});

export const useWallet = () => useSnapshot(state);

subscribe(state.data, () => localStorage.setItem("hashconnect", JSON.stringify(state.data)));