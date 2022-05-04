import { useEffect, useState } from "react";
import { Text, Paper, Group, NumberInput, Button } from "@mantine/core";
import { TOKEN_NAME, loadTreasuryBalance, useContract, addTokensToTreasury, updateClaimableTokens } from "../../store/contract";

export default function OwnerSettingsModal() {
  const contract = useContract(); 
  const intNoFmt = new Intl.NumberFormat("en-GB");
  // TODO: This is being used in stats also
  // Should some of this be abtracted out and exported?

  const addToTreasury = "Add Tokens to Treasury (" + TOKEN_NAME + ")"; // TODO: Add function to get balance of user & show their max.
  const maxClaimableTokens = "Set Max Claimable Tokens (" + TOKEN_NAME + ")";
  
  const [maxClaimable, updateMaxClaimable] = useState(100); // placeholder - move value out to state.
  const [xferToTreasury, setXferToTreasury] = useState(0);
  const [newClaimableAmount, setNewClaimableAmount] = useState(0);

  async function handleAddTokenstoTreasury() {
    const response = await addTokensToTreasury(xferToTreasury);
    if (response.success) {
      loadTreasuryBalance();
      setXferToTreasury(0);
      // TODO: clear state of amount.
    }
  }

  // TODO: implement
  async function handleUpdateClaimableTokens() {
    const response = await updateClaimableTokens(newClaimableAmount);
    if (response) {
      updateMaxClaimable(newClaimableAmount);// TODO: Update to getter.
      setNewClaimableAmount(0);
    }
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
          value={xferToTreasury}
          onChange={value => setXferToTreasury(value)}
        />
        <Button
          mt="md"
          zindex={1000}
          sx={{ maxWidth: 125 }}
          color="green"
          onClick={handleAddTokenstoTreasury}
          >Deposit</Button>
        </Group>
        <Group mt="xl" spacing="xs">
        <NumberInput
          hideControls
          sx={{ flex: 1 }}
          description={maxClaimableTokens}
          placeholder={TOKEN_NAME}
          value={newClaimableAmount}
          onChange={value => setNewClaimableAmount(value)}
        />
           <Button
          mt="md"
          zindex={1000}
          sx={{ maxWidth: 125 }}
          color="green"
          onClick={handleUpdateClaimableTokens}
          >Update</Button>
        </Group>
    </>
  );
}