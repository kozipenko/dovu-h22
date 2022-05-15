import QRCode from "react-qr-code";
import { Button, Center, Group } from "@mantine/core";

export default function WalletConnectModal({ context, id, innerProps }) {

  return (
    <>
      <Center>
        <QRCode value={innerProps.pairingString} />
      </Center>

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
      </Group>
    </>
  );
}