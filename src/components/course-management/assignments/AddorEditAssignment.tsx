// Dialog to add or edit assignment

import { useEffect, useState } from "react";

import { CustomDialog } from "../../common/CustomDialog";
import { CustomButton, CustomInput } from "../../common/Inputs";
import {
  useAddAssignmentMutation,
  useUpdateAssignmentNameMutation,
} from "@/store/apis/assignment-apis";
import { LoadingSpinner } from "../../common/LoadingSpinner";
import toast from "react-hot-toast";
import { showError } from "@/lib/reusable-funs";
import { assignmentType } from "@/lib/interfaces-types";
import FileUploader from "../../common/FileUpload";

interface EditNameProps {
  open: boolean;
  handleOpen: () => void;
  isEdit: boolean;
  courseId: string;
  moduleId: string;
  submoduleId: string;
  assignmentData?: assignmentType | null;
}

export default function AddorEditAssignment({
  open,
  handleOpen,
  isEdit,
  courseId,
  moduleId,
  submoduleId,
  assignmentData,
}: EditNameProps) {
  const [name, setName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isFileUploading, setIsFileUploading] = useState(false);

  // Assigment addition
  const [
    addAssignment,
    {
      isLoading: isAdding,
      isSuccess: isAddingSuccess,
      error: additionError,
      data: additionData,
    },
  ] = useAddAssignmentMutation();

  // Assignment name updation
  const [
    updateAssignment,
    {
      isLoading: isUpdating,
      isSuccess: isUpdationSuccess,
      error: updationError,
      data: updationData,
    },
  ] = useUpdateAssignmentNameMutation();

  const isFormSubmitting = isAdding || isUpdating;

  // Handles assigment addition success
  useEffect(() => {
    if (additionData) {
      const message = additionData?.message;
      toast.success(message);
      handleOpen();
    }
  }, [isAddingSuccess]);

  // Handle assigment updation success
  useEffect(() => {
    if (updationData) {
      const message = updationData?.message || "Success";
      toast.success(message);
      handleOpen();
    }
  }, [isUpdationSuccess]);

  // Handles errors while adding or deleting assignment
  useEffect(() => {
    const error = additionError || updationError;
    if (error) {
      showError(error);
    }
  }, [additionError, updationError]);

  // Form submit handler
  const handleSubmit = () => {
    if (isFormSubmitting) {
      return;
    }
    if (!isEdit) {
      addAssignment({ name, courseId, submoduleId, moduleId, fileUrl });
    } else {
      if (!assignmentData?._id) {
        return;
      }
      updateAssignment({ name, id: assignmentData?._id });
    }
  };

  // Initialise value to edit
  useEffect(() => {
    if (isEdit && assignmentData?.name) {
      setName(assignmentData?.name);
    } else {
      setName("");
      setFileUrl("");
    }
  }, [assignmentData?.name, isEdit]);

  return (
    <CustomDialog open={open} handleOpen={handleOpen} className="w-[33rem]">
      <div className="text-[1.5rem] font-medium h-max text-center">
        {isEdit ? "Edit" : "Add"} Assignment
      </div>

      <div className="main-container !bg-[var(--dark-black)] !py-8">
        <div className="flex flex-col gap-2">
          <div className="label">Name</div>
          <div className="user-input">
            <CustomInput
              text={name}
              setText={setName}
              className="py-5"
              placeholder="Type name here..."
            />
          </div>
        </div>

        {!isEdit && (
          <div className="flex flex-col gap-2">
            <div className="label">File</div>
            <div className="user-input">
              <FileUploader
                fileSrc={fileUrl}
                setFileSrc={setFileUrl}
                uploading={isFileUploading}
                setUploading={setIsFileUploading}
              />
            </div>
          </div>
        )}

        <CustomButton
          className="green-button mt-2"
          handleClick={handleSubmit}
          disabled={isFileUploading}
        >
          {isFormSubmitting ? <LoadingSpinner /> : isEdit ? "Update" : "Add"}
        </CustomButton>
      </div>
    </CustomDialog>
  );
}
