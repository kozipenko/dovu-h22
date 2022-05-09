import { HashConnect } from "hashconnect";
import { proxy, subscribe, useSnapshot } from "valtio";
import { getIsOwner, TOKEN_ID, TOKEN_EXP, NETWORK } from "./contract";

const APP_NAME = "Dovu Labs";
const APP_DESC = "Hedera22";
const APP_ICON = "NA";
const DAPP = { name: APP_NAME, description: APP_DESC, icon: APP_ICON };
const LOCAL_STORAGE_KEY = "wallet";

const hashConnect = new HashConnect(true);

function loadFromLocalStorage() {
  const local = localStorage.getItem(LOCAL_STORAGE_KEY);
  return local ? JSON.parse(local) : null;
}

export const wallet = proxy({
  topic: "",
  accountId: "",
  privateKey: "",
  extensions: [],
  metadata: null,
  pairingString: "",
  isContractOwner: false,
});

export const useWallet = () => useSnapshot(wallet);

export async function initializeWallet() {
  const local = loadFromLocalStorage();

  if (!local) {
    const init = await hashConnect.init(DAPP);
    const state = await hashConnect.connect();
    const pairingString = hashConnect.generatePairingString(state, NETWORK, false);

    wallet.topic = state.topic;
    wallet.privateKey = init.privKey;
    wallet.pairingString = pairingString;

    hashConnect.findLocalWallets();
  } else {
    await hashConnect.init(DAPP, local.privateKey);
    await hashConnect.connect(local.topic, local.metadata);

    wallet.topic = local.topic;
    wallet.metadata = local.metadata;
    wallet.accountId = local.accountId;
    wallet.extensions = local.extensions;
    wallet.privateKey = local.privateKey;
    wallet.pairingString = local.pairingString;
    wallet.isContractOwner = await getIsOwner();
  }

  hashConnect.pairingEvent.on(async (event) => {
    wallet.metadata = event.metadata;
    wallet.accountId = event.accountIds[0];
    wallet.isContractOwner = await getIsOwner();
  });

  hashConnect.foundExtensionEvent.on((extension) => wallet.extensions.push(extension));
}

export function connectToLocalWallet(extension) {
  hashConnect.connectToLocalWallet(wallet.pairingString, extension);
}

export function disconnectLocalWallet() {
  wallet.metadata = "";
  wallet.accountId = "";
  wallet.privateKey = "";
  wallet.isContractOwner = false;
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

export async function getAccountBalance() {
  const response = await hashConnect.getProvider(NETWORK, wallet.topic, wallet.accountId).getAccountBalance(wallet.accountId);
  const balance = JSON.parse(response);
  const token = balance.tokens.find(t => t.tokenId === TOKEN_ID);
  return token.balance / TOKEN_EXP;
}

export async function sendTransaction(transactionBytes) {
  return await hashConnect.sendTransaction(wallet.topic, {
    topic: wallet.topic,
    byteArray: transactionBytes,
    metadata: {
      accountToSign: wallet.accountId,
      returnTransaction: false
    }
  });
}

subscribe(wallet, () => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wallet)));