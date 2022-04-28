import { useWallet } from "../../store/wallet";
import WalletMenu from "./WalletMenu";
import WalletConnectDialog from "./WalletConnectDialog";

export default function Wallet() {
  const wallet = useWallet();

  return (
    <>
      {wallet.data.pairedAccount ? <WalletMenu /> : <WalletConnectDialog />}
    </>
  );
}