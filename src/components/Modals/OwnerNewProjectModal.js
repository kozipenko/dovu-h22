import { useState } from "react";
import { Button, Group, Loader, NumberInput, Stack, Text, TextInput } from "@mantine/core";
import { showSuccessNotification, showErrorNotification } from "../../utils/notifications";
import { useApi } from "../../services/api";
import { useContract } from "../../services/contract";

export default function OwnerNewProjectModal({ context, id }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [priceKg, setPriceKg] = useState(0);
  const [verifiedKg, setVerifiedKg] = useState(0);
  const api = useApi();
  const contract = useContract();

  async function handleAddProject() {
    try {
      const lastProject = api.projects.data[api.projects.data.length-1];
      const projectId = lastProject ? lastProject.id + 1 : 1;
      const res = await contract.addProject.mutateAsync({ id: projectId, verified_kg: verifiedKg });

      if (res.success) {
        await api.createProject.mutateAsync({
          name,
          image,
          price_kg: priceKg,
          verified_kg: verifiedKg,
          collateral_risk: 0,
          staked_tokens: 0
        });
        context.closeModal(id);
        showSuccessNotification("Success", `Created project ${name}`);
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      showErrorNotification("Error", error.message);
    }
  }
 
  return (
    <>
      <TextInput
        mt="xs"
        placeholder="Schrute Farms"
        value={name}
        label={<Text size="xs" color="dimmed">Name</Text>}
        onChange={(e) => setName(e.currentTarget.value)}
      />

      <TextInput
        mt="xs"
        placeholder="URL"
        value={image}
        label={<Text size="xs" color="dimmed">Image</Text>}
        onChange={(e) => setImage(e.currentTarget.value)}
      />

      <NumberInput
        mt="xs"
        placeholder="0"
        min={0}
        precision={2}
        value={priceKg}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        formatter={(value) => `$ ${value}`}
        label={<Text size="xs" color="dimmed">Carbon Price (USD)</Text>}
        onChange={setPriceKg}
      />

      <NumberInput
        mt="xs"
        placeholder="0"
        min={0}
        value={verifiedKg}
        label={<Text size="xs" color="dimmed">Verified Carbon (kg)</Text>}
        onChange={setVerifiedKg}
      />

      <TextInput
        disabled
        mt="xs"
        value={0}
        label={<Text size="xs" color="dimmed">Collateral Risk</Text>}
      />

      <TextInput
        disabled
        mt="xs"
        value={0}
        label={<Text size="xs" color="dimmed">Staked Tokens</Text>}
      />

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button
          variant="light"
          disabled={!name || contract.addProject.isLoading}
          onClick={handleAddProject}
        >
          Save
        </Button>
      </Group>

      {contract.addProject.isLoading && (
        <Stack align="center" spacing="xs" mt="xl">
          <Loader size="sm" variant="dots" />
          <Text size="xs" color="dimmed">Tansacting</Text>
        </Stack>
      )}
    </>
  );
}
