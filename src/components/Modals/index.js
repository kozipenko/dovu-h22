import ProjectPurchaseModal from "./ProjectPurchaseModal";
import ProjectStakeModal from "./ProjectStakeModal";
import ProjectStakeConfirmModal from "./ProjectStakeConfirmModal";
import ProjectUnstakeConfirmModal from "./ProjectUnstakeConfirmModal";
import WalletConnectModal from "./WalletConnectModal";
import WalletConnectQRModal from "./WalletConnectQRModal";
import ClaimTokensModal from "./ClaimTokensModal";
import OwnerSettingsModal from "./OwnerSettingsModal";
import OwnerProjectsModal from "./OwnerProjectsModal";
import OwnerEditProjectModal from "./OwnerEditProjectModal";
import OwnerNewProjectModal from "./OwnerNewProjectModal";
import OwnerLiquidateProjectModal from "./OwnerLiquidateProjectModal";

const contextModals = {
  projectPurchase: ProjectPurchaseModal,
  projectStake: ProjectStakeModal,
  projectStakeConfirm: ProjectStakeConfirmModal,
  projectUnstakeConfirm: ProjectUnstakeConfirmModal,
  walletConnectQR: WalletConnectQRModal,
  walletConnect: WalletConnectModal,
  claimTokens: ClaimTokensModal,
  ownerSettings: OwnerSettingsModal,
  ownerProjects: OwnerProjectsModal,
  ownerEditProject: OwnerEditProjectModal,
  ownerNewProject: OwnerNewProjectModal,
  ownerLiquidateProject: OwnerLiquidateProjectModal
};

export default contextModals;

