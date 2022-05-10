import { useEffect, useState } from "react";
import { Button, Group, Loader, Paper, Stack, Text } from "@mantine/core";
import { createStakedPosition, getStakingFee } from "../../services/api";
import { stakeTokensToProject, TOKEN_NAME } from "../../services/contract";

export default function ProjectStakeConfirmModal({ context, id, innerProps }) {
  const [isTransacting, setIsTransacting] = useState(false);
  const [stakingFee, setStakingFee] = useState(0);

  function getReleaseDate() {
    const currDate = Math.floor((new Date()).getTime() / 1000);
    const termFromNow = currDate + (31536000 * innerProps.term);
    const utcTermStringFromNow = new Date(termFromNow * 1000);
    return utcTermStringFromNow.toUTCString();
  }

  async function handleStakeTokensToProject() {
    setIsTransacting(true);
    const noOfWeeks = innerProps.term * 365; // Contract currently takes no. of days as duraction.
    const res = await stakeTokensToProject(innerProps.project.id, innerProps.amount, noOfWeeks);

    if (res) {
      await createStakedPosition({
        project_id: innerProps.project.id,
        hedera_account: innerProps.accountId,
        dov_staked: innerProps.amount - stakingFee,
        surrendered_dov: 0,
        is_closed: 0,
        //TODO: add unlock_time field in API to generate release date
      });
      
      context.closeModal(id);
    }

    setIsTransacting(false);
  }

  useEffect(() => {
    getStakingFee(innerProps.amount).then(setStakingFee);
  }, []);

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

      {isTransacting && (
        <Stack align="center" spacing="xs" mt="xl">
          <Loader size="sm" variant="dots" />
          <Text size="xs" color="dimmed">Tansacting</Text>
        </Stack>
      )}
    </>
  )
}