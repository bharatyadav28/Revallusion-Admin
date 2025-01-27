import { useEffect } from "react";
import toast from "react-hot-toast";

import { useUpdateVideoStatusMutation } from "@/store/apis/course-apis";
import { showError } from "@/lib/reusable-funs";
import { CustomButton } from "../common/Inputs";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface Props {
  videoId: string;
  sequence: number;
  courseId: string;
}

function VideoStatusButton({ videoId, sequence, courseId }: Props) {
  const [
    updateVideoStatus,
    {
      isLoading: isUpdatingStatus,
      isSuccess: statusUpdationSuccess,
      error: statusUpdationError,
      data: statusUpdationData,
    },
  ] = useUpdateVideoStatusMutation();

  // Handle video status changes
  const handleStatusUpdate = () => {
    if (videoId) {
      updateVideoStatus({
        id: videoId,
        isActive: sequence > 0 ? false : true,
        courseId,
      });
    }
  };

  // Handle status update success
  useEffect(() => {
    if (statusUpdationSuccess) {
      toast.success(statusUpdationData.message);
    }
  }, [statusUpdationSuccess]);

  // Handle errors
  useEffect(() => {
    if (statusUpdationError) {
      showError(statusUpdationError);
    }
  }, [statusUpdationError]);

  return (
    <CustomButton
      className={` w-[5rem] ${sequence > 0 ? "green-button" : "red-button"}`}
      disabled={isUpdatingStatus}
      handleClick={handleStatusUpdate}
    >
      {isUpdatingStatus ? (
        <LoadingSpinner />
      ) : sequence > 0 ? (
        "Active"
      ) : (
        "Inactive"
      )}
    </CustomButton>
  );
}

export default VideoStatusButton;
