import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { CustomDialog } from "@/components/common/CustomDialog";
import { CustomInput, CustomButton } from "@/components/common/Inputs";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { showError } from "@/lib/reusable-funs";
import { useUpdateRecommendedVideoSequenceMutation } from "@/store/apis/course-apis";

interface Props {
  open: boolean;
  handleOpen: () => void;
  id: string;
  sequence: number;
  courseId: string;
}

function UpdateSequence({ open, handleOpen, id, sequence, courseId }: Props) {
  const [newSequence, setNewSequence] = useState("");

  const [
    updateSequence,
    {
      isLoading: isUpdatingSequence,
      isSuccess: videoSequenceUpdationSuccess,
      error: videoSequenceUpdationError,
      data: videoSequenceUpdationData,
    },
  ] = useUpdateRecommendedVideoSequenceMutation();

  useEffect(() => {
    if (videoSequenceUpdationError) {
      showError(videoSequenceUpdationError);
    }
  }, [videoSequenceUpdationError]);

  // Handle success on addition or updation
  useEffect(() => {
    if (videoSequenceUpdationSuccess) {
      const message = videoSequenceUpdationData?.message || "Success";
      toast.success(message);
      handleOpen();
    }
  }, [videoSequenceUpdationSuccess]);

  useEffect(() => {
    if (id) {
      setNewSequence(sequence.toString());
    }
  }, [id]);

  return (
    <CustomDialog open={open} handleOpen={handleOpen} className="w-[30rem]">
      <div className="text-[1.5rem] font-medium h-max text-center ">
        {"Edit Sequence"}
      </div>

      <div className="main-container !bg-[var(--dark-black)] !py-8 ">
        <div className="flex flex-col gap-2">
          <div className="label">Sequence</div>
          <div className="user-input">
            <CustomInput
              text={newSequence}
              setText={setNewSequence}
              className="py-5"
              placeholder="Type new sequence here..."
              type="number"
            />
          </div>
        </div>

        <CustomButton
          className="green-button mt-2"
          handleClick={() => {
            if (isUpdatingSequence) return;
            if (id)
              updateSequence({
                id,
                sequence: Number(newSequence),
                courseId,
              });
          }}
        >
          {isUpdatingSequence ? <LoadingSpinner /> : "Save"}
        </CustomButton>
      </div>
    </CustomDialog>
  );
}

export default UpdateSequence;
