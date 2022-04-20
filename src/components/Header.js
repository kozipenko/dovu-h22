import { Container, createStyles, Group } from "@mantine/core";
import { useWallet } from "../store/wallet";
import Logo from "./Logo";
import ThemeButton from "./ThemeButton";
import WalletMenu from "./WalletMenu";
import WalletConnect from "./WalletConnect";

const useStyles = createStyles(theme => ({
  root: {
    height: 64,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.white,
    boxShadow: theme.shadows.xs
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%"
  }
}));

export default function Header() {
  const { classes } = useStyles();
  const wallet = useWallet();

  return (
    <header className={classes.root}>
      <Container size="xl" className={classes.container}>
        <Logo />

        <Group>
          {wallet.isConnected ? <WalletMenu /> : <WalletConnect />}
          <ThemeButton />
        </Group>
      </Container>
    </header>
  );
}