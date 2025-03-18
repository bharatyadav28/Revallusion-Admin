import { Circle } from "lucide-react";

import { orderType, userDetailsType } from "@/lib/interfaces-types";
import { convertToDate } from "@/lib/reusable-funs";
import ProfileImage from "/ProfileImage.png";

interface Props {
  user?: userDetailsType;
  activeOrder?: orderType;
  plansMapping?: Map<string, string>;
}

function BasicDetails({ user, activeOrder, plansMapping }: Props) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-start-1 lg:col-span-8 col-span-12 justify-between  main-container !flex-row !py-6 ">
        <div className="flex lg:flex-row flex-col gap-6 ">
          <div className="relative w-[8.8rem] h-[8.8rem]  border-2  border-gray-300 hover:scale-105 transition-all ease-out duration-300 cursor-pointer rounded-full ">
            <img
              src={user?.avatar || ProfileImage}
              alt={user?.name + " avatar"}
              className="object-cover w-full h-full rounded-full"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="text-lg font-medium uppercase">{user?.name}</div>
            <div className="mt-2 text-gray-400 ">
              Email Address: {user?.email}
            </div>
            <div className=" text-gray-400">
              Mobile Number: {user?.mobile || "NA"}
            </div>
          </div>
        </div>

        <div className="lg:flex hidden">
          <span className="green-button py-1 px-2 rounded-sm text-sm h-max">
            Active
          </span>
        </div>
      </div>

      <div className="lg:col-start-9  col-start-1 col-span-12 main-container !py-4 !gap-2 text-sm">
        <div className="text-[1.2rem] font-medium mb-2 mt-1">
          Subscription Plan
        </div>

        <div className="plan-container">
          <div>
            <Circle size={20} fill="#d6b6e6" />
          </div>
          <div className="flex flex-col">
            <div className="font-medium">
              {activeOrder?.plan
                ? plansMapping?.get(activeOrder?.plan)
                : " No active plan"}
            </div>
            <div>Current Plan</div>
          </div>
        </div>

        <div className="plan-container">
          <div>
            <Circle size={20} fill="rgb(103, 204, 154) " />
          </div>
          <div className="flex flex-col">
            <div className="font-medium">
              {convertToDate(activeOrder?.expiry_date) || "NA"}
            </div>
            <div>Subscription expires on</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasicDetails;
