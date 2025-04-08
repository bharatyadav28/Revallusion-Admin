import { FaDownload as DownloadIcon } from "react-icons/fa";

import CustomDrawer from "@/components/common/CustomDrawer";
import { SubmittedAssignmentType } from "@/lib/interfaces-types";
import { convertToDate, formatDate } from "@/lib/reusable-funs";
import { CustomButton } from "@/components/common/Inputs";

interface Props {
  open: boolean;
  handleOpen: () => void;
  assigmentData: SubmittedAssignmentType;
}
function ViewDetails({ open, handleOpen, assigmentData }: Props) {
  const itemClasses = "flex flex-col gap-1 ";
  const itemheading = "font-semibold text-lg";

  // Handle empty values
  const emptyValue = (
    <div className="ml-3 flex items-center pt-3 ">
      <hr className="border-gray-400 border w-4 " />
    </div>
  );

  return (
    <CustomDrawer open={open} handleOpen={handleOpen}>
      <div className="main-container !gap-[0.5rem]">
        <h2 className="text-xl font-semibold border-b-[1px] pb-4 border-gray-700 ">
          Submission - Details
        </h2>
        <hr />

        <div className="flex flex-col gap-5">
          <div className="grid lg:grid-cols-3 gap-y-5">
            <div className={itemClasses}>
              <div className={itemheading}>Submitted By</div>
              <div>{assigmentData?.user?.name || emptyValue}</div>
            </div>

            <div className={itemClasses}>
              <div className={itemheading}>Email</div>
              <div>{assigmentData?.user?.email}</div>
            </div>

            <div className={itemClasses}>
              <div className={itemheading}>Graded At</div>
              <div>
                {assigmentData?.gradedAt
                  ? formatDate(assigmentData?.gradedAt)
                  : emptyValue}{" "}
              </div>
            </div>

            <div className={itemClasses}>
              <div className={itemheading}>Submitted At</div>
              <div>{formatDate(assigmentData?.submittedAt)} </div>
            </div>

            <div className={itemClasses}>
              <div className={itemheading}>Score</div>
              <div>{assigmentData?.score || emptyValue} </div>
            </div>

            <div className={itemClasses}>
              <div className={itemheading}>Recent submission</div>
              <div className="flex flex-col">
                <CustomButton
                  className="bg-[#2C2C2C)] text-[#f1f1f1] hover:bg-[#3C3C3C] transition !px-2 "
                  handleClick={() => {
                    window.open(assigmentData?.submittedFileUrl, "_blank");
                  }}
                >
                  <DownloadIcon size={5} className="mr-1" />{" "}
                  {/* Download icon */}
                  File
                </CustomButton>
              </div>
            </div>
          </div>

          {assigmentData?.revokedSubmissions?.length > 0 && (
            <div className={itemClasses}>
              <div className={itemheading}>History</div>
              <div className="grid grid-cols-[repeat(4,_max-content)] gap-x-4 gap-y-1 ml-1">
                <div className="sub-heading">S. No.</div>
                <div className="sub-heading">Submitted On</div>
                <div className="sub-heading">Revoked On</div>
                <div className="hidden md:block sub-heading">Submission</div>
                <div className="md:hidden block sub-heading">File</div>

                {assigmentData?.revokedSubmissions?.map((submission, index) => {
                  return (
                    <>
                      <div className="ml-1 text-sm"> {index + 1} </div>
                      <div className="text-sm">
                        {" "}
                        {convertToDate(submission.submittedAt)}{" "}
                      </div>

                      <div className="text-sm">
                        {" "}
                        {convertToDate(submission.revokedAt)}{" "}
                      </div>

                      <button
                        className="bg-[#2C2C2C)] text-[#f1f1f1] hover:bg-[#3C3C3C] transition text-sm !py-0 "
                        key={index}
                        onClick={() => {
                          window.open(submission.submittedFileUrl, "_blank");
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <DownloadIcon size={12} /> {/* Download icon */}
                          File {index + 1}
                        </div>
                      </button>
                    </>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </CustomDrawer>
  );
}

export default ViewDetails;
