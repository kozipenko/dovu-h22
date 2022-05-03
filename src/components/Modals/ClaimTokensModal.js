import { Button, Center, Loader, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { claimDemoTokensForStaking } from "../../store/contract";

// TODO: This value does not work
const TOKEN_AMOUNT = 5*10**8

export default function ClaimTokensModal({ context, id, innerProps }) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    claimDemoTokensForStaking(100000).then(setResponse).catch(setError)
  }, []);

  return response ? (
    <>
      <Text size="sm">
        You have successfully claimed 10 tokens.
      </Text>
      <Button fullWidth mt="xl" onClick={() => context.closeModal(id)}>
        Continue
      </Button>
    </>
  ) : (
    <>
      <Text size="sm">
        10 tokens have been sent to {innerProps.pairedAccount}.
      </Text>
      {error ? (
        <>
          <Text size="sm" color="red" mt="xl">
            {error.message}
          </Text>
          <Button fullWidth mt="xs" color="red" onClick={() => context.closeModal(id)}>
            Cancel
          </Button>
        </>
      ) : (
        <Center mt="xl">
          <Loader size="sm" variant="dots" />
        </Center>
      )}
    </>
  );
}