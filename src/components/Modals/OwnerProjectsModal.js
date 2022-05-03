import { Text } from "@mantine/core";
import { addProjectForStaking } from "../../store/contract";

export default function OwnerProjectsModal() {

  // TODO: implement
  async function handleAddProject(accountId, verifiedCarbonKg) {
    const response = await addProjectForStaking(accountId, verifiedCarbonKg);
    console.log(response);
  }

  // TODO: implement
  async function handleAddVerifiedCarbon() {
    return;
  }

  // TODO: implement
  async function handleRemoveVerifiedCarbon() {
    return;
  }

  return (
    <>
      <Text size="sm">addProject, addVerifiedCarbon, removeVerifiedCarbon here.</Text>
    </>
  );
}