import { useState } from "react";
import { Button, Group, Loader, Paper, Stack, Text } from "@mantine/core";
import { showErrorNotification, showInfoNotification, showSuccessNotification } from "../../utils/notifications";
import { stakeTokensToProject, TOKEN_NAME } from "../../services/contract";
import usePositions from "../../hooks/usePositions";

export default function ProjectStakeConfirmModal({ context, id, innerProps }) {
  const [isTransacting, setIsTransacting] = useState(false);
  const { createPosition, updatePosition } = usePositions();
  const stakingFee = Math.floor((innerProps.amount * 5) / 100);

  function getReleaseDate() {
    const currDate = Math.floor((new Date()).getTime() / 1000);
    const termFromNow = currDate + (31536000 * innerProps.term);
    const utcTermStringFromNow = new Date(termFromNow * 1000);
    return utcTermStringFromNow.toUTCString();
  }

  async function handleStakeTokensToProject() {
    setIsTransacting(true);

    createPosition.mutate({
      project_id: innerProps.project.id,
      hedera_account: innerProps.accountId,
      dov_staked: innerProps.amount - stakingFee,
      surrendered_dov: 0,
      is_closed: 0
    }, {
      onSuccess: async (position) => {
        const res = await stakeTokensToProject(innerProps.project.id, innerProps.amount, innerProps.term * 365);

        if (res) {
          showSuccessNotification(`Successfully staked from ${innerProps.project.name}`);
          context.closeModal(id);
        } else {
          showErrorNotification("Error staking from contract");
          updatePosition.mutate({
            id: position.id,
            dov_staked: 0,
            surrendered_dov: 0,
            is_closed: 1
          }, {
            onSuccess: () => showInfoNotification("Reverted stake in api"),
            onError: () => showErrorNotification("Error reverting stake in api")
          });
        }
      },
      onError: () => {
        setIsTransacting(false);
        showErrorNotification("Error staking in api");
      }
    });
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
        <Button variant="light" color="red" onClick={innerProps.cModal}>
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
/*
    const noOfWeeks = innerProps.term * 365; // Contract currently takes no. of days as duraction.
    const res = await stakeTokensToProject(innerProps.project.id, innerProps.amount, noOfWeeks);

    if (res) {
      await createStakedPosition({
        project_id: innerProps.project.id,
        hedera_account: innerProps.accountId,
        dov_staked: innerProps.amount - stakingFee,
        surrendered_dov: 0,
        is_closed: 0
      });
      
      innerProps.cModal();
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
        <Button variant="light" color="red" onClick={innerProps.cModal}>
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
*/