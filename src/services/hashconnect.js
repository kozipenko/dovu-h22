import { HashConnect } from "hashconnect";

const meta = { name: "DOVU", description: "Testing" };
const network = "testnet";
const hashConnect = new HashConnect();

export const initHashConnect = async (pairedWalletData, privateKey, topic, onPairing, onExtension) => {
  const init = await hashConnect.init(meta, privateKey);
  const state = await hashConnect.connect(topic, pairedWalletData);
  const pairingString = hashConnect.generatePairingString(state, network, false);

  hashConnect.findLocalWallets();
  hashConnect.pairingEvent.on(onPairing);
  hashConnect.foundExtensionEvent.on(onExtension);

  return { pairingString, topic: state.topic, privateKey: init.privKey };
}

export const connectToLocalWallet = (pairingString, extension) =>
  hashConnect.connectToLocalWallet(pairingString, extension);