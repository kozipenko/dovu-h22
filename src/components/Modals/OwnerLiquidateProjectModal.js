import { useState } from "react";
import { Button, Group, Loader, NumberInput, Paper, Stack, Text, TextInput } from "@mantine/core";
import { showSuccessNotification, showErrorNotification } from "../../utils/notifications";
import { TOKEN_NAME } from "../../utils/constants";
import { useApi } from "../../services/api";
import { useContract } from "../../services/contract";

export default function OwnerLiquidateProjectModal({ context, id, innerProps }) {
  const [amount, setAmount] = useState(0);
  const api = useApi();
  const contract = useContract();

  const positions = api.positions.data
    .filter(pos => pos.project_id === innerProps.project.id && !pos.is_closed);

  const totalStakedTokens = positions.reduce((acc, obj) => acc + obj.dov_staked, 0);

  async function handleLiquidation() {
    try {
      const res = await contract.triggerProjectInsuranceLiquidation.mutateAsync({
        id: innerProps.project.id,
        amount
      });

      if (res.success) {
        for (const position of positions) {
          const newBalance = position.dov_staked - (position.dov_staked*amount/100);

          await api.updatePosition.mutateAsync({
            id: position.id,
            is_closed: newBalance <= 0 ? 1 : 0,
            dov_staked: newBalance
          });
        }

        context.closeModal(id);
        showSuccessNotification("Success", `Liquidated ${positions.length} position(s) for ${totalStakedTokens.toLocaleString()} ${TOKEN_NAME}`);
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      showErrorNotification("Error", error.message);
    }
  }

  return (
    <>
      <Paper withBorder my="xs" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">Total Staked:</Text>
          <Text size="xs" weight={500}>{totalStakedTokens.toLocaleString()} {TOKEN_NAME}</Text>
        </Group>
        <Group position="apart" mt="xs">
          <Text size="xs" color="dimmed">Total Open Positions:</Text>
          <Text size="xs" weight={500}>{positions.length.toLocaleString()}</Text>
        </Group>
      </Paper>

      <NumberInput
        mt="xl"
        min={0}
        value={amount}
        label={<Text size="xs" color="dimmed">Liquidation Percentage (%)</Text>}
        onChange={setAmount}
      />

      <Text mt="xs" size="xs">
        Total Liquidated: {(totalStakedTokens*amount/100).toLocaleString()} {TOKEN_NAME}
      </Text>

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button
          variant="light"
          color="red"
          disabled={amount <= 0 || amount > 100 || positions.length <= 0}
          onClick={handleLiquidation}
        >
          Liquidate
        </Button>
      </Group>

      {contract.triggerProjectInsuranceLiquidation.isLoading && (
        <Stack align="center" spacing="xs" mt="xl">
          <Loader size="sm" variant="dots" />
          <Text size="xs" color="dimmed">Tansacting</Text>
        </Stack>
      )}
    </>
  );
}
