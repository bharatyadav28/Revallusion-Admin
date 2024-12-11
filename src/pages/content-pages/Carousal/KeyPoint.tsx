import { useEffect, useState } from "react";

import { CustomDialog } from "@/components/common/CustomDialog";
import {
  CustomButton,
  CustomInput,
  CustomTextArea,
} from "@/components/common/Inputs";
import { carousalPointType } from "@/lib/interfaces-types";
import { generateRandomId } from "@/lib/reusable-funs";

interface Props {
  open: boolean;
  handleOpen: () => void;
  keyPoints: carousalPointType[];
  setKeyPoints: React.Dispatch<React.SetStateAction<carousalPointType[]>>;
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
  const [explanation, setExplanation] = useState("");

  // Initialise data
  useEffect(() => {
    if (updateId) {
      const keyPoint = keyPoints.find((keyPoint) => keyPoint._id === updateId);
      if (keyPoint) {
        setTitle(keyPoint.title);
        setExplanation(keyPoint.explanation);
      }
    } else {
      setTitle("");
      setExplanation("");
    }
  }, [updateId, keyPoints]);

  // Handle key point updation or additon
  const handleSubmit = () => {
    const newKeyPoints = [...keyPoints];

    if (updateId) {
      const index = newKeyPoints.findIndex(
        (keyPoint) => keyPoint._id === updateId
      );
      if (index !== -1) {
        newKeyPoints[index] = { title, explanation, _id: updateId };
      }
    } else {
      newKeyPoints.push({
        title,
        explanation,
        _id: updateId || generateRandomId(),
      });
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

      <div className="main-container !bg-[#000111] !py-8">
        <div className="flex flex-col gap-2">
          <div className="label">Title</div>
          <div className="user-input">
            <CustomInput
              text={title}
              setText={setTitle}
              className="py-5"
              placeholder="Type your title here..."
              maxChars={30}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="label">Description</div>
          <div className="user-input">
            <CustomTextArea
              text={explanation}
              setText={setExplanation}
              className="h-20"
              maxChars={150}
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
