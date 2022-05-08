import { useEffect, useState } from "react";
import { Button, Group, Loader, Paper, Stack, Text } from "@mantine/core";
import { getStakingFeePercentage, stakeTokensToProject, TOKEN_NAME } from "../../services/contract";

export default function ProjectStakeConfirmModal({ context, id, innerProps }) {
  const [isTransacting, setIsTransacting] = useState(false);
  const [releaseDateAsUtcString, setReleaseDateAsUtcString] = useState("");
  const [stakingFee, setStakingFee] = useState(0);
  const [amountToStake, setAmountToStake] = useState(0);
  console.log("ParentID: " + innerProps.parentId)


  function configureReleaseDate() {
    const currDate = Math.floor((new Date()).getTime() / 1000);
    const termFromNow = currDate + (31536000 * innerProps.term);
    const utcTermStringFromNow = new Date(termFromNow * 1000);
    setReleaseDateAsUtcString(utcTermStringFromNow.toUTCString());
  }

  function configureFeeAndStakeAmount() {
    const fee = (innerProps.amount * getStakingFeePercentage()) / 100;
    setStakingFee(fee);
    const stake = innerProps.amount - fee;
    setAmountToStake(stake);
  }

  async function handleStakeTokensToProject() {
    setIsTransacting(true);
    const noOfWeeks = innerProps.term * 365; // Contract currently takes no. of days as duraction.
    const response = await stakeTokensToProject(innerProps.projectId, innerProps.amount, noOfWeeks);
    setIsTransacting(false);
    
    if (response)
      closeParent();
  }

  function closeParent() {
     innerProps.cModal();
  }

  useEffect(() => {
    configureReleaseDate();
    configureFeeAndStakeAmount();
  }, []);

  // TODO: Remove hardcoded feed %age.
  return (
    <>
      <Paper withBorder mt="xs" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">APY:</Text>
          <Text size="xs" weight={500}>25%</Text>
        </Group>

        <Group mt="xs" position="apart">
          <Text size="xs" color="dimmed">Staking Amount:</Text>
          <Text size="xs" weight={500}>{amountToStake} {TOKEN_NAME}</Text>
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
          <Text size="xs" weight={500}>{releaseDateAsUtcString}</Text>
        </Group>
      </Paper>

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" color="red" onClick={closeParent}>
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