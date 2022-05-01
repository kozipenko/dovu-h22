import { Button, Group, Modal, Select, TextInput } from "@mantine/core";
import { useState } from "react";
import { closeDialogs, useProjects } from "../../store/projects";

export default function ProjectPurchaseDialog() {
  const [currency, setCurrency] = useState("usd");
  const [amount, setAmount] = useState(0);
  const projects = useProjects();

  return (
    <Modal
      zIndex={1000}
      title={projects.active?.name}
      opened={projects.isPurchaseDialogOpen}
      onClose={closeDialogs}
    >
      <TextInput
        mt="md"
        placeholder="Amount"
        rightSectionWidth={110}
        rightSection={(
          <Select
            zIndex={1000}
            value={currency}
            data={[
              { value: "dov", label: "DOV" },
              { value: "eur", label: "🇪🇺 EUR" },
              { value: "usd", label: "🇺🇸 USD" },
              { value: "cad", label: "🇨🇦 CAD" },
              { value: "gbp", label: "🇬🇧 GBP" },
              { value: "aud", label: "🇦🇺 AUD" }
            ]}
            onChange={setCurrency}
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