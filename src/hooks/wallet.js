import { HashConnect } from "hashconnect";
import { useMutation } from "react-query";
import { proxy, subscribe, useSnapshot } from "valtio";
import { TOKEN_ID, TOKEN_EXP, NETWORK, LOCAL_STORAGE_KEY, DAPP, CONTRACT_OWNER } from "../utils/constants";

const hashConnect = new HashConnect(true);

const initialState = {
  topic: "",
  accountId: "",
  privateKey: "",
  extensions: [],
  metadata: null,
  pairingString: "",
  isContractOwner: false
}

const state = proxy(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || initialState);

subscribe(state, () => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state)));

export default function useWallet() {
  const wallet = useSnapshot(state);

  const initializeWallet = useMutation(async () => {
    const init = await hashConnect.init(DAPP, wallet.privateKey);
    const connection = await hashConnect.connect(wallet.topic, wallet.metadata);
    const pairingString = hashConnect.generatePairingString(connection, NETWORK, false);

    if (!wallet.metadata) {
      state.topic = connection.topic;
      state.privateKey = init.privKey;
      state.pairingString = pairingString;

      hashConnect.findLocalWallets();

      hashConnect.pairingEvent.on((event) => {
        state.metadata = event.metadata;
        state.accountId = event.accountIds[0];
        state.isContractOwner = event.accountIds[0] === CONTRACT_OWNER;
      });

      hashConnect.foundExtensionEvent.on((extension) => state.extensions.push(extension));
    }
  });

  const connectWallet = useMutation((extension) => {
    hashConnect.connectToLocalWallet(wallet.pairingString, extension);
  });

  const disconnectWallet = useMutation(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    state.topic = "",
    state.accountId = "",
    state.privateKey = "",
    state.extensions = [],
    state.metadata = null,
    state.pairingString = "",
    state.isContractOwner = false
  });

  const getAccountBalance = useMutation(async () => {
    const response = await hashConnect.getProvider(NETWORK, wallet.topic, wallet.accountId).getAccountBalance(wallet.accountId);
    const balance = JSON.parse(response);
    const token = balance.tokens.find(t => t.tokenId === TOKEN_ID);
    return token.balance / TOKEN_EXP;
  });

  const sendTransaction = useMutation(async ({ tx }) => {
    return await hashConnect.sendTransaction(wallet.topic, {
      topic: wallet.topic,
      byteArray: tx,
      metadata: {
        accountToSign: wallet.accountId,
        returnTransaction: false
      }
    });
  });

  return {
    wallet,
    connectWallet,
    sendTransaction,
    initializeWallet,
    disconnectWallet,
    getAccountBalance
  }
}