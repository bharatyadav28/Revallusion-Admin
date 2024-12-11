import { useEffect, useState } from "react";

import { CustomDialog } from "@/components/common/CustomDialog";
import { CustomButton, CustomInput } from "@/components/common/Inputs";
import { generateRandomId } from "@/lib/reusable-funs";
import { networkType } from "@/lib/interfaces-types";

interface Props {
  open: boolean;
  handleOpen: () => void;
  networks: networkType[];
  setNetworks: React.Dispatch<React.SetStateAction<networkType[]>>;
  updateId?: string;
  setUpdateId?: React.Dispatch<React.SetStateAction<string>>;
}
function Network({
  open,
  handleOpen,
  networks,
  setNetworks,
  updateId,
  setUpdateId,
}: Props) {
  const [platform, setPlatform] = useState("");
  const [followers, setFollowers] = useState("");

  // Initialise data
  useEffect(() => {
    if (updateId) {
      const network = networks.find((network) => network._id === updateId);
      if (network) {
        setPlatform(network.platform);
        setFollowers(network.followers);
      }
    } else {
      setPlatform("");
      setFollowers("");
    }
  }, [updateId, networks]);

  // Handle network updation or additon
  const handleSubmit = () => {
    const newNetworks = [...networks];

    if (updateId) {
      const index = newNetworks.findIndex(
        (keyPoint) => keyPoint._id === updateId
      );
      if (index !== -1) {
        newNetworks[index] = { platform, followers, _id: updateId };
      }
    } else {
      newNetworks.push({
        platform,
        followers,
        _id: updateId || generateRandomId(),
      });
    }

    setNetworks(newNetworks);

    if (setUpdateId) setUpdateId("");
    handleOpen();
  };

  return (
    <CustomDialog open={open} handleOpen={handleOpen} className="w-[30rem]">
      <div className="text-[1.5rem] font-medium h-max text-center">
        {" "}
        Network
      </div>

      <div className="main-container !bg-[#000111] !py-8">
        <div className="flex flex-col gap-2">
          <div className="label">Platform</div>
          <div className="user-input">
            <CustomInput
              text={platform}
              setText={setPlatform}
              className="py-5"
              placeholder="Type platform name here..."
              maxChars={50}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="label">Followers</div>
          <div className="user-input">
            <CustomInput
              text={followers}
              setText={setFollowers}
              maxChars={20}
              placeholder="Type number of followers here..."
            />
          </div>
        </div>

        <CustomButton className="green-button mt-2" handleClick={handleSubmit}>
          {updateId ? "Update" : "Add"}
        </CustomButton>
      </div>
    </CustomDialog>
  );
}

export default Network;
