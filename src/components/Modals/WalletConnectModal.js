import { useEffect } from "react";
import { ActionIcon, Anchor, Button, Group, Loader, Paper, Stack, Text, TextInput } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { Copy, Help, SquareCheck } from "tabler-icons-react";
import { loadAccountBalance, loadIsOwner, TOKEN_EXP, TOKEN_NAME, useContract } from "../../store/contract";
import { useWallet, connectToLocalWallet } from "../../store/wallet";

export default function WalletConnectModal({ context, id }) {
  const clipboard = useClipboard();
  const wallet = useWallet();
  const contract = useContract();
  const intNoFmt = new Intl.NumberFormat("en-GB");

  function handleCopyPairingString() {
    clipboard.copy(wallet.connection.pairingString);
    showNotification({
      title: "Pairing string copied to clipboard",
    });
  }

  useEffect(() => {
    loadAccountBalance().catch(error => showNotification({
      title: "An error has occured loading account balance",
      message: error.message
    }));

    loadIsOwner().catch(error => showNotification({
      title: "An error has occured checking for contract ownersip",
      message: error.message
    }));
  }, [wallet.connection.pairedAccount]);

  return wallet.connection.pairedAccount ? (
    <>
      <Group spacing="xs">
        <SquareCheck color="#4c6ef5" size={18} />
        <Text size="sm">
          Your wallet has been successfully paired.
        </Text>
      </Group>

      <Paper withBorder mt="xl" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">Account:</Text>
          <Text size="xs" weight={500}>{wallet.connection.pairedAccount}</Text>
        </Group>
        <Group mt="xs" position="apart">
          <Text size="xs" color="dimmed">Account Balance:</Text>
          <Text size="xs" weight={500}>{intNoFmt.format(contract.accountBalance/TOKEN_EXP)} {TOKEN_NAME}</Text>
        </Group>
      </Paper>

      <Button fullWidth variant="light" mt="xl" onClick={() => context.closeModal(id)}>
        Continue
      </Button>
    </>
  ) : (
    <>
      <Text size="sm">
        For more information, please visit
        <Anchor href="https://www.hashpack.app/hashconnect" size="sm" ml={4}>
          HashConnect
        </Anchor>
      </Text>
      
      <Text size="xs" mt="xl" color="dimmed">Manual</Text>
      <TextInput
        readOnly
        mt="xs"
        variant="filled"
        value={wallet.connection.pairingString}
        onFocus={e => e.target.select()}
        rightSection={
          <ActionIcon>
            <Copy size={18} onClick={handleCopyPairingString} />
          </ActionIcon>
        }
      />
      
      <Text size="xs" mt="md" color="dimmed">Extension</Text>

      {wallet.extensions.map(extension => (
        <Button fullWidth mt="xs" onClick={() => connectToLocalWallet(extension)}>
          {extension.name}
        </Button>
      ))}

      {wallet.extensions.length < 1 && (
        <Group position="apart" mt="xs">
          <Text size="sm">
            No extensions were found.
          </Text>
          <ActionIcon>
            <Help size={18} />
          </ActionIcon>
        </Group>
      )}

      <Stack align="center" spacing="xs" mt="xl">
        <Loader size="sm" variant="dots" />
        <Text size="xs" color="dimmed">Waiting for transaction</Text>
      </Stack>
    </>
  )
}