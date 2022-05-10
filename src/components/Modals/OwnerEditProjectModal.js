import { useState } from "react";
import { Button, Group, Loader, NumberInput, Stack, Text, TextInput } from "@mantine/core";
import { showSuccessNotification, showErrorNotification, showInfoNotification } from "../../utils/notifications";
import { addVerifiedCarbon, removeVerifiedCarbon, TOKEN_NAME } from "../../services/contract";
import useProjects from "../../hooks/useProjects";
import usePositions from "../../hooks/usePositions";

export default function OwnerEditProjectsModal({ innerProps, context, id }) {
  const [newName, setNewName] = useState(innerProps.project.name);
  const [newImage, setNewImage] = useState(innerProps.project.image);
  const [newPriceKg, setNewPriceKg] = useState(parseFloat(innerProps.project.price_kg));
  const [newVerifiedKg, setNewVerifiedKg] = useState(innerProps.project.verified_kg);
  const [isTransacting, setIsTransacting] = useState(false);
  const { positions } = usePositions();
  const { updateProject } = useProjects();

  const totalStakedTokens = positions.isSuccess && positions.data
    .filter(pos => pos.project_id === innerProps.project.id)
    .reduce((acc, obj) => acc + obj.dov_staked + obj.surrendered_dov, 0);

  const totalSurrenderedTokens = positions.isSuccess && positions.data
    .filter(pos => pos.project_id === innerProps.project.id)
    .reduce((acc, obj) => acc + obj.surrendered_dov, 0);

  async function editVerifiedCarbon() {
    if (newVerifiedKg > innerProps.project.verified_kg)
      return await addVerifiedCarbon(innerProps.project.id, newVerifiedKg-innerProps.project.verified_kg);
    else if (newVerifiedKg < innerProps.project.verified_kg)
      return await removeVerifiedCarbon(innerProps.project.id, innerProps.project.verified_kg-newVerifiedKg)
    else
      return true;
  }

  async function handleEditProject() {
    setIsTransacting(true);

    updateProject.mutate({
      id: innerProps.project.id, 
      name: newName,
      image: newImage,
      price_kg: newPriceKg,
      verified_kg: newVerifiedKg
    }, {
      onSuccess: async () => {
        const res = await editVerifiedCarbon();
        setIsTransacting(false);

        if (res) {
          showSuccessNotification("Saved project changes")
          context.closeModal(id);
        } else {
          showErrorNotification("Error saving project changes to contract");
          updateProject.mutate({
            id: innerProps.project.id,
            name: innerProps.project.name,
            image: innerProps.project.image,
            price_kg: innerProps.project.price_kg,
            verified_kg: innerProps.project.verified_kg
          }, {
            onSuccess: () => showInfoNotification("Reverted project changes in api"),
            onError: () => showErrorNotification("Error reverting project changes in api")
          });
        }
      },
      onError: () => {
        setIsTransacting(false);
        showErrorNotification("Error saving project changes to api");
      }
    });
  }

  return (
    <>
      <TextInput
        readOnly
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
        readOnly
        mt="xs"
        value={totalStakedTokens.toLocaleString()}
        label={<Text size="xs" color="dimmed">Total Staked ({TOKEN_NAME})</Text>}
      />

      <TextInput
        readOnly
        mt="xs"
        value={totalSurrenderedTokens.toLocaleString()}
        label={<Text size="xs" color="dimmed">Total Surrendered ({TOKEN_NAME})</Text>}
      />

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button
          variant="light"
          disabled={isTransacting}
          onClick={handleEditProject}
        >
          Save
        </Button>
      </Group>

      {isTransacting && (
        <Stack align="center" spacing="xs" mt="xl">
          <Loader size="sm" variant="dots" />
          <Text size="xs" color="dimmed">Tansacting</Text>
        </Stack>
      )}
    </>
  );
}
