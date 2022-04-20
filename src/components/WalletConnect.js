import { ActionIcon, Button, Modal, TextInput, Divider, Stack, Loader, Center, Text, Group } from "@mantine/core";
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
      <Modal title="Connect Hedera wallet" opened={wallet.isModalOpen} onClose={wallet.toggleModal}>
        <Stack>
          <Divider label="Use pairing string" labelPosition="center" />

          <TextInput
            readOnly
            variant="filled"
            value={wallet.data.pairingString}
            onFocus={e => e.target.select()}
            rightSection={<ActionIcon><Copy size={18} onClick={handleCopyPairingString} /></ActionIcon>}
          />

          <Divider label="Use extension" labelPosition="center" />

          {wallet.extensions.map(extension =>
            <Button onClick={() => wallet.connect(extension)}>{extension.name}</Button>)}

          {wallet.extensions.length < 1 && (
            <Group position="apart">
              <Text size="sm">No extensions were found.</Text>
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