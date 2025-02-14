import CustomDrawer from "@/components/common/CustomDrawer";
import { CommentType } from "@/lib/interfaces-types";
import { formatDate } from "@/lib/reusable-funs";

interface Props {
  open: boolean;
  handleOpen: () => void;
  commentData: CommentType;
}
function CommentDetails({ open, handleOpen, commentData }: Props) {
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
          Comment - Details
        </h2>
        <hr />

        <div className="flex flex-col gap-5">
          <div className="grid lg:grid-cols-3 gap-y-5">
            <div className={itemClasses}>
              <div className={itemheading}>Submitted By</div>
              <div>{commentData?.user?.name || emptyValue}</div>
            </div>

            <div className={itemClasses}>
              <div className={itemheading}>Email</div>
              <div>{commentData?.user?.email}</div>
            </div>

            <div className={itemClasses}>
              <div className={itemheading}>Submitted At</div>
              <div>{formatDate(commentData?.createdAt)}</div>
            </div>

            <div className={itemClasses}>
              <div className={itemheading}>Comment</div>
              <div>{commentData?.comment}</div>
            </div>

            <div className={itemClasses}>
              <div className={itemheading}>Reply</div>
              <div>{commentData?.reply || emptyValue}</div>
            </div>

            <div className={itemClasses}>
              <div className={itemheading}>Replied At</div>
              <div>
                {commentData?.repliedAt
                  ? formatDate(commentData?.repliedAt)
                  : emptyValue}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomDrawer>
  );
}

export default CommentDetails;
