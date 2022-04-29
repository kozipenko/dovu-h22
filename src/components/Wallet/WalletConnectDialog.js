import { ActionIcon, Anchor, Button, Center, Group, Loader, Modal, Stack, Text, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useClipboard } from "@mantine/hooks";
import { Copy, Help } from "tabler-icons-react";
import { connectToLocalWallet, toggleConnectDialog, useWallet } from "../../store/wallet";

export default function WalletConnectDialog() {
  const clipboard = useClipboard();
  const wallet = useWallet();

  const handleCopy = () => {
    clipboard.copy(wallet.connection.pairingString);
    showNotification({
      title: "Copied to clipboard",
      message: "Paste pairing string into HashPack to connect."
    });
  }

  return (
    <>
      <Button onClick={toggleConnectDialog}>Connect</Button>

      <Modal
        title="Connect Hedera Wallet"
        zIndex={1000}
        opened={wallet.isConnecting}
        onClose={toggleConnectDialog}
      >
        <Text size="sm" mb="md" color="dimmed">
          For more information please see
          <Anchor href="https://www.hashpack.app/hashconnect" size="sm" ml={4}>
            HashConnect
          </Anchor>
        </Text>
        <Stack spacing="xs">
          <Text size="sm" weight={500}>Manual</Text>
          <TextInput
            readOnly
            variant="filled"
            value={wallet.connection.pairingString}
            onFocus={e => e.target.select()}
            rightSection={
              <ActionIcon>
                <Copy size={18} onClick={handleCopy} />
              </ActionIcon>
            }
          />
        
          <Text size="sm" weight={500}>Extension</Text>

          {wallet.extensions.map(extension => (
            <Button onClick={() => connectToLocalWallet(extension)}>
              {extension.name}
            </Button>
          ))}

          {wallet.extensions.length < 1 && (
            <Group position="apart">
              <Text size="sm" color="dimmed">
                No extensions were found.
              </Text>
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
    </>
  );
}