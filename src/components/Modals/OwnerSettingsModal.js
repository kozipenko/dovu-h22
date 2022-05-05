import { useEffect, useState } from "react";
import { Text, Paper, Group, NumberInput, Button, Stack, Loader } from "@mantine/core";
import { TOKEN_NAME, useContract, addTokensToTreasury, updateClaimableTokens, setContractMaxClaimableTokens, TOKEN_EXP, getTreasuryBalance } from "../../store/contract";

export default function OwnerSettingsModal() {
  const [isTransacting, setIsTransacting] = useState(false);
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const contract = useContract(); 
  const intNoFmt = new Intl.NumberFormat("en-GB");
  // TODO: This is being used in stats also
  // Should some of this be abtracted out and exported?

  const addToTreasury = "Add Tokens to Treasury (" + TOKEN_NAME + ")"; // TODO: Add function to get balance of user & show their max.
  const maxClaimableTokensStr = "Set Max Claimable Tokens (" + TOKEN_NAME + ")";
  
  const [xferToTreasury, setXferToTreasury] = useState(0);
  const [newClaimableAmount, setNewClaimableAmount] = useState(0);

  async function loadTreasuryBalance() {
    const balance = await getTreasuryBalance();
    setTreasuryBalance(balance);
  }

  async function handleAddTokenstoTreasury() {
    setIsTransacting(true);
    const response = await addTokensToTreasury(xferToTreasury);
    if (response.success) {
      setTreasuryBalance(xferToTreasury)
      setXferToTreasury(0);
    }
    setIsTransacting(false);
  }

  // TODO: implement
  async function handleUpdateClaimableTokens() {
    setIsTransacting(true);
    const response = await updateClaimableTokens(newClaimableAmount);
    if (response) {
      setContractMaxClaimableTokens(newClaimableAmount);
      setNewClaimableAmount(0);
    }
    setIsTransacting(false);
  }

  useEffect(() => {
    loadTreasuryBalance();
  }, []);

  return (
    <>
      <Paper withBorder my="xs" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">Treasury Balance:</Text>
          <Text size="xs" weight={500}>{intNoFmt.format(treasuryBalance || 0)} {TOKEN_NAME}</Text>
        </Group>
        <Group position="apart">
          <Text size="xs" color="dimmed">Current Claimable Max:</Text>
          <Text size="xs" weight={500}>{intNoFmt.format(contract.maxClaimableTokens/TOKEN_EXP)} {TOKEN_NAME}</Text>
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
          variant="light"
          color="green"
          zindex={1000}
          sx={{ maxWidth: 125 }}
          onClick={handleAddTokenstoTreasury}
          >Deposit</Button>
      </Group>
      <Group mt="xl" spacing="xs">
        <NumberInput
          hideControls
          sx={{ flex: 1 }}
          description={maxClaimableTokensStr}
          placeholder={TOKEN_NAME}
          value={newClaimableAmount}
          onChange={value => setNewClaimableAmount(value)}
        />
        <Button
          mt="md"
          variant="light"
          color="green"
          zindex={1000}
          sx={{ maxWidth: 125 }}
          onClick={handleUpdateClaimableTokens}
        >
          Update
        </Button>
      </Group>

      {isTransacting && (
        <Stack align="center" spacing="xs" mt="xl">
          <Loader size="sm" variant="dots" />
          <Text size="xs" color="dimmed">Tansacting</Text>
        </Stack>
      )}
    </>
  );
}