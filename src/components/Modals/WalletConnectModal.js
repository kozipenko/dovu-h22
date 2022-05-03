import { useEffect } from "react";
import { ActionIcon, Anchor, Button, Center, Group, Loader, Stack, Text, TextInput } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { Copy, Help } from "tabler-icons-react";
import { loadIsOwner } from "../../store/contract";
import { useWallet, connectToLocalWallet } from "../../store/wallet";

export default function WalletConnectModal({ context, id }) {
  const clipboard = useClipboard();
  const wallet = useWallet();

  function handleCopyPairingString() {
    clipboard.copy(wallet.connection.pairingString);
    showNotification({
      title: "Pairing string copied to clipboard",
    });
  }

  useEffect(() => {
    // check if paired account is owner account upon wallet connect
    loadIsOwner().catch(error => showNotification({
      title: "An error has occured checking for contract ownersip",
      message: error.message
    }));
  }, [wallet.connection.pairedAccount]);

  return wallet.connection.pairedAccount ? (
    <>
      <Text size="sm">
        Successfully paired account {wallet.connection.pairedAccount}
      </Text>
      <Button fullWidth mt="xl" onClick={() => context.closeModal(id)}>
        Continue
      </Button>
    </>
  ) : (
    <>
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
              <Copy size={18} onClick={handleCopyPairingString} />
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
    </>
  )
}