import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { CustomDialog } from "../common/CustomDialog";
import { CustomInput, CustomButton } from "../common/Inputs";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useUpdateCarousalMutation } from "@/store/apis/content-mangement/carousal-apis";
import { showError } from "@/lib/reusable-funs";

interface Props {
  open: boolean;
  handleOpen: () => void;

  video: {
    sequence: number;
    videoId: string;
  };
}

function EditCarousal({ open, handleOpen, video }: Props) {
  const [sequence, setSequence] = useState("");

  const [
    updateSequence,
    {
      isLoading: isUpdatingSequence,
      isSuccess: videoSequenceUpdationSuccess,
      error: videoSequenceUpdationError,
      data: videoSequenceUpdationData,
    },
  ] = useUpdateCarousalMutation();

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
    if (video) {
      setSequence(video.sequence.toString());
    }
  }, [video]);

  return (
    <CustomDialog open={open} handleOpen={handleOpen} className="w-[30rem]">
      <div className="text-[1.5rem] font-medium h-max text-center ">
        {"Edit carousal"}
      </div>

      <div className="main-container !bg-[var(--dark-black)] !py-8 ">
        <div className="flex flex-col gap-2">
          <div className="label">Sequence</div>
          <div className="user-input">
            <CustomInput
              text={sequence}
              setText={setSequence}
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
            if (video.videoId)
              updateSequence({
                videoId: video.videoId,
                sequence: Number(sequence),
              });
          }}
        >
          {isUpdatingSequence ? <LoadingSpinner /> : "Save"}
        </CustomButton>
      </div>
    </CustomDialog>
  );
}

export default EditCarousal;
