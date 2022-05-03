import { Text } from "@mantine/core";
import { addTokensToTreasury } from "../../store/contract";

export default function OwnerSettingsModal() {

  // TODO: implement
  async function handleAddTokenstoTreasury(amount) {
    const response = await addTokensToTreasury(amount);
    console.log(response);
  }

  // TODO: implement
  async function handleUpdateClaimableTokens() {
    return;
  }

  return (
    <>
      <Text size="sm">addTokensToTreasury and updateClaimableTokens here</Text>
    </>
  );
}