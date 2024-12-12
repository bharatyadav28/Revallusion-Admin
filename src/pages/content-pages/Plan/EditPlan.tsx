import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { CustomDialog } from "@/components/common/CustomDialog";
import { CustomButton, CustomInput } from "@/components/common/Inputs";
import { planType } from "@/lib/interfaces-types";
import { useUpdatePlansMutation } from "@/store/apis/content-mangement/plans-apis";
import { showError } from "@/lib/reusable-funs";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { isDigitsOnly } from "@/lib/reusable-funs";

interface Props {
  open: boolean;
  handleOpen: () => void;
  plans: planType[] | [];
  updateId: string;
  setUpdateId?: React.Dispatch<React.SetStateAction<string>>;
}
function EditPlan({ open, handleOpen, plans, updateId, setUpdateId }: Props) {
  const [price, setPrice] = useState("");
  const existingPlan = plans.find((plan: planType) => plan._id === updateId);

  const [updatePlan, { isLoading, error, isSuccess, data }] =
    useUpdatePlansMutation();

  const navigate = useNavigate();

  // Handle plan updation
  const handleSubmit = () => {
    if (!isDigitsOnly(price)) return toast.error("Please enter a valid price");
    if (existingPlan) {
      updatePlan({
        plan: { ...existingPlan, inr_price: price },
        id: updateId,
      });
    }

    if (setUpdateId) setUpdateId("");
  };

  // Initialise data
  useEffect(() => {
    if (updateId) {
      if (existingPlan) {
        setPrice(existingPlan.inr_price);
      }
    }
  }, [updateId, existingPlan]);

  // Handle mutation errors
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  // Handle mutation success messages
  useEffect(() => {
    let message = "Updated successfully";
    if (isSuccess) {
      message = data.message;
    }
    if (isSuccess) {
      toast.success(message);
      handleOpen();
      navigate("/plans");
    }
  }, [isSuccess]);

  return (
    <CustomDialog open={open} handleOpen={handleOpen} className="w-[30rem]">
      <div className="text-[1.5rem] font-medium h-max text-center"> Plan</div>

      <div className="main-container !bg-[#000111] !py-8">
        <div className="flex flex-col gap-2">
          <div className="label">Price</div>
          <div className="user-input">
            <CustomInput
              text={price}
              setText={setPrice}
              className="py-5"
              placeholder="Type plan price here..."
            />
          </div>
        </div>

        <CustomButton className="green-button mt-2" handleClick={handleSubmit}>
          {isLoading ? <LoadingSpinner /> : "Update"}
        </CustomButton>
      </div>
    </CustomDialog>
  );
}

export default EditPlan;
