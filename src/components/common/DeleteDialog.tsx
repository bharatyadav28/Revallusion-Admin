// Delete dailog
import React from "react";
import { Trash as DeleteIcon } from "lucide-react";

import { CustomDialog } from "./CustomDialog";
import { CustomButton } from "./Inputs";
import { LoadingSpinner } from "./LoadingSpinner";

interface Props {
  openDialog: boolean;
  handleOpenDialog: () => void;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  Icon?: React.ElementType;
  isDeleting?: boolean;
}

function DeleteDialog({
  openDialog,
  handleOpenDialog,
  title,
  description,
  onCancel,
  onConfirm,
  Icon,
  isDeleting = false,
}: Props) {
  return (
    <CustomDialog
      open={openDialog}
      handleOpen={handleOpenDialog}
      className="w-max !p-0 overflow-visible "
    >
      <div className="relative z-[1000]">
        {/* Icon */}
        <div className="w-[115px] h-[70px]  border-black/65 border-[8px] rounded-b-full absolute  left-1/2 -translate-x-1/2 top-[-0.62rem]"></div>
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[100px] h-[100px] border-[8px] flex justify-center items-center bg-[#1B1B1B] rounded-full">
          {Icon ? (
            <Icon className="text-white" />
          ) : (
            <DeleteIcon className="text-white" />
          )}
        </div>

        {/* Content */}
        <div className="bg-[#fff] p-4 pt-20 min-w-[20rem] rounded-3xl flex flex-col justify-center items-center gap-2 text-black">
          <div className="text-center font-bold text-2xl">{title} </div>
          <div className="text-center text-[0.9rem]">{description}</div>

          <div className="grid grid-cols-2 gap-2 mt-4 w-full">
            <CustomButton
              className="border-none py-6 !w-full min-w-[10rem] bg-[#f1f4f6] hover:bg-[#f1f4f6] text-black !hover:opacity-50 rounded-lg "
              handleClick={onCancel}
            >
              Cancel
            </CustomButton>
            <CustomButton
              className="py-6 !w-full min-w-[10rem] bg-[#1B1B1B] text-[#fff] hover:bg-[#1B1B1B] hover:opacity-80 rounded-lg "
              handleClick={onConfirm}
            >
              {isDeleting ? <LoadingSpinner /> : "Confirm"}
            </CustomButton>
          </div>
        </div>
      </div>
    </CustomDialog>
  );
}

export default DeleteDialog;
