import { Button, Group, Modal, Select, TextInput } from "@mantine/core";
import { useProjects } from "../../store/projects";

export default function ProjectPurchaseDialog() {
  const projects = useProjects();

  return (
    <Modal
      zIndex={1000}
      title={projects?.selected?.name}
      opened={projects.isPurchaseDialogOpen}
      onClose={projects.closeDialog}
    >
      <TextInput
        mt="md"
        placeholder="Amount"
        rightSectionWidth={110}
        rightSection={(
          <Select
            zIndex={1000}
            value="usd"
            data={[
              { value: "dov", label: "DOV" },
              { value: "tonnes", label: "TONNES" },
              { value: "eur", label: "🇪🇺 EUR" },
              { value: "usd", label: "🇺🇸 USD" },
              { value: "cad", label: "🇨🇦 CAD" },
              { value: "gbp", label: "🇬🇧 GBP" },
              { value: "aud", label: "🇦🇺 AUD" }
            ]}
            styles={{
              input: {
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0
              }
            }}
          />
        )}
      />

      <Group position="left" mt="xl">
        <Button variant="light" color="green">Checkout</Button>
      </Group>
    </Modal>
  );
}