import { useEffect, useState } from "react";

import { CustomDialog } from "../../common/CustomDialog";
import { CustomInput, CustomButton } from "@/components/common/Inputs";
import { useUpdateAssignmentScoreMutation } from "@/store/apis/assignment-apis";
import toast from "react-hot-toast";
import { showError } from "@/lib/reusable-funs";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface Props {
  open: boolean;
  handleOpen: () => void;
  subAssignmentId: string;
  score: number | null;
}
function EditScore({ open, handleOpen, score, subAssignmentId }: Props) {
  const [assignmentScore, setAssignmentScore] = useState("");

  // Assignment score updation
  const [
    updateScore,
    {
      isLoading: isUpdating,
      isSuccess: isUpdationSuccess,
      error: updationError,
      data: updationData,
    },
  ] = useUpdateAssignmentScoreMutation();

  const handleSubmit = () => {
    if (isUpdating) return;
    updateScore({
      score: Number(assignmentScore),
      id: subAssignmentId,
    });
  };

  useEffect(() => {
    if (isUpdationSuccess && updationData) {
      toast.success(updationData.message);
      handleOpen();
    }
  }, [isUpdationSuccess]);

  useEffect(() => {
    if (updationError) {
      showError(updationError);
    }
  }, [updationError]);

  useEffect(() => {
    if (score) {
      setAssignmentScore(String(score));
    }
  }, [score]);

  return (
    <CustomDialog open={open} handleOpen={handleOpen} className="w-[33rem]">
      <div className="text-[1.5rem] font-medium h-max text-center">
        {score ? "Edit" : "Add"} Score
      </div>

      <div className="main-container !bg-[#000111] !py-8">
        <div className="flex flex-col gap-2">
          <div className="label">Score</div>
          <div className="user-input">
            <CustomInput
              text={assignmentScore}
              setText={setAssignmentScore}
              className="py-5"
              placeholder="Type score here..."
              type="number"
            />
          </div>
        </div>

        <CustomButton className="green-button mt-2" handleClick={handleSubmit}>
          {isUpdating ? <LoadingSpinner /> : "Update"}
        </CustomButton>
      </div>
    </CustomDialog>
  );
}

export default EditScore;
