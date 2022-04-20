import { proxy, subscribe, useSnapshot } from "valtio";
import { subscribeKey } from "valtio/utils";
import { HashConnect } from "hashconnect";

const appMeta = { name: "DOVU", description: "Testing" };
const network = "testnet";

const hashConnect = new HashConnect();

const initialData = {
  topic: "",
  privateKey: null,
  pairingString: "",
  pairedAccount: "",
  pairedWalletData: null
}

const getLocalData = () => {
  const local = localStorage.getItem("hashconnect");
  return local ? JSON.parse(local) : initialData;
};

export const state = proxy({
  data: getLocalData() || initialData,
  extensions: [],
  isConnected: false,
  isModalOpen: false,

  toggleModal: () => state.isModalOpen = !state.isModalOpen,

  init: async () => {
    if (state.data.pairedWalletData) {
      await hashConnect.init(appMeta, state.data.privateKey);
      await hashConnect.connect(state.data.topic, state.data.pairedWalletData);
      state.isConnected = true;
    } else {
      const init = await hashConnect.init(appMeta);
      const conn = await hashConnect.connect();
      const pairingString = hashConnect.generatePairingString(conn, network, false);
      state.data = { ...state.data, pairingString, topic: conn.topic, privateKey: init.privKey };
      hashConnect.findLocalWallets();
    }

    hashConnect.pairingEvent.on(event => {
      state.isConnected = true;
      state.isModalOpen = false;
      state.data = { ...state.data, pairedAccount: event.accountIds[0], pairedWalletData: event.metadata };
    });

    hashConnect.foundExtensionEvent.on(extension => {
      if (!state.extensions.includes(extension))
        state.extensions.push(extension);
    })
  },

  disconnect: () => {
    state.isConnected = false;
    state.data = initialData;
  },

  connect: (extension) => hashConnect.connectToLocalWallet(state.data.pairingString, extension)
});

export const useWallet = () => useSnapshot(state);

subscribeKey(state, "data", () =>
  localStorage.setItem("hashconnect", JSON.stringify(state.data)));