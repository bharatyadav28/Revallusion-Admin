import { videoType } from "@/lib/interfaces-types";
import CustomDrawer from "./common/CustomDrawer";
import { formatDate } from "@/lib/reusable-funs";

interface Props {
  open: boolean;
  handleOpen: () => void;
  videoData: videoType | null;
}
function VideoDetails({ open, handleOpen, videoData }: Props) {
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
      {videoData && (
        <div className="main-container !gap-[0.5rem]">
          <h2 className="text-xl font-semibold border-b-[1px] pb-4 border-gray-700 ">
            Video - Details
          </h2>
          <hr />

          <div className="flex flex-col gap-5">
            <div className="grid lg:grid-cols-3 gap-y-5">
              <div className={itemClasses}>
                <div className={itemheading}>Title</div>
                <div>{videoData?.title}</div>
              </div>

              <div className={itemClasses}>
                <div className={itemheading}>Course</div>
                <div>{videoData.course || emptyValue}</div>
              </div>

              <div className={itemClasses}>
                <div className={itemheading}>Module</div>
                <div>{videoData.module || emptyValue} </div>
              </div>

              <div className={itemClasses}>
                <div className={itemheading}>Sub Module</div>
                <div>
                  {videoData.submodule || emptyValue}
                  <div></div>
                </div>
              </div>

              <div className={itemClasses}>
                <div className={itemheading}>Created At</div>
                {videoData?.createdAt && (
                  <div>{formatDate(videoData?.createdAt)}</div>
                )}
              </div>

              <div className={itemClasses}>
                <div className={itemheading}>Last Updated</div>
                {videoData?.updatedAt && (
                  <div>{formatDate(videoData?.updatedAt)}</div>
                )}
              </div>
            </div>

            <div className={itemClasses}>
              <div className={itemheading}>Description</div>
              <div>{videoData?.description}</div>
            </div>
          </div>
        </div>
      )}
    </CustomDrawer>
  );
}

export default VideoDetails;
