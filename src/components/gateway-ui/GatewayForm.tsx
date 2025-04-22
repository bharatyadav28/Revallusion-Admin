import { useEffect, useState } from "react";
import CustomSheet from "../common/CustomSheet";
import { CustomButton } from "../common/Inputs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  useGetAppConfigsQuery,
  useUpdateActiveGatewayMutation,
} from "@/store/apis/app-congif-apis";
import { showError } from "@/lib/reusable-funs";
import { LoadingSpinner } from "../common/LoadingSpinner";
import toast from "react-hot-toast";

interface PropsTypes {
  open: boolean;
  handleOpen: () => void;
}
function GatewayForm({ open, handleOpen }: PropsTypes) {
  const [gateway, setGateway] = useState("Razorpay");

  const { data, error: LoadingError, isFetching } = useGetAppConfigsQuery();

  const [
    updateGateway,
    { isLoading: isUpdating, error: updateError, data: updateData },
  ] = useUpdateActiveGatewayMutation();

  // Handle success
  useEffect(() => {
    if (data) {
      setGateway(data?.data?.activeGateways[0]);
    }
  }, [data]);

  useEffect(() => {
    if (updateData) {
      toast.success(updateData?.message);
    }
  }, [updateData]);

  // Handle errors
  useEffect(() => {
    if (LoadingError) {
      showError(LoadingError);
    }
  }, [LoadingError]);

  useEffect(() => {
    if (updateError) {
      showError(updateError);
    }
  }, [updateError]);

  const handleSubmit = async () => {
    await updateGateway([gateway]);
  };

  return (
    <CustomSheet
      open={open}
      handleOpen={handleOpen}
      className="!w-[25rem] !sm:w-full"
    >
      <div className=" flex flex-col">
        <div className="text-xl font-semibold">Update Gateway</div>
        <div className="mt-2 text-gray-400">
          Please select one of the Gateway. Click save when you're done.
        </div>

        <div className="mt-6">
          <RadioGroup
            defaultValue={gateway}
            onValueChange={setGateway}
            className="gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Razorpay" id="option-one" />
              <Label htmlFor="option-one" className="text-md uppercase">
                Razorpay Payment Gateway
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Cashfree" id="option-two" />
              <Label htmlFor="option-two" className="text-md uppercase">
                CashFree Payment Gateway
              </Label>
            </div>
          </RadioGroup>
        </div>

        <CustomButton
          className="purple-button mt-8"
          handleClick={handleSubmit}
          disabled={isUpdating || isFetching}
        >
          {isUpdating || isFetching ? <LoadingSpinner /> : "Save"}
        </CustomButton>
      </div>
    </CustomSheet>
  );
}

export default GatewayForm;
