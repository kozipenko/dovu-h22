import { Button, Group, Loader, Paper, Stack, Text } from "@mantine/core";
import { showErrorNotification, showSuccessNotification } from "../../utils/notifications";
import { TOKEN_NAME } from "../../utils/constants";
import { useApi } from "../../services/api";
import { useContract } from "../../services/contract";

export default function ProjectStakeConfirmModal({ context, id, innerProps }) {
  const api = useApi();
  const contract = useContract();

  const surrendered = innerProps.position.dov_staked * 0.8;
  const redeemable = innerProps.position.dov_staked - (innerProps.position.dov_staked * 0.8);

  async function handleUnstakeTokensFromProject() {
    try {
      const res = await contract.unstakeTokensFromProject.mutateAsync(innerProps.project.id);

      if (res.success) {
        await api.updatePosition.mutateAsync({
          id: innerProps.position.id,
          is_closed: 1,
          dov_staked: 0,
          surrendered_dov: innerProps.position.dov_staked * 0.8,
          hedera_account: innerProps.position.hedera_account
        });
        showSuccessNotification("Success", `Unstaked ${redeemable.toLocaleString()} ${TOKEN_NAME} from ${innerProps.project.name}`);
        innerProps.closeModal();
      }
      else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      showErrorNotification("Error", error.message);
    }
  }

  // TODO: Render two outputs, 1 if early unstaking, 2 if term fulfilled.
  return (
    <>
      <Paper withBorder mt="xs" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">Current Position: </Text>
          <Text size="xs" weight={500}>{innerProps.position.dov_staked.toLocaleString()} {TOKEN_NAME}</Text>
        </Group>

        <Group position="apart">
          <Text size="xs" weight={700} color="red">Early Redemption Penalty:</Text>
          <Text size="xs" weight={700} color="red">{surrendered.toLocaleString()} {TOKEN_NAME}</Text>
        </Group>

        <Group position="apart">
          <Text size="xs" weight={700} color="dimmed">Redeemable Amount:</Text>
          <Text size="xs" weight={700}>{redeemable.toLocaleString()} {TOKEN_NAME}</Text>
        </Group>
      </Paper>

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

      {contract.unstakeTokensFromProject.isLoading && (
        <Stack align="center" spacing="xs" mt="xl">
          <Loader size="sm" variant="dots" />
          <Text size="xs" color="dimmed">Tansacting</Text>
        </Stack>
      )}
    </>
  );
}