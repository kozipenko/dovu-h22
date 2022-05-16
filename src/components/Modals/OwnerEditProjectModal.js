import { useState } from "react";
import { Button, Group, Loader, NumberInput, Stack, Text, TextInput } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showSuccessNotification, showErrorNotification } from "../../utils/notifications";
import { TOKEN_NAME } from "../../utils/constants";
import { useApi } from "../../services/api";
import { useContract } from "../../services/contract";

export default function OwnerEditProjectsModal({ context, id, innerProps }) {
  const [newName, setNewName] = useState(innerProps.project.name);
  const [newImage, setNewImage] = useState(innerProps.project.image);
  const [newPriceKg, setNewPriceKg] = useState(parseFloat(innerProps.project.price_kg));
  const [newVerifiedKg, setNewVerifiedKg] = useState(innerProps.project.verified_kg);
  const api = useApi();
  const contract = useContract();
  const modals = useModals();

  const totalStakedTokens = api.positions.data
    .filter(pos => pos.project_id === innerProps.project.id)
    .reduce((acc, obj) => acc + parseInt(obj.dov_staked), 0);

  const totalSurrenderedTokens = api.positions.data
    .filter(pos => pos.project_id === innerProps.project.id)
    .reduce((acc, obj) => acc + parseInt(obj.surrendered_dov), 0);

  function handleOpenOwnerLiquidateProjectModal() {
    modals.openContextModal("ownerLiquidateProject", {
      title: `Liquidate ${innerProps.project.name}`,
      innerProps: { project: innerProps.project }
    });
  }

  async function editVerifiedCarbon() {
    if (newVerifiedKg > innerProps.project.verified_kg) {
      return await contract.addVerifiedCarbon.mutateAsync({
        id: innerProps.project.id, 
        verified_kg: newVerifiedKg-innerProps.project.verified_kg
      });
    } else if (newVerifiedKg < innerProps.project.verified_kg) {
      return await contract.removeVerifiedCarbon.mutateAsync({
        id: innerProps.project.id,
        verified_kg: innerProps.project.verified_kg-newVerifiedKg
      });
    } else {
      return { success: true };
    }
  }

  async function handleEditProject() {
    try {
      const res = await editVerifiedCarbon();
      
      if (res.success) {
        await api.updateProject.mutateAsync({
          id: innerProps.project.id, 
          name: newName,
          image: newImage,
          price_kg: newPriceKg,
          verified_kg: newVerifiedKg
        });
        
        context.closeModal(id);
        showSuccessNotification("Success", `Saved changes for ${innerProps.project.name}`);
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
        disabled
        mt="md"
        value={innerProps.project.id}
        label={<Text size="xs" color="dimmed">ID</Text>}
      />

      <TextInput
        mt="xs"
        value={newName}
        label={<Text size="xs" color="dimmed">Name</Text>}
        onChange={(e) => setNewName(e.currentTarget.value)}
      />

      <TextInput
        mt="xs"
        value={newImage}
        label={<Text size="xs" color="dimmed">Image</Text>}
        onChange={(e) => setNewImage(e.currentTarget.value)}
      />

      <NumberInput
        mt="xs"
        min={0}
        precision={2}
        value={newPriceKg}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        formatter={(value) => `$ ${value}`}
        label={<Text size="xs" color="dimmed">Carbon Price (USD)</Text>}
        onChange={setNewPriceKg}
      />

      <NumberInput
        mt="xs"
        min={0}
        value={newVerifiedKg}
        label={<Text size="xs" color="dimmed">Verified Carbon (kg)</Text>}
        onChange={setNewVerifiedKg}
      />

      <TextInput
        disabled
        mt="xs"
        value={totalStakedTokens.toLocaleString()}
        label={<Text size="xs" color="dimmed">Total Staked ({TOKEN_NAME})</Text>}
      />

      <TextInput
        disabled
        mt="xs"
        value={totalSurrenderedTokens.toLocaleString()}
        label={<Text size="xs" color="dimmed">Total Surrendered ({TOKEN_NAME})</Text>}
      />

      <Group position="apart" mt="xl">
        <Button variant="light" color="orange" onClick={handleOpenOwnerLiquidateProjectModal}>
          Liquidate
        </Button>

        <Group spacing="xs">
          <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
            Cancel
          </Button>
          <Button
            variant="light"
            disabled={contract.addVerifiedCarbon.isLoading || contract.removeVerifiedCarbon.isLoading}
            onClick={handleEditProject}
          >
            Save
          </Button>
        </Group>
      </Group>

      {(contract.addVerifiedCarbon.isLoading || contract.removeVerifiedCarbon.isLoading) && (
        <Stack align="center" spacing="xs" mt="xl">
          <Loader size="sm" variant="dots" />
          <Text size="xs" color="dimmed">Transacting</Text>
        </Stack>
      )}
    </>
  );
}
