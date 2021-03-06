import { HashConnect } from "hashconnect";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { proxy, subscribe, useSnapshot } from "valtio";
import { TOKEN_ID, TOKEN_EXP, NETWORK, LOCAL_STORAGE_KEY, DAPP, CONTRACT_OWNER } from "../utils/constants";

const hashConnect = new HashConnect(true);

const store = proxy(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {
  topic: "",
  accountId: "",
  privateKey: "",
  extensions: [],
  metadata: null,
  pairingString: "",
  isContractOwner: false
});

subscribe(store, () => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store)));

export function useWallet() {
  const cache = useQueryClient();
  const local = useSnapshot(store);

  const accountBalance = useQuery("accountBalance", async () => {
    const res = await hashConnect.getProvider(NETWORK, local.topic, local.accountId).getAccountBalance(local.accountId);
    const balance = JSON.parse(res);
    const token = balance.tokens.find(t => t.tokenId === TOKEN_ID);
    return token ? token.balance/TOKEN_EXP : 0;
  }, { initialData: 0, enabled: !!local.accountId });

  const initializeWallet = useMutation(async () => {
    if (local.topic && local.privateKey && local.metadata) {
      await hashConnect.init(DAPP, local.privateKey);
      await hashConnect.connect(local.topic, local.metadata);
    } else {
      const init = await hashConnect.init(DAPP);
      const state = await hashConnect.connect();
      const pairingString = hashConnect.generatePairingString(state, NETWORK, false);

      store.topic = state.topic;
      store.privateKey = init.privKey;
      store.pairingString = pairingString;

      hashConnect.findLocalWallets();
    }

    hashConnect.pairingEvent.on((event) => {
      store.metadata = event.metadata;
      store.accountId = event.accountIds[0];
      store.isContractOwner = event.accountIds[0] === CONTRACT_OWNER;
    });

    hashConnect.foundExtensionEvent.on((extension) => {
      store.extensions = [extension];
    });
  });

  const sendTransaction = useMutation(async (tx) => {
    return await hashConnect.sendTransaction(local.topic, {
      topic: local.topic,
      byteArray: tx,
      metadata: {
        accountToSign: local.accountId,
        returnTransaction: false
      }
    });
  }, { onSuccess: () => cache.invalidateQueries("accountBalance") });

  const connectWallet = useMutation((extension) => {
    hashConnect.connectToLocalWallet(local.pairingString, extension);
  }, { onSuccess: () => cache.invalidateQueries("accountBalance") });

  const disconnectWallet = useMutation(async () => {
    store.accountId = "";
    store.metadata = null;
    store.isContractOwner = false;
  }, { onSuccess: () => cache.invalidateQueries("accountBalance") });

  return {
    local,
    accountBalance,
    initializeWallet,
    sendTransaction,
    connectWallet,
    disconnectWallet
  };
}