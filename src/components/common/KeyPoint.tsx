// Certificate key points
import { useEffect, useState } from "react";

import { CustomDialog } from "@/components/common/CustomDialog";
import { CustomButton, CustomTextArea } from "@/components/common/Inputs";

interface Props {
  open: boolean;
  handleOpen: () => void;
  keyPoints: string[];
  setKeyPoints: React.Dispatch<React.SetStateAction<string[]>>;
  updateId?: string;
  setUpdateId?: React.Dispatch<React.SetStateAction<string>>;
}
function KeyPoint({
  open,
  handleOpen,
  keyPoints,
  setKeyPoints,
  updateId,
  setUpdateId,
}: Props) {
  const [title, setTitle] = useState("");

  // Initialise data
  useEffect(() => {
    if (updateId) {
      const keyPoint = keyPoints[Number(updateId)];
      if (keyPoint) setTitle(keyPoint);
    } else {
      setTitle("");
    }
  }, [updateId, keyPoints]);

  // Handle key point updation or additon
  const handleSubmit = () => {
    const newKeyPoints = [...keyPoints];

    if (updateId) {
      newKeyPoints[Number(updateId)] = title;
    } else {
      newKeyPoints.push(title);
    }

    setKeyPoints(newKeyPoints);

    if (setUpdateId) setUpdateId("");
    handleOpen();
  };

  return (
    <CustomDialog open={open} handleOpen={handleOpen} className="w-[30rem]">
      <div className="text-[1.5rem] font-medium h-max text-center">
        {" "}
        Key point
      </div>

      <div className="main-container !bg-[var(--dark-black)] !py-8">
        <div className="flex flex-col gap-2">
          <div className="label">Title</div>
          <div className="user-input">
            <CustomTextArea
              text={title}
              setText={setTitle}
              placeholder="Type your title here..."
              maxChars={70}
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

export default KeyPoint;
