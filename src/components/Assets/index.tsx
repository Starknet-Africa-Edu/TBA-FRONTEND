import React, { CSSProperties, useState } from "react";
import ETH from "@public/eth.png";
import USDC from "@public/USDC.png";
import DAI from "@public/DAI.png";
import USDT from "@public/usdt.png";
import STRK from "@public/starknet.jpeg";
import { useContractRead } from "@starknet-react/core";
import {
  DaiTokenAddress,
  EtherTokenAddress,
  UsdcTokenAddress,
  usdtTokenAddress,
  starkTokenAddress,
} from "@utils/constants";
import Erc20Abi from "@abis/token.abi.json";
import TransferModal from "./TransferModal";

interface AssetProps {
  tokenBoundAddress: string; // Define the 'address' prop
}

const FungibleAsset = ({
  balance,
  err,
  loading,
  src,
  unit,
  toggleModal,
}: {
  src: string;
  loading: boolean;
  err: Error | null;
  balance: string;
  unit: string;
  toggleModal: () => void;
}) => {
  return (
    <div className="flex w-full items-center gap-3">
      <div>
        <img src={src} className="!w-[40px] !h-[30px]" alt="asset-logo" />
      </div>
      <div className="flex-1">
        {loading ? (
          <div aria-label="loader" className="flex justify-between">
            <div className="w-[10rem] h-[1.2rem] rounded-full bg-[#eae9e9] animate-pulse"></div>
            <div className="w-[5rem] h-[1.2rem] rounded-full bg-[#eae9e9] animate-pulse"></div>
          </div>
        ) : (
          <>
            {err ? (
              <p className="text-red-700">Failed to fetch token</p>
            ) : (
              <div className="flex items-center justify-between">
                <h4 className="text-[1.2em]">{`${balance} ${unit}`}</h4>
                <button
                  disabled={+balance <= 0}
                  onClick={toggleModal}
                  className={`border-solid border-[1px] text-deep-blue border-deep-blue p-2 rounded-[5px] ${
                    +balance > 0 ? "opacity-100" : "opacity-50"
                  } `}
                >
                  Transfer
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
function Asset({ tokenBoundAddress }: AssetProps) {
  const [openTransferModal, setOpenTransferModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState({
    src: "",
    abbreviation: "",
    balance: "",
    name: "",
    contractAddress: "",
  });
  const toggleTransferModal = (asset: {
    src: string;
    abbreviation: string;
    balance: string;
    name: string;
    contractAddress: string;
  }) => {
    setSelectedAsset(asset);
    setOpenTransferModal(!openTransferModal);
  };
  // @notice
  // @dev
  // @detail: token balance to be fetched for Token bound account but temporarily fetching balance of connected address
  const {
    data: eth,
    isLoading: ethLoading,
    error: ethError,
  } = useContractRead({
    address: EtherTokenAddress,
    abi: Erc20Abi,
    functionName: "balanceOf",
    args: [tokenBoundAddress!],
    watch: true,
  });
  const {
    data: stark,
    isLoading: starkLoading,
    error: starkError,
  } = useContractRead({
    address: starkTokenAddress,
    abi: Erc20Abi,
    functionName: "balanceOf",
    args: [tokenBoundAddress!],
    watch: true,
  });
  const {
    data: dai,
    isLoading: daiLoading,
    error: daiError,
  } = useContractRead({
    address: DaiTokenAddress,
    abi: Erc20Abi,
    functionName: "balanceOf",
    args: [tokenBoundAddress!],
    watch: true,
  });
  const {
    data: usdc,
    isLoading: usdcLoading,
    error: usdcError,
  } = useContractRead({
    address: UsdcTokenAddress,
    abi: Erc20Abi,
    functionName: "balanceOf",
    args: [tokenBoundAddress!],
    watch: true,
  });

  const {
    data: usdt,
    isLoading: usdtLoading,
    error: usdtError,
  } = useContractRead({
    address: usdtTokenAddress,
    abi: Erc20Abi,
    functionName: "balanceOf",
    args: [tokenBoundAddress!],
    watch: true,
  });

  // @ts-ignore
  let ETH_BALANCE = eth?.balance?.low.toString() / 1e18;
  // @ts-ignore
  let STARK_BALANCE = stark?.balance?.low.toString() / 1e18;
  // @ts-ignore
  let DAI_BALANCE = dai?.balance?.low.toString() / 1e18;
  // @ts-ignore
  let USDC_BALANCE = usdc?.balance?.low.toString() / 1e6;
  //@ts-ignore
  let USDT_BALANCE = usdt?.balance?.low.toString() / 1e6;

  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    position: "relative",
    left: "20px",
  };

  return (
    <div className="mt-4 flex flex-col  gap-6">
      <FungibleAsset
        balance={Number.isNaN(ETH_BALANCE) ? "0.000" : ETH_BALANCE.toFixed(4)}
        err={ethError}
        loading={ethLoading}
        src={ETH.src}
        unit="ETH"
        toggleModal={() =>
          toggleTransferModal({
            src: ETH.src,
            abbreviation: "ETH",
            balance: Number.isNaN(ETH_BALANCE)
              ? "0.000"
              : ETH_BALANCE.toFixed(4),
            name: "Ethereum",
            contractAddress: EtherTokenAddress,
          })
        }
      />

      <FungibleAsset
        balance={
          Number.isNaN(STARK_BALANCE) ? "0.000" : STARK_BALANCE.toFixed(4)
        }
        err={starkError}
        loading={starkLoading}
        src={STRK.src}
        unit="STRK"
        toggleModal={() =>
          toggleTransferModal({
            src: STRK.src,
            abbreviation: "STRK",
            balance: Number.isNaN(STARK_BALANCE)
              ? "0.000"
              : STARK_BALANCE.toFixed(4),
            name: "Stark",
            contractAddress: starkTokenAddress,
          })
        }
      />

      <FungibleAsset
        balance={Number.isNaN(USDC_BALANCE) ? "0.000" : USDC_BALANCE.toFixed(4)}
        err={usdcError}
        loading={usdcLoading}
        src={USDC.src}
        unit="USDC"
        toggleModal={() =>
          toggleTransferModal({
            src: USDC.src,
            abbreviation: "USDC",
            balance: Number.isNaN(USDC_BALANCE)
              ? "0.000"
              : USDC_BALANCE.toFixed(4),
            name: "USDC",
            contractAddress: starkTokenAddress,
          })
        }
      />

      <FungibleAsset
        balance={Number.isNaN(DAI_BALANCE) ? "0.000" : DAI_BALANCE.toFixed(4)}
        err={daiError}
        loading={daiLoading}
        src={DAI.src}
        unit="DAI"
        toggleModal={() =>
          toggleTransferModal({
            src: DAI.src,
            abbreviation: "DAI",
            balance: Number.isNaN(DAI_BALANCE)
              ? "0.000"
              : DAI_BALANCE.toFixed(4),
            name: "DAI",
            contractAddress: DaiTokenAddress,
          })
        }
      />

      <FungibleAsset
        balance={Number.isNaN(USDT_BALANCE) ? "0.000" : USDT_BALANCE.toFixed(4)}
        err={usdtError}
        loading={usdtLoading}
        src={USDT.src}
        unit="USDT"
        toggleModal={() =>
          toggleTransferModal({
            src: USDT.src,
            abbreviation: "USDT",
            balance: Number.isNaN(USDT_BALANCE)
              ? "0.000"
              : USDT_BALANCE.toFixed(4),
            name: "USDT",
            contractAddress: usdtTokenAddress,
          })
        }
      />
      <TransferModal
        openModal={openTransferModal}
        closeModal={() => setOpenTransferModal(false)}
        src={selectedAsset?.src}
        abbreviation={selectedAsset?.abbreviation}
        balance={selectedAsset?.balance}
        name={selectedAsset?.name}
        contractAddress={selectedAsset?.contractAddress}
        tokenBoundAddress={tokenBoundAddress}
      />
    </div>
  );
}

export default Asset;
