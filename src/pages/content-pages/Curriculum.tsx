import { useEffect } from "react";
import toast from "react-hot-toast";
import { IoMdAdd as AddIcon } from "react-icons/io";

import { CustomButton } from "@/components/common/Inputs";
import {
  useEditCurriculumMutation,
  useGetCurriculumQuery,
} from "@/store/apis/content-mangement/mentor-apis";
import { showError } from "@/lib/reusable-funs";
import {
  LoadingSpinner,
  PageLoadingSpinner,
} from "@/components/common/LoadingSpinner";

function Curriculum() {
  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetCurriculumQuery();

  const [
    editCurriculum,
    {
      isLoading: isUpdating,
      error: updationError,
      isSuccess: updationSuccess,
      data: updationData,
    },
  ] = useEditCurriculumMutation();

  // Show error
  useEffect(() => {
    const error = loadingError || updationError;
    if (error) {
      showError(error);
    }
  }, [loadingError || updationError]);

  // Show success message
  useEffect(() => {
    if (updationSuccess) {
      toast.success(updationData?.message);
    }
  }, [updationSuccess]);

  const file = data?.data?.curriculum;

  const handlePdfUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];

    // Prepare FormData
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
      editCurriculum(formData);
    }
  };

  return (
    <div className="main-container h-full">
      <input
        id="curriculumInput"
        type="file"
        accept="application/*"
        className="hidden"
        onChange={handlePdfUpload}
      />
      <CustomButton
        className="green-button px-2 py-4 min-w-[8rem]"
        handleClick={() => document.getElementById("curriculumInput")?.click()}
        disabled={isUpdating || isLoading}
      >
        {isUpdating ? (
          <LoadingSpinner />
        ) : (
          <>
            <AddIcon size={30} className="p-0 m-0" />
            Edit Curriculum
          </>
        )}
      </CustomButton>

      <iframe src={file} className="w-full h-full border-0 " />

      {isLoading && <PageLoadingSpinner />}
    </div>
  );
}

export default Curriculum;
