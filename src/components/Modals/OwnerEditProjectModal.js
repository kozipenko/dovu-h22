import { useEffect, useState } from "react";
import { Button, Group, Loader, NumberInput, Stack, Text, TextInput } from "@mantine/core";
import { getTotalStakedTokens, getTotalSurrenderedTokens, updateProject } from "../../services/api";
import { addVerifiedCarbon, getVerifiedCarbonForProject, removeVerifiedCarbon, TOKEN_NAME } from "../../services/contract";

export default function OwnerEditProjectsModal({ innerProps, context, id }) {
  const [totalStakedTokens, setTotalStakedTokens] = useState(0);
  const [totalSurrenderedTokens, setTotalSurrenderedTokens] = useState(0);
  const [newName, setNewName] = useState(innerProps.project.name);
  const [newImage, setNewImage] = useState(innerProps.project.image);
  const [newPriceKg, setNewPriceKg] = useState(parseFloat(innerProps.project.price_kg));
  const [newVerifiedKg, setNewVerifiedKg] = useState(innerProps.project.verified_kg);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransacting, setIsTransacting] = useState(false);

  async function syncVerifiedCarbon() {
    setIsLoading(true);
    const verifiedKg = await getVerifiedCarbonForProject(innerProps.project.id);
    
    if (verifiedKg !== newVerifiedKg)
      await updateProject(innerProps.project.id, { name: newName, verified_kg: verifiedKg });

    setIsLoading(false);
  }

  async function editVerifiedCarbon() {
    if (newVerifiedKg > innerProps.project.verified_kg)
      return await addVerifiedCarbon(innerProps.project.id, newVerifiedKg-innerProps.project.verified_kg);
    else if (newVerifiedKg < innerProps.project.verified_kg)
      return await removeVerifiedCarbon(innerProps.project.id, innerProps.project.verified_kg-newVerifiedKg)
  }

  async function handleEditProject() {
    setIsTransacting(true);
    const res = await editVerifiedCarbon();

    if (res)
      updateProject(innerProps.project.id, {
        name: newName,
        image: newImage,
        price_kg: newPriceKg,
        verified_kg: newVerifiedKg
      });
    
    setIsTransacting(false);
  }

  useEffect(() => {
    syncVerifiedCarbon();
    getTotalStakedTokens(innerProps.project.id).then(setTotalStakedTokens);
    getTotalSurrenderedTokens(innerProps.project.id).then(setTotalSurrenderedTokens);
  }, []);

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
        disabled={isLoading}
        rightSection={isLoading && <Loader size="xs" />}
        value={newVerifiedKg}
        label={<Text size="xs" color="dimmed">Verified Carbon (kg)</Text>}
        onChange={setNewVerifiedKg}
      />

      <NumberInput
        disabled
        mt="xs"
        value={totalStakedTokens}
        label={<Text size="xs" color="dimmed">Total Staked ({TOKEN_NAME})</Text>}
      />

      <NumberInput
        disabled
        mt="xs"
        value={totalSurrenderedTokens}
        label={<Text size="xs" color="dimmed">Total Surrendered ({TOKEN_NAME})</Text>}
      />

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button
          variant="light"
          disabled={isLoading || isTransacting}
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
