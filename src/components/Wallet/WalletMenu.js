import { Button, Divider, Group, Menu, Text } from "@mantine/core";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Gift, Leaf, Logout} from "tabler-icons-react";
import { useWallet } from "../../store/wallet";

export default function WalletMenu() {
  const wallet = useWallet();

  useEffect(() => {
    wallet.loadAccountBalance()
    //wallet.sendTestTransaction()
  }, []);

  return (
    <Menu control={<Button>{wallet.data.pairedAccount}</Button>} zIndex={1000}>
      <Group position="apart" px="sm" py="xs">
        <Text size="xs" weight={500}>Balance:</Text>
        <Text size="xs" weight={500}>{Math.round(wallet?.balance?.balance/1000000) || 0} DOV</Text>
      </Group>
      <Divider />
      <Menu.Item to="/offsets" component={Link} icon={<Leaf size={18} />}>
        Offsets
      </Menu.Item>
      <Menu.Item to="/staking" component={Link} icon={<Gift size={18} />}>
        Staking
      </Menu.Item>
      <Divider />
      <Menu.Item icon={<Logout size={18} />} onClick={wallet.disconnect}>
        Disconnect
      </Menu.Item>
    </Menu>
  );
}