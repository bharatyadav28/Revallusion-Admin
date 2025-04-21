import { useState } from "react";
import CustomSheet from "../common/CustomSheet";
import { CustomButton } from "../common/Inputs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PropsTypes {
  open: boolean;
  handleOpen: () => void;
}
function GatewayForm({ open, handleOpen }: PropsTypes) {
  const [gateway, setGateway] = useState("Razorpay");

  const handleSubmit = () => {};

  return (
    <CustomSheet open={open} handleOpen={handleOpen} className="!w-[25rem]">
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
          // disabled={isUpdating}
        >
          Save
          {/* {isUpdating ? <LoadingSpinner /> : "Save"} */}
        </CustomButton>
      </div>
    </CustomSheet>
  );
}

export default GatewayForm;
