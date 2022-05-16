import { Button, Group, Loader, Paper, Stack, Text } from "@mantine/core";
import { showErrorNotification, showSuccessNotification } from "../../utils/notifications";
import { TOKEN_NAME } from "../../utils/constants";
import { useApi } from "../../services/api";
import { useContract } from "../../services/contract";

export default function ProjectStakeConfirmModal({ context, id, innerProps }) {
  const api = useApi();
  const contract = useContract();

  const surrendered = innerProps.isLocked ? Math.floor(parseInt(innerProps.position.dov_staked) * 0.8) : 0;

  const redeemable = innerProps.isLocked ?
    Math.floor(parseInt(innerProps.position.dov_staked) - (parseInt(innerProps.position.dov_staked) * 0.8)) :
    Math.floor(parseInt(innerProps.position.dov_staked) + (parseInt(innerProps.position.dov_staked) * 0.25));

  async function handleEndStakeToProject() {
    try {
      const res = await contract.endStakeToProject.mutateAsync(innerProps.project.id);

      if (res.success) {
        await api.updatePosition.mutateAsync({
          id: innerProps.position.id,
          is_closed: 1,
          dov_staked: 0,
          surrendered_dov: surrendered,
          hedera_account: innerProps.position.hedera_account
        });

        const stakedTokens = Math.floor(parseInt(innerProps.project.staked_tokens) - parseInt(innerProps.position.dov_staked));
        
        await api.updateProject.mutateAsync({
          id: innerProps.project.id,
          name: innerProps.project.name,
          staked_tokens: stakedTokens,
          collateral_risk: Math.floor((stakedTokens / innerProps.project.verified_kg) * 100)
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

  return (
    <>
      <Paper withBorder p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">Current Position: </Text>
          <Text size="xs" weight={500}>{innerProps.position.dov_staked.toLocaleString()} {TOKEN_NAME}</Text>
        </Group>

        {innerProps.isLocked &&  (
        <Group position="apart" mt="xs">
          <Text size="xs" color="red">Early Redemption Penalty:</Text>
          <Text size="xs" weight={500} color="red">{surrendered.toLocaleString()} {TOKEN_NAME}</Text>
        </Group>
        )}

        <Group position="apart" mt="xs">
          <Text size="xs" color="dimmed">Redeemable Amount:</Text>
          <Text size="xs" weight={500}>{redeemable.toLocaleString()} {TOKEN_NAME}</Text>
        </Group>
      </Paper>

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        
        <Button
          variant="light"
          color={innerProps.isLocked ? "red" : "green"}
          disabled={contract.endStakeToProject.isLoading}
          onClick={handleEndStakeToProject}
        >
          Confirm
        </Button>
      </Group>

      {contract.endStakeToProject.isLoading && (
        <Stack align="center" spacing="xs" mt="xl">
          <Loader size="sm" variant="dots" />
          <Text size="xs" color="dimmed">Transacting</Text>
        </Stack>
      )}
    </>
  );
}