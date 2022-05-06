import { Button, Group, Text } from "@mantine/core";

import { unstakeTokensFromProject } from "../../store/contract";
export default function ProjectStakeConfirmModal({ context, id, innerProps }) {


      async function handleUnstakeTokensFromProject() {
          console.log("ID" + innerProps.projectId)
          const response = await unstakeTokensFromProject(innerProps.projectId)
          if (response) {
              console.log("Your loss bby.");
              context.closeModal(id)
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
    )
}