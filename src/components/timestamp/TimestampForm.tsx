import { useEffect, useState } from "react";
import InputMask from "react-input-mask";

import { CustomDialog } from "../common/CustomDialog";
import { CustomInput, CustomButton } from "../common/Inputs";
import {
  useAddTimeStampMutation,
  useUpdateTimestampMutation,
} from "@/store/apis/timestamp-apis";
import { secondsToTime, showError, TimeToSeconds } from "@/lib/reusable-funs";
import toast from "react-hot-toast";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { TimeStampType } from "@/lib/interfaces-types";

interface Props {
  open: boolean;
  handleOpen: (timestamp?: TimeStampType) => void;
  videoId: string;
  timestamp?: TimeStampType;
  clearTimestamp?: () => void;
}
function TimestampForm({
  open,
  handleOpen,
  videoId,
  timestamp,
  clearTimestamp,
}: Props) {
  const [time, setTime] = useState("00:00:00");
  const [title, setTitle] = useState("");

  const [
    addTimestamp,
    {
      isLoading: isAdding,
      error: additionError,
      isSuccess: additionSuccess,
      data: additionData,
    },
  ] = useAddTimeStampMutation();
  const [
    updateTimestamp,
    {
      isLoading: isUpdating,
      error: updationError,
      isSuccess: updateSuccess,
      data: updateData,
    },
  ] = useUpdateTimestampMutation();

  const clearData = () => {
    setTime("00:00:00");
    setTitle("");
  };

  const handleSubmit = async () => {
    if (isAdding || isUpdating) return;
    const data = { time: String(TimeToSeconds(time)), title };
    if (timestamp && timestamp?._id) {
      await updateTimestamp({ timestampId: timestamp._id, data });
    } else {
      await addTimestamp({ videoId, data });
    }
  };

  // Handle errors
  useEffect(() => {
    if (additionError) {
      showError(additionError);
    }
  }, [additionError]);

  useEffect(() => {
    if (updationError) {
      showError(updationError);
    }
  }, [updationError]);

  // Handle success
  useEffect(() => {
    if (updateData && clearTimestamp) {
      toast.success(updateData.message);
      handleOpen();
      clearTimestamp();
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (additionData && clearTimestamp) {
      toast.success(additionData.message);
      handleOpen();
      clearTimestamp();
    }
  }, [additionSuccess]);

  // Initialize data
  useEffect(() => {
    if (timestamp) {
      setTitle(timestamp.title);
      const formattedTime = secondsToTime(Number(timestamp.time));
      setTime(String(formattedTime));
    } else {
      clearData();
    }
  }, [timestamp]);

  const isSubmitting = isAdding || isUpdating;

  return (
    <CustomDialog
      open={open}
      handleOpen={() => {
        handleOpen();
      }}
      className="w-[30rem]"
    >
      <div className="text-[1.5rem] font-medium h-max text-center">
        {" "}
        Timestamp
      </div>

      <div className="main-container !bg-[var(--dark-black)] !py-8">
        <div className="flex flex-col gap-2">
          <div className="label">Start time</div>
          <div className="user-input">
            <InputMask
              className="bg-black resize-none border rounded-sm border-gray-400 py-2 px-2 w-full "
              mask="99:99:99"
              placeholder="HH:MM:SS"
              maskChar="0"
              value={time}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTime(e.target.value);
              }}
            ></InputMask>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="label">Title</div>
          <div className="user-input">
            <CustomInput
              text={title}
              setText={setTitle}
              className="py-5"
              placeholder="Type title here..."
            />
          </div>
        </div>

        <CustomButton
          className="green-button mt-2 !min-w-16"
          handleClick={handleSubmit}
        >
          {!isSubmitting ? timestamp ? "Save" : "Add" : <LoadingSpinner />}
        </CustomButton>
      </div>
    </CustomDialog>
  );
}

export default TimestampForm;
