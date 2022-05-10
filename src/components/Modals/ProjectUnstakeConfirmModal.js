import { useState } from "react";
import { Button, Group, Loader, Paper, Stack, Text } from "@mantine/core";
import { showErrorNotification, showInfoNotification, showSuccessNotification } from "../../utils/notifications";
import { TOKEN_NAME, unstakeTokensFromProject } from "../../services/contract";
import usePositions from "../../hooks/usePositions";

export default function ProjectStakeConfirmModal({ context, id, innerProps }) {
  const [isTransacting, setIsTransacting] = useState(false);
  const { updatePosition } = usePositions();

  const surrendered = innerProps.position.dov * 0.8;
  const redeemable = innerProps.position.dov_staked - (innerProps.position.dov_staked * 0.8);

  async function handleUnstakeTokensFromProject() {
    setIsTransacting(true);
    
    updatePosition.mutate({
      id: innerProps.position.id,
      is_closed: 1,
      dov_staked: 0,
      surrendered_dov: innerProps.position.dov_staked * 0.8,
      hedera_account: innerProps.position.hedera_account
    }, {
      onSuccess: async () => {
        const res = await unstakeTokensFromProject(innerProps.project.id);
        setIsTransacting(false);

        if (res) {
          showSuccessNotification(`Successfully unstaked from ${innerProps.project.name}`);
          context.closeModal(id);
        } else {
          showErrorNotification("Error unstaking from contract");
          updatePosition.mutate({
            id: innerProps.position.id,
            is_closed: innerProps.position.is_closed,
            dov_staked: innerProps.position.dov_staked,
            surrendered_dov: innerProps.position.surrendered_dov,
            hedera_account: innerProps.position.hedera_account
          },{
            onSuccess: () => showInfoNotification("Reverted staking changes"),
            onError: () => showErrorNotification("Error reverting staking changes in api")
          });
        }
      },
      onError: () => {
        setIsTransacting(false);
        showErrorNotification("Error unstaking in api");
      }
    });
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


        <Group position="right" spacing="xs" mt="xl">
          <Button variant="light" onClick={innerProps.cModal}>
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
      </Paper>

      {isTransacting && (
        <Stack align="center" spacing="xs" mt="xl">
          <Loader size="sm" variant="dots" />
          <Text size="xs" color="dimmed">Tansacting</Text>
        </Stack>
      )}
    </>
  );
}