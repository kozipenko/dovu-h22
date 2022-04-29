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

const ACCOUNT_ID = process.env.REACT_APP_ACCOUNT_ID;
const PRIVATE_KEY =  process.env.REACT_APP_PRIVATE_KEY;
const NETWORK = "testnet";
const TOKEN_ID = "0.0.30875555";
const APP_META = { name: "Hackathon", description: "Testing" };
const STAKABLE_CONTRACT_ID = "0.0.34353158";

const client = Client
  .forName(NETWORK)
  .setOperator(AccountId.fromString(ACCOUNT_ID), PrivateKey.fromString(PRIVATE_KEY));

const hashConnect = new HashConnect(true);

const initialConnection = {
  topic: "",
  privateKey: "",
  pairingString: "",
  pairedAccount: null,
  pairedWalletData: null
};

export const wallet = proxy({
  balance: null,
  extensions: [],
  connection: loadInitialConnection(),
  isConnecting: false
});

subscribe(wallet.connection, () =>
  localStorage.setItem("hashconnect", JSON.stringify(wallet.connection)));

export const useWallet = () => useSnapshot(wallet);

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

async function makeBytes(transaction) {
  transaction.setTransactionId(TransactionId.generate(wallet.connection.pairedAccount));
  transaction.setNodeAccountIds([new AccountId(3)]);
  await transaction.freeze();
  return transaction.toBytes();
}

async function createContractExecuteTransaction(func, params) {
  const transaction = new ContractExecuteTransaction()
  .setContractId(STAKABLE_CONTRACT_ID)
  .setGas(100000)
  .setPayableAmount(new Hbar(10))
  .setFunction(func, params)
  .setMaxTransactionFee(new Hbar(0.75));

  return await makeBytes(transaction);
}

function loadInitialConnection() {
  const local = localStorage.getItem("hashconnect");
  return local ? JSON.parse(local) : initialConnection;
};

function handlePairingEvent(e) {
  wallet.isConnecting = false;
  wallet.connection.pairedAccount = e.accountIds[0];
  wallet.connection.pairedWalletData = e.metadata;
}

function handleFoundExtensionEvent(e) {
  if (!wallet.extensions.includes(e))
    wallet.extensions.push(e);
}

export async function queryTokenBalance() {
  const response = await new AccountBalanceQuery()
    .setAccountId(wallet.connection.pairedAccount)
    .execute(client);
  const accountBalance = JSON.parse(response);
  const DOV = accountBalance.tokens.find(t => t.tokenId === TOKEN_ID);
  wallet.balance = DOV ? Math.round(DOV.balance/1000000).toLocaleString() : 0;
}

export function toggleConnectDialog() {
  wallet.isConnecting = !wallet.isConnecting;
}

export async function claimDemoTokensForStaking(amount=1) {
  const func = "claimDemoTokensForStaking";
  const params = new ContractFunctionParameters().addInt64(amount);
  const transactionBytes = await createContractExecuteTransaction(func, params);

  const response = await sendTransaction(transactionBytes);

  console.log(response);
}

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

export function connectToLocalWallet(extension) {
  hashConnect.connectToLocalWallet(wallet.connection.pairingString, extension);
}

export function disconnectLocalWallet() {
  wallet.connection.pairedAccount = null;
  wallet.connection.pairedWalletData = null;
}