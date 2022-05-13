import { SimpleGrid } from "@mantine/core";
import { Coin, Leaf, Lock, Stack2 } from "tabler-icons-react";
import { useApi } from "../../services/api";
import { TOKEN_NAME } from "../../utils/constants";
import Stat from "./Stat";

export default function Stats() {
  const api = useApi();

  const totalStakedTokens = api.positions.data
    .filter(pos => !pos.is_closed)
    .reduce((acc, obj) => acc + obj.dov_staked, 0);

  const totalVerifiedKg = api.projects.data
    .reduce((acc, obj) => acc + obj.verified_kg, 0)

  return (
    <>
      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: "xs", cols: 1 },
          { maxWidth: "sm", cols: 2 },
          { maxWidth: "md", cols: 3 },
          { maxWidth: "lg", cols: 4 },
        ]}
      >
        <Stat
          title="Total Positions"
          stat={api.positions.data.length}
          icon={<Stack2 size={18} />}
        />
        <Stat
          title="Total Value Locked"
          stat={`${totalStakedTokens.toLocaleString()} ${TOKEN_NAME}`}
          icon={<Lock size={18} />}
        />
        <Stat
          title="Total Verified Carbon"
          stat={`${totalVerifiedKg.toLocaleString()} kg`}
          icon={<Leaf size={18} />}
        />
        <Stat
          title="Treasury Balance"
          stat={`${api.treasuryBalance.data.toLocaleString()} ${TOKEN_NAME}`}
          icon={<Coin size={18} />}
        />
      </SimpleGrid>
    </>
  );
}