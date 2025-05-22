import { Circle } from "lucide-react";

import { orderType, userDetailsType } from "@/lib/interfaces-types";
import { convertToDate } from "@/lib/reusable-funs";
import ProfileImage from "/ProfileImage.png";

interface Props {
  user?: userDetailsType;
  activeOrder?: orderType;
  plansMapping?: Map<string, string>;
  completionDate?: string | undefined;
  completionTime?: number | undefined;
  file?: string | undefined;
}

function BasicDetails({
  user,
  activeOrder,
  plansMapping,
  completionTime,
  completionDate,
  file,
}: Props) {
  const completionTimeInDays = completionTime
    ? Math.ceil(completionTime / (24 * 60 * 60)) + " days"
    : "NA";

  const pathname = file && new URL(file).pathname;
  const trimmed = pathname?.replace(/\/$/, "");
  const lastSegment = trimmed?.split("/").pop();

  return (
    <div className="flex md:flex-row flex-col gap-4 ">
      <div className=" justify-between  main-container !flex-row !py-6 ">
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

      <div className="flex-1 main-container !py-4 !gap-2 text-sm">
        <div className="text-[1.2rem] font-medium mb-2 mt-1">
          Subscription Plan
        </div>

        <div className="flex md:flex-row flex-col gap-2 !pr-0 whitespace-nowrap">
          <div className="flex-1 flex flex-col gap-2">
            <div className="plan-container">
              <div>
                <Circle size={20} fill="#d6b6e6" />
              </div>

              <div className="flex flex-col">
                <div className="font-medium ">
                  {activeOrder?.plan
                    ? plansMapping?.get(activeOrder?.plan)
                    : " No active plan"}
                </div>
                <div className="">Current Plan</div>
              </div>
            </div>

            <div className="plan-container !mr-0">
              <div>
                <Circle size={20} fill="#F08080" />
              </div>
              <div className="flex flex-col">
                <div className="font-medium">
                  {activeOrder?.createdAt
                    ? convertToDate(activeOrder?.createdAt)
                    : "NA"}
                </div>
                <div>Subscribed On</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="plan-container">
              <div>
                <Circle size={20} fill="#B0C4DE" />
              </div>
              <div className="flex flex-col">
                <div className="font-medium">
                  {convertToDate(activeOrder?.expiry_date) || "NA"}
                </div>
                <div>Expires on</div>
              </div>
            </div>

            <div className="plan-container !mr-0">
              <div>
                <Circle size={20} fill="#FAFAD2" />
              </div>
              <div className="flex flex-col">
                <div className="font-medium">
                  {completionDate ? convertToDate(completionDate) : "NA"}
                </div>
                <div>Completion Date</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="plan-container !mr-0">
              <div>
                <Circle size={20} fill="#FFA07A" />
              </div>
              <div className="flex flex-col">
                <div className="font-medium">{completionTimeInDays}</div>
                <div>Completion Time</div>
              </div>
            </div>

            <button
              className={`plan-container !mr-0 ${
                !lastSegment ? "!cursor-not-allowed" : ""
              }`}
              onClick={() => {
                if (lastSegment) window.open(file, "_blank");
              }}
            >
              <div>
                <Circle size={20} fill="#90EE90" />
              </div>
              <div className="flex flex-col">
                <div className="font-medium">{"Download"}</div>
                <div>Certificate</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasicDetails;
