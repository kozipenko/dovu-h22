import { proxy, subscribe, useSnapshot } from "valtio";
import { HashConnect } from "hashconnect";
import {
  AccountBalanceQuery,
  AccountId,
  Client,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  Hbar,
  PrivateKey,
  TransactionId
} from "@hashgraph/sdk";

// testnet account needed for account balance queries
const ACCOUNT_ID = process.env.REACT_APP_ACCOUNT_ID;
const PRIVATE_KEY =  process.env.REACT_APP_PRIVATE_KEY;
const NETWORK = "testnet";
// token used for staking
const TOKEN_ID = "0.0.30875555";
// stakable contract id
const STAKABLE_CONTRACT_ID = "0.0.34353158";
// wallet meta data for displaying in extensions (HashPack)
const APP_META = { name: "Hackathon", description: "Testing" };

// client needed for account balance queries
const client = Client
  .forName(NETWORK)
  .setOperator(AccountId.fromString(ACCOUNT_ID), PrivateKey.fromString(PRIVATE_KEY));

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
  balance: null,
  extensions: [],
  connection: loadInitialConnection(),
  isConnecting: false
});

// use to access wallet store from components
export const useWallet = () => useSnapshot(wallet);

// save wallet connection to local storage when wallet connection changes
subscribe(wallet.connection, () =>
  localStorage.setItem("hashconnect", JSON.stringify(wallet.connection)));

// send transaction bytes over hashconnect
async function sendTransaction(transactionBytes) {
  return await hashConnect.sendTransaction(wallet.connection.topic, {
    topic: wallet.connection.topic,
    byteArray: transactionBytes,
    metadata: {
      accountToSign: wallet.connection.pairedAccount,
      returnTransaction: false
    }
  });
}

// helper to create transaction
async function createContractExecuteTransaction(func, params) {
  const transaction = new ContractExecuteTransaction()
  .setContractId(STAKABLE_CONTRACT_ID)
  .setGas(100000)
  .setPayableAmount(new Hbar(10))
  .setFunction(func, params)
  .setMaxTransactionFee(new Hbar(0.75))
  .setTransactionId(TransactionId.generate(wallet.connection.pairedAccount))
  .setNodeAccountIds([new AccountId(3)]);

  await transaction.freeze();

  return transaction.toBytes();
}

// load saved connection first from local storage or set initial connection
function loadInitialConnection() {
  const local = localStorage.getItem("hashconnect");
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

// query account balance and retrieve token balance
export async function queryTokenBalance() {
  const response = await new AccountBalanceQuery()
    .setAccountId(wallet.connection.pairedAccount)
    .execute(client);
  const accountBalance = JSON.parse(response);
  const DOV = accountBalance.tokens.find(t => t.tokenId === TOKEN_ID);
  wallet.balance = DOV ? Math.round(DOV.balance/1000000).toLocaleString() : 0;
}

// toggle wallet connect dialog
export function toggleConnectDialog() {
  wallet.isConnecting = !wallet.isConnecting;
}

// contract call to claim tokens
// receiving "CONTRACT_REVERT_EXECUTED"
// WHY?
export async function claimDemoTokensForStaking(amount=1) {
  const func = "claimDemoTokensForStaking";
  const params = new ContractFunctionParameters().addInt64(amount);
  const transactionBytes = await createContractExecuteTransaction(func, params);

  const response = await sendTransaction(transactionBytes);

  console.log(response);
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