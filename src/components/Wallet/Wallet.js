import { useWallet } from "../../store/wallet";
import WalletMenu from "./WalletMenu";
import WalletDialog from "./WalletDialog";

export default function Wallet() {
  const wallet = useWallet();

  return wallet.data.pairedAccount ? <WalletMenu /> : <WalletDialog />
}