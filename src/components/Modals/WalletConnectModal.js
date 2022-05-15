import { ActionIcon, Anchor, Button, Group, Paper, Text, TextInput } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { Qrcode, SquareCheck } from "tabler-icons-react";
import { TOKEN_NAME } from "../../utils/constants";
import { useWallet } from "../../services/wallet";

export default function WalletConnectModal({ context, id }) {
  const modals = useModals();
  const wallet = useWallet();

  function handleOpenWalletConnectQRModal() {
    console.log("............")
    modals.openContextModal("walletConnectQR", {
      size: "xs",
      title: "Scan QR",
      innerProps: {
        pairingString: wallet.local.pairingString
      }
    });
  }

  return wallet.local.accountId ? (
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
          <Text size="xs" weight={500}>{wallet.local.accountId}</Text>
        </Group>
        <Group mt="xs" position="apart">
          <Text size="xs" color="dimmed">Account Balance:</Text>
          <Text size="xs" weight={500}>{wallet.accountBalance.data.toLocaleString()} {TOKEN_NAME}</Text>
        </Group>
      </Paper>

      <Group position="right">
        <Button variant="light" mt="xl" onClick={() => context.closeModal(id)}>
          Continue
        </Button>
      </Group>
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
      <Group mt="xs">
        <TextInput
          readOnly
          value={wallet.local.pairingString}
          onFocus={e => e.target.select()}
          sx={{ flex: 1 }}
        />
        <ActionIcon size="lg" variant="filled" color="indigo" onClick={handleOpenWalletConnectQRModal}>
          <Qrcode size={18} />
        </ActionIcon>
      </Group>
      
      <Text size="xs" mt="md" color="dimmed">Extension</Text>

      {wallet.local.extensions.map(extension => (
        <Button fullWidth mt="xs" onClick={() => wallet.connectWallet.mutate(extension)}>
          {extension.name}
        </Button>
      ))}

      {wallet.local.extensions.length < 1 && (
        <Text size="sm" mt="xs">No extensions were found.</Text>
      )}

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
      </Group>
    </>
  );
}