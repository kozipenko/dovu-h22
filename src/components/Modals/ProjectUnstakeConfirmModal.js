import { useEffect, useState } from "react";
import { Button, Group, Paper, Text } from "@mantine/core";
import { closeStakedPosition } from "../../services/api";
import { TOKEN_NAME, unstakeTokensFromProject } from "../../services/contract";

export default function ProjectStakeConfirmModal({ context, id, innerProps }) {

  const [surrenderedPosition, setSurrenderedPosition] = useState(0);
  const [redeemablePosition, setRedeemablePosition] = useState(0);

  async function handleUnstakeTokensFromProject() {
      const res = await unstakeTokensFromProject(innerProps.project.id);

      if (res) {
        await closeStakedPosition(innerProps.stakedPosition.id, {
          is_closed: 1,
          dov_staked: 0,
          surrendered_dov: innerProps.stakedPosition.dov_staked * 0.8,
          hedera_account: innerProps.stakedPosition.hedera_account
        });

        innerProps.cModal();
        // TODO: Add notification - unstake successful.
      }
  }

  useEffect(() => {
    setSurrenderedPosition(innerProps.stakedPosition.dov_staked * 0.8);
    setRedeemablePosition(innerProps.stakedPosition.dov_staked - (innerProps.stakedPosition.dov_staked * 0.8));
  }, [innerProps.stakedPosition.dov_staked]);
  // TODO: Render two outputs, 1 if early unstaking, 2 if term fulfilled.
  return (
    <>
      <Paper withBorder mt="xs" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">Current Position: </Text>
          <Text size="xs" weight={500}>{innerProps.stakedPosition.dov_staked.toLocaleString()} {TOKEN_NAME}</Text>
        </Group>

        <Group position="apart">
          <Text size="xs" weight={700} color="red">Early Redemption Penalty:</Text>
          <Text size="xs" weight={700} color="red">{surrenderedPosition.toLocaleString()} {TOKEN_NAME}</Text>
        </Group>

        <Group position="apart">
          <Text size="xs" weight={700} color="dimmed">Redeemable Amount:</Text>
          <Text size="xs" weight={700}>{redeemablePosition.toLocaleString()} {TOKEN_NAME}</Text>
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
    </>
  );
}