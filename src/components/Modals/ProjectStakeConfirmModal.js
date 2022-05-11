import { Button, Group, Loader, Paper, Stack, Text } from "@mantine/core";
import { showErrorNotification, showSuccessNotification } from "../../utils/notifications";
import { TOKEN_NAME } from "../../utils/constants";
import useApi from "../../hooks/api";
import useContract from "../../hooks/contract";

export default function ProjectStakeConfirmModal({ context, id, innerProps }) {
  const { createPosition } = useApi();
  const { stakeTokensToProject } = useContract();

  const stakingFee = Math.floor((innerProps.amount * 5) / 100);

  function getReleaseDate() {
    const currDate = Math.floor((new Date()).getTime() / 1000);
    const termFromNow = currDate + (31536000 * innerProps.term);
    const utcTermStringFromNow = new Date(termFromNow * 1000);
    return utcTermStringFromNow.toUTCString();
  }

  async function handleStakeTokensToProject() {
    try {
      const res = await stakeTokensToProject.mutateAsync({
        projectId: innerProps.project.id,
        amount: innerProps.amount,
        term: innerProps.term * 365
      });

      if (res.success) {
        await createPosition.mutateAsync({
          project_id: innerProps.project.id,
          hedera_account: innerProps.accountId,
          dov_staked: innerProps.amount - stakingFee,
          surrendered_dov: 0,
          is_closed: 0
        })
        showSuccessNotification("Success", `You've staked ${innerProps.amount} ${TOKEN_NAME} to ${innerProps.project.name}`);
        innerProps.closeModal();
      }
      else {
        throw Error("Transaction failed");
      }
    } catch (error) {
      showErrorNotification("Error", error.message);
    }
  }

  return (
    <>
      <Paper withBorder mt="xs" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">APY:</Text>
          <Text size="xs" weight={500}>25%</Text>
        </Group>

        <Group mt="xs" position="apart">
          <Text size="xs" color="dimmed">Staking Amount:</Text>
          <Text size="xs" weight={500}>{innerProps.amount - stakingFee} {TOKEN_NAME}</Text>
        </Group>

        <Group mt="xs" position="apart">
          <Text size="xs" color="dimmed">Term Length:</Text>
          <Text size="xs" weight={500}>{innerProps.term} year(s)</Text>
        </Group>

        <Group mt="xs" position="apart">
          <Text size="xs" color="dimmed">Fee (5%): </Text>
          <Text size="xs" color="red" weight={500}>{stakingFee} {TOKEN_NAME}</Text>
        </Group>

        <Group mt="xs" position="apart">  
          <Text size="xs" color="dimmed">Token Release:</Text>
          <Text size="xs" weight={500}>{getReleaseDate()}</Text>
        </Group>
      </Paper>

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button
          variant="light"
          onClick={handleStakeTokensToProject}
        >
          Confirm
        </Button>
      </Group>

      {stakeTokensToProject.isLoading && (
        <Stack align="center" spacing="xs" mt="xl">
          <Loader size="sm" variant="dots" />
          <Text size="xs" color="dimmed">Tansacting</Text>
        </Stack>
      )}
    </>
  )
}