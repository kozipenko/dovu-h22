import { ActionIcon, Button, Modal, TextInput, Divider, Stack, Loader, Center, Text, Group, Anchor } from "@mantine/core";
import { Link } from "react-router-dom";
import { useClipboard } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { Copy, Help } from "tabler-icons-react";
import { useWallet } from "../store/wallet";

export default function WalletConnect() {
  const clipboard = useClipboard();
  const wallet = useWallet();
  
  const handleCopyPairingString = () => {
    clipboard.copy(wallet.data.pairingString);
    showNotification({
      title: "Copied to clipboard",
      message: "Paste pairing string into HashPack to connect."
    });
  }

  return (
    <>
      <Modal title={<Text weight={700}>Connect Hedera Wallet</Text>} opened={wallet.isModalOpen} onClose={wallet.toggleModal}>
        <Text size="sm" color="dimmed" mb="md">
          For more information please see
          <Anchor size="sm" ml={4} href="https://www.hashpack.app/hashconnect">HashConnect.</Anchor>
        </Text>
        <Stack spacing="xs">
          <Text size="sm" weight={500}>Manual</Text>
          <TextInput
            readOnly
            variant="filled"
            value={wallet.data.pairingString}
            onFocus={e => e.target.select()}
            rightSection={<ActionIcon><Copy size={18} onClick={handleCopyPairingString} /></ActionIcon>}
          />
        
          <Text size="sm" weight={500}>Extension</Text>

          {wallet.extensions.map(extension =>
            <Button onClick={() => wallet.connect(extension)}>{extension.name}</Button>
          )}

          {wallet.extensions.length < 1 && (
            <Group position="apart">
              <Text size="sm" color="dimmed">No extensions were found.</Text>
              <ActionIcon>
                <Help size={18} />
              </ActionIcon>
            </Group>
          )}

          <Center mt="md">
            <Loader size="sm" variant="dots" />
          </Center>
          
        </Stack>
      </Modal>

      <Button onClick={wallet.toggleModal}>Connect</Button>
    </>
  );
}