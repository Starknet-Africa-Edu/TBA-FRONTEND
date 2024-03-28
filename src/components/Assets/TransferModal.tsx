import { Transition, Dialog } from "@headlessui/react";
import Image from "next/image";
import { ChangeEvent, Fragment, useState } from "react";
import CancelIcon from "svg/CancelIcon";
import { useTokenBoundSDK } from "@hooks/index";

type Props = {
  openModal: boolean;
  closeModal: () => void;
  abbreviation: string;
  name: string;
  balance: string;
  src: string;
  tokenBoundAddress: string;
  contractAddress: string;
};

const TransferModal = ({
  closeModal,
  openModal,
  balance,
  name,
  tokenBoundAddress,
  abbreviation,
  src,
  contractAddress,
}: Props) => {
  const [transferDetails, setTransferDetails] = useState({
    recipientWalletAddress: "",
    amount: "",
  });
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "amount") {
      const enteredAmount = parseFloat(value);
      if (isNaN(enteredAmount)) {
        newValue = "";
      } else {
        const availableBalance = parseFloat(balance);
        if (enteredAmount > availableBalance) {
          newValue = balance.toString();
        }
      }
    }

    setTransferDetails((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const { tokenbound } = useTokenBoundSDK();
  const transferERC20Assets = async () => {
    try {
      await tokenbound.transferERC20({
        tbaAddress: tokenBoundAddress,
        contractAddress: contractAddress,
        recipient: transferDetails.recipientWalletAddress,
        amount: +transferDetails.amount * 1e18,
      });
    } catch (error) {
      console.log("there was an error transferring the assets");
    }
  };

  return (
    <Transition appear show={openModal} as={Fragment}>
      <Dialog as="div" className="relative z-[999]" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex bg-[#0a0a0a30] min-h-full  justify-center items-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                style={{
                  boxShadow: "0 0 50px 0 #EC796B33",
                }}
                className="rounded-[20px] overflow-hidden mt-20  bg-[#fAFAFA] p-10 w-[90%] md:w-[50%] lg:w-[30rem] min-h-[30rem] text-deep-blue"
              >
                <div className="flex justify-between ">
                  <h3 className="text-[1.5em]">Send</h3>
                  <button onClick={closeModal}>
                    <CancelIcon />
                  </button>
                </div>
                <div className=" flex flex-col gap-4">
                  <div>
                    <h4 className="text-[1em] mb-2">Asset</h4>
                    <div className="flex justify-between flex-wrap gap-2">
                      <div className="flex items-center flex-wrap gap-4">
                        <div className="h-[2.2rem] w-[2.2rem] rounded-full">
                          <Image
                            alt=""
                            src={src}
                            width={10}
                            height={10}
                            className="rounded-full"
                          />
                        </div>
                        <div>
                          <p className="uppercase">{abbreviation}</p>
                          <p className="text-[.875em] text-[#5a5a5a]">{name}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 items-center">
                        <div>
                          <p>{balance}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <form className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="walletAddress">Wallet Address</label>
                      <input
                        required
                        type="text"
                        id="walletAddress"
                        name="recipientWalletAddress"
                        placeholder="Enter Wallet Address"
                        value={transferDetails.recipientWalletAddress}
                        onChange={handleInputChange}
                        className=" p-[.8rem] border-solid border-[1px] rounded-[8px] border-[#7A7A7A]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="amount">Amount</label>
                      <input
                        required
                        className=" p-[.8rem] border-solid border-[1px] rounded-[8px] border-[#7A7A7A]"
                        type="text"
                        id="amount"
                        name="amount"
                        value={transferDetails.amount}
                        onChange={handleInputChange}
                        placeholder="Enter Amount"
                      />
                    </div>
                    <button
                      disabled={
                        !transferDetails.recipientWalletAddress ||
                        !transferDetails.amount
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        transferERC20Assets();
                      }}
                      className={`w-full p-[.8rem] bg-deep-blue rounded-[8px] text-white ${
                        !transferDetails.recipientWalletAddress ||
                        !transferDetails.amount
                          ? "opacity-50"
                          : "opacity-100"
                      }`}
                    >
                      send &rarr;
                    </button>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TransferModal;
