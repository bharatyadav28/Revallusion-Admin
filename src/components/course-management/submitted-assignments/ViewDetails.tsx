import CustomDrawer from "@/components/common/CustomDrawer";
import { SubmittedAssignmentType } from "@/lib/interfaces-types";
import { formatDate } from "@/lib/reusable-funs";

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
          </div>
        </div>
      </div>
    </CustomDrawer>
  );
}

export default ViewDetails;
