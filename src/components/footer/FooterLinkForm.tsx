import React, { useEffect } from "react";
import { CustomDialog } from "../common/CustomDialog";
import { CustomButton, CustomInput } from "../common/Inputs";
import ImageUploader from "../common/ImageUpload";
import { FooterLinkType } from "@/lib/interfaces-types";
import {
  useAddFooterLinkMutation,
  useUpdateFooterLinkMutation,
} from "@/store/apis/content-mangement/footer-links-apis";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { showError } from "@/lib/reusable-funs";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  handleOpen: () => void;
  linkData?: FooterLinkType | null;
}
function FooterLinkForm({ open, handleOpen, linkData }: Props) {
  const [iconPath, setIconPath] = React.useState("");
  const [url, setUrl] = React.useState("");

  const [
    addLink,
    { isLoading: isAdding, error: additionError, isSuccess, data: addData },
  ] = useAddFooterLinkMutation();

  const [
    updateLink,
    {
      isLoading: isUpdating,
      error: updationError,
      isSuccess: isUpdateSuccess,
      data: updateData,
    },
  ] = useUpdateFooterLinkMutation();

  const handleSubmit = () => {
    if (!linkData) {
      addLink({ footerLink: { iconPath, url } });
    } else {
      updateLink({
        footerLinkId: linkData._id || "",
        footerLink: { iconPath, url },
      });
    }
  };

  useEffect(() => {
    setIconPath(linkData?.iconPath || "");
    setUrl(linkData?.url || "");
  }, [linkData]);

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

  useEffect(() => {
    let message = "Updated successfully";
    if (isSuccess) {
      message = addData.message;
    }
    if (isUpdateSuccess) {
      message = updateData.message;
    }
    if (isSuccess || isUpdateSuccess) {
      toast.success(message);
      handleOpen();
      setIconPath("");
      setUrl("");
    }
  }, [isUpdateSuccess, isSuccess]);

  return (
    <CustomDialog open={open} handleOpen={handleOpen} className="w-[30rem]">
      <div className="text-[1.5rem] font-medium h-max text-center">
        {" "}
        Footer Link
      </div>

      <div className="main-container !bg-[var(--dark-black)] !py-8">
        <div className="flex flex-col gap-3">
          <div className="label">Icon</div>
          <div className="user-input max-w-full">
            <ImageUploader
              imageSrc={iconPath}
              setImageSrc={setIconPath}
              alt="icon"
              folder="Icon"
              className="h-20 w-20 object-cover text-center"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="label">Url</div>
          <div className="user-input">
            <CustomInput
              text={url}
              setText={setUrl}
              className="py-5"
              placeholder="Type icon path here..."
            />
          </div>
        </div>

        <CustomButton className="green-button mt-2" handleClick={handleSubmit}>
          {/* {isLoading ? <LoadingSpinner /> : "Update"} */}
          {isUpdating || isAdding ? (
            <LoadingSpinner />
          ) : linkData ? (
            "Update"
          ) : (
            "Create"
          )}
        </CustomButton>
      </div>
    </CustomDialog>
  );
}

export default FooterLinkForm;
