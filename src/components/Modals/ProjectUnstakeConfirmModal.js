import { Button, Group, Text } from "@mantine/core";
import { closeStakedPosition } from "../../services/api";
import { unstakeTokensFromProject } from "../../services/contract";

export default function ProjectStakeConfirmModal({ context, id, innerProps }) {

  async function handleUnstakeTokensFromProject() {
      const res = await unstakeTokensFromProject(innerProps.project.id);

      if (res) {
        await closeStakedPosition(innerProps.stakedPosition.id, {
          is_closed: 1,
          dov_staked: 0,
          surrendered_dov: innerProps.stakedPosition.dov_staked - (innerProps.stakedPosition.dov_staked * 0.8)
        });

        context.closeModal(id);
      }
  }

  return (
    <>
      <Text>Add penalty warnings etc & confirm</Text>
      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button
          variant="light"
          color="red"
          onClick={handleUnstakeTokensFromProject}
        >
          Confirm
        </Button>
      </Group>
    </>
  );
}