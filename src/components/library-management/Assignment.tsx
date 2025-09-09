import { useEffect, useState } from "react";

import CustomSheet from "../common/CustomSheet";
import { CustomButton } from "../common/Inputs";
import { FileInput } from "./FileInput";
import {
  useGetAssignmentResourcesQuery,
  useUpdateAssignmentResourcesMutation,
} from "@/store/apis/assignment-apis";
import { showError } from "@/lib/reusable-funs";
import toast from "react-hot-toast";
import { LoadingSpinner, PageLoadingSpinner } from "../common/LoadingSpinner";

interface Props {
  open: boolean;
  handleOpen: () => void;
  fileSrc?: string;
  setFileSrc: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  videoId: string;
}

function Assigment({
  open,
  handleOpen,
  fileSrc,
  setFileSrc,
  title,
  videoId,
}: Props) {
  const [assetsSrc, setAssetsSrc] = useState("");
  const [finalCutSrc, setFinalCutSrc] = useState("");

  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetAssignmentResourcesQuery(videoId, {
    skip: !videoId,
  });

  const [
    updateVideo,
    {
      isLoading: isUpdating,
      isSuccess: updationSuccess,
      error: updateError,
      data: updateData,
    },
  ] = useUpdateAssignmentResourcesMutation();

  const handleSubmit = () => {
    if (!videoId) return;
    updateVideo({
      video: videoId,
      assignment: fileSrc || "",
      finalCutVideoUrl: finalCutSrc || "",
      assetsUrl: assetsSrc || "",
    });
  };

  const assignmentResources = data?.data?.assignmentResources;

  useEffect(() => {
    if (assignmentResources) {
      const { assignment, finalCutVideoUrl, assetsUrl } = assignmentResources;
      if (assignment) setFileSrc(assignment);
      if (finalCutVideoUrl) setFinalCutSrc(finalCutVideoUrl);
      if (assetsUrl) setAssetsSrc(assetsUrl);
    }
  }, [assignmentResources]);

  useEffect(() => {
    if (updateError) {
      showError(updateError);
    }
  }, [updateError]);

  useEffect(() => {
    if (loadingError) {
      showError(loadingError);
    }
  }, [loadingError]);

  useEffect(() => {
    if (updationSuccess && updateData) {
      toast.success(updateData?.message);
      handleOpen();
    }
  }, [updationSuccess]);

  return (
    <CustomSheet open={open} handleOpen={handleOpen}>
      <div className="uppercase text-lg">Assignment data</div>

      <div className="main-container mt-4">
        <div className="input-container">
          <div className="label">Assignment</div>
          <div className="user-input">
            <FileInput
              fileSrc={fileSrc}
              setFileSrc={setFileSrc}
              title={title}
              acceptTypes="all"
            />
          </div>
        </div>

        <div className="input-container">
          <div className="label">Final cut video</div>
          <div className="user-input">
            <FileInput
              fileSrc={finalCutSrc}
              setFileSrc={setFinalCutSrc}
              title={`${title}_final_cut`}
              acceptTypes="both"
            />
          </div>
        </div>

        <div className="input-container">
          <div className="label">Assets </div>
          <div className="user-input">
            <FileInput
              fileSrc={assetsSrc}
              setFileSrc={setAssetsSrc}
              title={`${title}_assets`}
              acceptTypes="zip"
            />
          </div>
        </div>

        <div className="mt-2 lg:ml-[17.3rem] flex gap-2">
          <CustomButton
            className="green-button "
            handleClick={handleSubmit}
            disabled={isUpdating || !fileSrc || !finalCutSrc || !assetsSrc}
          >
            {isUpdating ? <LoadingSpinner /> : "Save"}
          </CustomButton>
        </div>
      </div>

      {isLoading && <PageLoadingSpinner />}
    </CustomSheet>
  );
}

export default Assigment;
