import { proxy, subscribe, useSnapshot } from "valtio";
import { HashConnect } from "hashconnect";

// network
const NETWORK = "testnet";
// wallet meta data for displaying in extensions (HashPack)
const APP_META = { name: "Hackathon", description: "Testing" };
// local storage key for connection data
const LOCAL_STORAGE_CONNECTION_KEY = "connection";

// hashconnect instance
const hashConnect = new HashConnect(true);

// initial wallet connection settings
const initialConnection = {
  topic: "",
  privateKey: "",
  pairingString: "",
  pairedAccount: null,
  pairedWalletData: null
};

// wallet store
export const wallet = proxy({
  extensions: [],
  connection: loadInitialConnection(),
  isConnecting: false
});

// use to access wallet store from components
export const useWallet = () => useSnapshot(wallet);

// save wallet connection to local storage when wallet connection changes
subscribe(wallet.connection, () =>
  localStorage.setItem(LOCAL_STORAGE_CONNECTION_KEY, JSON.stringify(wallet.connection)));

// send transaction bytes over hashconnect
export async function sendTransaction(transactionBytes) {
  return await hashConnect.sendTransaction(wallet.connection.topic, {
    topic: wallet.connection.topic,
    byteArray: transactionBytes,
    metadata: {
      accountToSign: wallet.connection.pairedAccount,
      returnTransaction: false
    }
  });
}

// load saved connection first from local storage or set initial connection
function loadInitialConnection() {
  const local = localStorage.getItem(LOCAL_STORAGE_CONNECTION_KEY);
  return local ? JSON.parse(local) : initialConnection;
};

// wallet pairing event
function handlePairingEvent(e) {
  wallet.isConnecting = false;
  wallet.connection.pairedAccount = e.accountIds[0];
  wallet.connection.pairedWalletData = e.metadata;
}

// chrome extension found event
function handleFoundExtensionEvent(e) {
  if (!wallet.extensions.includes(e))
    wallet.extensions.push(e);
}

// toggle wallet connect dialog
export function toggleConnectDialog() {
  wallet.isConnecting = !wallet.isConnecting;
}

// initialize hashconnect first from localstorage or initial connection
export async function initializeHashConnect() {
  const init = await hashConnect.init(APP_META, wallet.connection.privateKey);
  const conn = await hashConnect.connect(wallet.connection.topic, wallet.connection.pairedWalletData);
  const pairingString = hashConnect.generatePairingString(conn, NETWORK, false);

  hashConnect.findLocalWallets();
  hashConnect.pairingEvent.on(handlePairingEvent);
  hashConnect.foundExtensionEvent.on(handleFoundExtensionEvent);

  wallet.connection.pairingString = pairingString;
  wallet.connection.privateKey = init.privKey;
  wallet.connection.topic = conn.topic;
}

// connect to chrome extension (HashPack)
export function connectToLocalWallet(extension) {
  hashConnect.connectToLocalWallet(wallet.connection.pairingString, extension);
}

// disconnect from chrome extension (HashPack)
export function disconnectLocalWallet() {
  wallet.connection.pairedAccount = null;
  wallet.connection.pairedWalletData = null;
}