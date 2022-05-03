import { useState } from "react";
import { Button, Group, Select, TextInput } from "@mantine/core";

export default function ProjectPurchaseModal() {
  const [currency, setCurrency] = useState("usd");

  return (
    <>
      <TextInput
        mt="md"
        placeholder="Amount"
        rightSectionWidth={110}
        rightSection={(
          <Select
            zIndex={1000}
            value={currency}
            data={[
              { value: "dov", label: "DOV" },
              { value: "eur", label: "🇪🇺 EUR" },
              { value: "usd", label: "🇺🇸 USD" },
              { value: "cad", label: "🇨🇦 CAD" },
              { value: "gbp", label: "🇬🇧 GBP" },
              { value: "aud", label: "🇦🇺 AUD" }
            ]}
            onChange={setCurrency}
            styles={{
              input: {
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0
              }
            }}
          />
        )}
      />

      <Group position="left" mt="xl">
        <Button variant="light" color="green">Checkout</Button>
      </Group>
    </>
  );
}