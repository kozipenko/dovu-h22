import { Box, Button, Divider, Menu, Text } from "@mantine/core";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Gift, Leaf, Logout} from "tabler-icons-react";
import { useWallet } from "../../store/wallet";

export default function WalletMenu() {
  const wallet = useWallet();

  useEffect(() => {
    wallet.loadAccountBalance();
  }, []);

  return (
    <Menu control={<Button>{wallet.data.pairedAccount}</Button>}>
      <Box p="md">
        <Text size="xs" weight={500}>{wallet?.DOV?.balance/1000000} DOV</Text>
      </Box>
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