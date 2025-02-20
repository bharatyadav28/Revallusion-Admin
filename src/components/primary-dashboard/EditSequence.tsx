// Image sequence in carousal

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { CustomDialog } from "../common/CustomDialog";
import { CustomInput, CustomButton } from "../common/Inputs";
import { LoadingSpinner } from "../common/LoadingSpinner";

import { showError } from "@/lib/reusable-funs";
import { dashboardCarousalType } from "@/lib/interfaces-types";
import { useUpdateCarousalSequenceMutation } from "@/store/apis/primary-dashboard-apis";

interface Props {
  open: boolean;
  handleOpen: () => void;
  item: dashboardCarousalType;
}

function EditSequence({ open, handleOpen, item }: Props) {
  const [sequence, setSequence] = useState("");

  // Update sequence
  const [
    updateSequence,
    {
      isLoading: isUpdatingSequence,
      isSuccess: sequenceUpdationSuccess,
      error: sequenceUpdationError,
      data: sequenceUpdationData,
    },
  ] = useUpdateCarousalSequenceMutation();

  // Handle error
  useEffect(() => {
    if (sequenceUpdationError) {
      showError(sequenceUpdationError);
    }
  }, [sequenceUpdationError]);

  // Handle success
  useEffect(() => {
    if (sequenceUpdationSuccess) {
      const message = sequenceUpdationData?.message || "Success";
      toast.success(message);
      handleOpen();
    }
  }, [sequenceUpdationSuccess]);

  // Intialise sequence
  useEffect(() => {
    if (item && item?.sequence) {
      setSequence(item?.sequence.toString());
    }
  }, [item]);

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
            if (item._id)
              updateSequence({
                id: item._id,
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

export default EditSequence;
