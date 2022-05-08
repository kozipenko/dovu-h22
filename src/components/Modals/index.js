import ProjectPurchaseModal from "./ProjectPurchaseModal";
import ProjectStakeModal from "./ProjectStakeModal";
import ProjectStakeConfirmModal from "./ProjectStakeConfirmModal";
import ProjectUnstakeConfirmModal from "./ProjectUnstakeConfirmModal";
import WalletConnectModal from "./WalletConnectModal";
import ClaimTokensModal from "./ClaimTokensModal";
import OwnerSettingsModal from "./OwnerSettingsModal";
import OwnerEditProjectModal from "./OwnerEditProjectModal";
import OwnerNewProjectModal from "./OwnerNewProjectModal";

const contextModals = {
  projectPurchase: ProjectPurchaseModal,
  projectStake: ProjectStakeModal,
  projectStakeConfirm: ProjectStakeConfirmModal,
  projectUnstakeConfirm: ProjectUnstakeConfirmModal,
  walletConnect: WalletConnectModal,
  claimTokens: ClaimTokensModal,
  ownerSettings: OwnerSettingsModal,
  ownerEditProject: OwnerEditProjectModal,
  ownerNewProject: OwnerNewProjectModal
};

export default contextModals;