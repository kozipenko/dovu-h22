import { ActionIcon, Anchor, Box, Container, createStyles, Group, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { Moon, Sun } from "tabler-icons-react";
import { toggleColorScheme, useTheme } from "../../store/theme";
import PageWallet from "./PageWallet";

const useStyles = createStyles(theme => ({
  root: {
    position: "sticky",
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[9] : theme.white,
    boxShadow: theme.shadows.xs,
    zIndex: 999
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%"
  }
}));

export default function PageHeader() {
  const { classes } = useStyles();
  const theme = useTheme();

  return (
    <Box component="header" className={classes.root}>
      <Container size="xl" className={classes.container}>
        <Anchor to="/" variant="text" component={Link}>
          <Group spacing="xs">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 97 97" fill="currentcolor">
              <path fillRule="evenodd" d="M775.375665,812.094196 C775.350011,811.546283 775.340777,810.662852 775.265875,809.78455 C774.855453,804.891302 773.484646,800.284323 771.08676,795.989263 C770.191015,794.384516 768.417995,793.8089 766.90354,794.653342 C765.383955,795.499836 764.928388,797.295429 765.813872,798.907359 C768.975142,804.663518 770.108931,810.807525 768.897162,817.253192 C767.045136,827.096121 761.458276,834.100987 752.281255,838.143637 C747.779959,840.126998 743.028306,840.706718 738.149423,840.121868 C734.508986,839.685795 731.073759,838.562267 727.873499,836.757439 C727.183991,836.366513 726.455494,836.221839 725.683902,836.394216 C724.399283,836.682537 723.509695,837.668574 723.307562,838.996287 C723.133133,840.141363 723.786729,841.402382 724.931804,842.028275 C732.723653,846.282292 740.963887,847.487904 749.588891,845.371156 C764.806287,841.637348 775.381819,828.057533 775.375665,812.094196 L775.375665,812.094196 Z M743.315601,827.984683 C743.313549,827.630695 743.364852,827.477813 743.775273,827.409067 C747.256672,826.822165 750.18708,825.197923 752.323323,822.389615 C756.074574,817.458403 756.366999,812.114717 753.702339,806.62841 C751.970361,803.059797 749.830014,799.713837 747.486508,796.504342 C745.534955,793.829421 743.560828,791.170917 741.528216,788.413912 C741.280938,788.764822 741.121899,788.977215 740.978252,789.196791 C738.712726,792.621757 736.42668,796.033384 734.191935,799.477845 C732.660038,801.841871 731.130192,804.212055 729.727578,806.655087 C728.162846,809.377207 727.399463,812.340449 727.864265,815.492484 C728.622518,820.627881 731.393888,824.317569 736.132202,826.452786 C737.273173,826.966838 738.528037,827.224378 739.802395,827.624539 L739.802395,828.098575 C739.802395,830.040894 739.789056,831.980135 739.815734,833.922454 C739.819838,834.27439 739.931678,834.65916 740.109185,834.963898 C740.493955,835.632884 741.295302,835.904789 742.035087,835.699578 C742.78308,835.492315 743.304315,834.867449 743.311497,834.07431 C743.32894,832.04375 743.326888,830.013191 743.315601,827.984683 L743.315601,827.984683 Z M714.097708,807.722183 C715.515713,799.782582 719.665073,793.549309 726.403165,789.131123 C732.026963,785.44041 738.258185,784.095254 744.927531,784.873002 C748.790622,785.324466 752.401303,786.579329 755.750341,788.568846 C756.453188,788.985424 757.209389,789.095211 757.992268,788.914626 C759.249183,788.624253 760.089521,787.655659 760.297809,786.320763 C760.475317,785.193131 759.882258,784.007013 758.767964,783.351365 C753.456086,780.21472 747.701979,778.67564 741.046997,778.608947 C740.306187,778.656145 739.073897,778.718734 737.843659,778.822366 C737.194167,778.877773 736.549806,778.993717 735.907497,779.103504 C727.740112,780.491755 720.898389,784.315855 715.6491,790.689698 C708.039889,799.927256 705.881073,810.438146 709.003353,821.996636 C709.752372,824.763902 710.939516,827.359817 712.419085,829.817214 C713.027534,830.823773 713.946878,831.328591 715.111448,831.289601 C716.323217,831.250611 717.230248,830.647292 717.740197,829.543258 C718.221416,828.50284 718.046987,827.509621 717.475475,826.519479 C714.09976,820.661741 712.907486,814.37306 714.097708,807.722183 L714.097708,807.722183 Z M790,812.499487 C790,839.285634 768.285634,861 741.499487,861 C714.71334,861 693,839.285634 693,812.499487 C693,785.71334 714.71334,764 741.499487,764 C768.285634,764 790,785.71334 790,812.499487 L790,812.499487 Z M751.441943,816.504173 C752.327427,813.341877 751.783619,810.311941 750.182976,807.432836 C748.176016,803.825232 745.964871,800.354094 743.527994,797.022499 C743.486952,796.968118 743.414102,796.934259 743.339201,796.879878 L743.339201,823.872262 C743.527994,823.84661 743.651121,823.844558 743.767065,823.814803 C747.692745,822.813375 750.346118,820.410358 751.441943,816.504173 L751.441943,816.504173 Z M739.778796,797.366227 C738.596782,799.177211 737.494801,800.864043 736.459513,802.449295 C737.593302,803.601553 738.687075,804.70969 739.778796,805.818854 L739.778796,797.366227 Z M739.484318,820.757164 C737.74208,818.837418 735.977268,816.936141 734.215535,815.032813 C733.31979,814.065244 732.421994,813.100754 731.471868,812.077779 C730.380147,818.430075 735.307255,823.375652 739.802395,823.814803 C739.802395,823.055523 739.828046,822.29727 739.789056,821.541069 C739.772639,821.272243 739.662852,820.954166 739.484318,820.757164 L739.484318,820.757164 Z M739.802395,815.875202 C737.412717,813.289548 735.128722,810.81676 732.805737,808.304981 C733.330051,807.411289 733.85026,806.523753 734.398172,805.593122 C734.582862,805.765499 734.720353,805.891704 734.851688,806.023039 C736.398976,807.568275 737.952421,809.108381 739.482266,810.67106 C739.654643,810.846515 739.7829,811.147149 739.789056,811.390323 C739.815734,812.831928 739.802395,814.273533 739.802395,815.875202 L739.802395,815.875202 Z" transform="translate(-693 -764)" />
            </svg>
            <Text size="lg" weight={700}>DOVU Labs</Text>
          </Group>
        </Anchor>

        <Group>
          <PageWallet />
          <ActionIcon size="lg" variant="light" color="indigo" onClick={toggleColorScheme}>
            {theme.colorScheme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </ActionIcon>
        </Group>
      </Container>
    </Box>
  );
}