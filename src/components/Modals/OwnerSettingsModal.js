import { useEffect, useState } from "react";
import { Text, Paper, Group, NumberInput, Button } from "@mantine/core";
import { TOKEN_NAME, loadTreasuryBalance, useContract, addTokensToTreasury } from "../../store/contract";

export default function OwnerSettingsModal() {
  const contract = useContract(); 
  const intNoFmt = new Intl.NumberFormat("en-GB");
  // TODO: This is being used in stats also
  // Should some of this be abtracted out and exported?

  const maxClaimable = 69; // TODO: Update this, add to SC getter for current MCT.
  const addToTreasury = "Add Tokens to Treasury (" + TOKEN_NAME + ")"; // TODO: Add function to get balance of user & show their max.
  const updateMaxClaim = "Set Max Claimable Tokens (" + TOKEN_NAME + ")";

  const [amount, setAmount] = useState(0);

  async function handleAddTokenstoTreasury() {
    const response = await addTokensToTreasury(amount);
    if (response.success) { 
      loadTreasuryBalance();
      // clear state of amount.
    }
  }

  // TODO: implement
  async function handleUpdateClaimableTokens() {
    return;
  }
  useEffect(() => {
    loadTreasuryBalance();
  }, []);

  return (
    <>
      <Paper withBorder my="xs" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">Treasury Balance:</Text>
          <Text size="xs" weight={500}>{intNoFmt.format(contract.treasuryBalance)} {TOKEN_NAME}</Text>
        </Group>
        <Group position="apart">
          <Text size="xs" color="dimmed">Current Claimable Max:</Text>
          <Text size="xs" weight={500}>{intNoFmt.format(maxClaimable)} {TOKEN_NAME}</Text>
        </Group>
      </Paper>

      <Group mt="xl" spacing="xs">
        <NumberInput
          hideControls
          sx={{ flex: 1 }}
          description={addToTreasury}
          placeholder={TOKEN_NAME}
          value={amount}
          onChange={value => setAmount(value)}
        />
        <Button
          mt="md"
          zIndex={1000}
          sx={{ maxWidth: 125 }}
          color="green"
          onClick={handleAddTokenstoTreasury}
          >Deposit</Button>
        </Group>
      <Text size="sm"><br />updateClaimableTokens coming soon.</Text>
    </>
  );
}