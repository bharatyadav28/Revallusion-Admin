import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/use-redux";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import { replacePageName } from "@/store/features/generalSlice";
import {
  CustomInput,
  CustomTextArea,
  CustomSelect,
} from "@/components/common/Inputs";
import { CustomButton } from "@/components/common/Inputs";
import {
  useAddFaqMutation,
  useUpdateFaqMutation,
} from "@/store/apis/content-mangement/faq-apis";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { showError } from "@/lib/reusable-funs";

function Faq() {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const [
    addFaq,
    { isLoading: isAdding, error: additionError, isSuccess, data },
  ] = useAddFaqMutation();
  const [
    updateFaq,
    {
      isLoading: isUpdating,
      error: updationError,
      isSuccess: updateSuccess,
      data: updateData,
    },
  ] = useUpdateFaqMutation();

  // Handle faq updation or additon
  const handleSubmit = async () => {
    if (location.state?.isEdit) {
      await updateFaq({
        faq: { title, description, status },
        id: location.state.faq._id,
      });
    } else {
      await addFaq({
        title,
        description,
        status,
      });
    }
  };

  // Initialise data
  useEffect(() => {
    const isEdit = location.state?.isEdit;
    const faq = location.state?.faq;

    const title = isEdit ? "Edit Faq" : "Add Faq";
    dispatch(replacePageName(title));
    if (isEdit) {
      setTitle(faq.title);
      setDescription(faq.description);
      setStatus(faq.status);
    }
  }, [dispatch]);

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

  // Handle mutation success messages
  useEffect(() => {
    let message = "Updated successfully";
    if (isSuccess) {
      message = data.message;
    }
    if (updateSuccess) {
      message = updateData.message;
    }
    if (isSuccess || updateSuccess) {
      toast.success(message);
      navigate("/faq");
    }
  }, [isSuccess, updateSuccess]);

  return (
    <>
      <div className="main-container">
        <div className="input-container">
          <div className="label">Title</div>
          <div className="user-input">
            <CustomInput text={title} setText={setTitle} className="py-5" />
          </div>
        </div>

        <div className="input-container">
          <div className="label">Description</div>
          <div className="user-input">
            <CustomTextArea
              text={description}
              setText={setDescription}
              className="h-32"
            />
          </div>
        </div>

        <div className="input-container">
          <div className="label">Status</div>
          <div className="user-input">
            <CustomSelect
              menu={["Active", "Inactive"]}
              value={status}
              onChange={setStatus}
            />
          </div>
        </div>

        <CustomButton
          className="purple-button mt-2 lg:ml-[17.3rem]"
          handleClick={handleSubmit}
          disabled={isAdding}
        >
          {isAdding || isUpdating ? <LoadingSpinner /> : "Save"}
        </CustomButton>
      </div>
    </>
  );
}

export default Faq;
