import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { CustomDialog } from "../common/CustomDialog";
import { CustomInput, CustomButton } from "../common/Inputs";
import { LoadingSpinner } from "../common/LoadingSpinner";

import { showError } from "@/lib/reusable-funs";
import { dashboardSectionType } from "@/lib/interfaces-types";
import {
  useAddSectionMutation,
  useUpdateSectionMutation,
} from "@/store/apis/primary-dashboard-apis";

interface Props {
  open: boolean;
  handleOpen: () => void;
  section: dashboardSectionType | null;
}

function EditSection({ open, handleOpen, section }: Props) {
  const [name, setName] = useState("");

  // Add section
  const [
    addSection,
    {
      isLoading: isAdding,
      isSuccess: additionSuccess,
      data: additionData,
      error: additionError,
    },
  ] = useAddSectionMutation();

  // Update section name
  const [
    updateSectionName,
    {
      isLoading: isUpdating,
      isSuccess: updationSuccess,
      data: updationData,
      error: updationError,
    },
  ] = useUpdateSectionMutation();

  // Handle erros
  useEffect(() => {
    if (updationError) {
      showError(updationError);
    }
  }, [updationError]);

  useEffect(() => {
    if (additionError) {
      showError(additionError);
    }
  }, [additionError]);

  // Handle success
  useEffect(() => {
    if (additionSuccess) {
      toast.success(additionData?.message);
      handleOpen();
    }
  }, [additionSuccess]);

  useEffect(() => {
    if (updationSuccess) {
      toast.success(updationData?.message);

      handleOpen();
    }
  }, [updationSuccess]);

  // Initialise vname
  useEffect(() => {
    if (section && section._id) {
      setName(section.name);
    } else {
      setName("");
    }
  }, [section]);

  return (
    <CustomDialog open={open} handleOpen={handleOpen} className="w-[30rem]">
      <div className="text-[1.5rem] font-medium h-max text-center ">
        {section ? "Edit" : "Add"} Section
      </div>

      <div className="main-container !bg-[var(--dark-black)] !py-8 ">
        <div className="flex flex-col gap-2">
          <div className="label">Name</div>
          <div className="user-input">
            <CustomInput
              text={name}
              setText={setName}
              className="py-5"
              placeholder="Type name here..."
              maxChars={50}
            />
          </div>
        </div>

        <CustomButton
          className="green-button mt-2"
          handleClick={() => {
            if (isUpdating || isAdding) return;

            if (section?._id) {
              updateSectionName({
                id: section._id,
                name,
              });
            } else {
              addSection(name);
            }
          }}
        >
          {isUpdating || isAdding ? <LoadingSpinner /> : "Save"}
        </CustomButton>
      </div>
    </CustomDialog>
  );
}

export default EditSection;
