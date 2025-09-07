import { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddButton, ExpandButton } from "@/components/common/Inputs";
import {
  useGetCourseRecommendedVideosQuery,
  useAddRecommendedVideosMutation,
} from "@/store/apis/course-apis";
import { showError } from "@/lib/reusable-funs";

import CustomTooltip from "../../common/CustomTooltip";
import { videoType } from "@/lib/interfaces-types";
import SuggestedVideoMenu from "./RVideosMenu";
import SuggestedVideosList from "./RVideoList";
import toast from "react-hot-toast";

function SuggestedVideos({ courseId }: { courseId: string }) {
  const [openSheet, setOpenSheet] = useState(false);
  const [newelySelected, setNewelySelected] = useState<videoType[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOpenSheet = () => {
    setOpenSheet((prev) => !prev);
  };

  const {
    data,
    error: loadingError,
    isLoading,
  } = useGetCourseRecommendedVideosQuery(courseId);

  const [
    addVideos,
    {
      data: addVideosData,
      error: addError,
      isLoading: isAdding,
      isSuccess: addSuccess,
    },
  ] = useAddRecommendedVideosMutation();

  const handleVideoSelect = () => {
    if (newelySelected.length === 0) return;

    addVideos({
      videos: newelySelected?.map((video) => video._id || ""),
      courseId,
    });
  };

  // Show error
  useEffect(() => {
    if (loadingError) {
      showError(loadingError);
    }
  }, [loadingError]);

  useEffect(() => {
    if (addError) {
      showError(addError);
    }
  }, [addError]);

  // Handle success
  useEffect(() => {
    if (addSuccess) {
      toast.success(addVideosData.message);
      handleOpenSheet();
      setNewelySelected([]);
    }
  }, [addSuccess]);

  const videos = data?.data?.videos || [];

  const excludeVideos = videos?.map((item) => item?.video._id || "") || [];
  const alreadySelected = [...videos].map((item) => item.video);

  return (
    <>
      <div className="main-container mt-10">
        <Table className="custom-table">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[6rem]">Title</TableHead>

              <TableHead className="">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* {isLoading && <TableLoader colSpan={5} />} */}

            <TableRow>
              <TableCell>Recommended videos</TableCell>

              <TableCell>
                <div className="flex gap-2 items-center w-min">
                  <ExpandButton
                    handleClick={() => {
                      setIsExpanded((prev) => !prev);
                    }}
                  />

                  <CustomTooltip hoverContent="Add Videos">
                    <AddButton
                      className="!bg-[var(--golden)] !hover:bg-[var(--dark-golden)]"
                      handleClick={() => {
                        handleOpenSheet();
                      }}
                    />
                  </CustomTooltip>
                </div>
              </TableCell>
            </TableRow>

            {isExpanded && (
              <SuggestedVideosList
                data={videos}
                courseId={courseId}
                isLoading={isLoading}
              />
            )}
          </TableBody>
        </Table>
      </div>

      <SuggestedVideoMenu
        open={openSheet}
        handleOpen={handleOpenSheet}
        newelySelected={newelySelected}
        setNewelySelected={setNewelySelected}
        alreadySelected={alreadySelected}
        handleSubmit={handleVideoSelect}
        isSubmitting={isAdding}
        courseId={courseId}
        // remainingCapacity={
        //   allowedSectionVideos - (selectedSection?.videos?.length || 0)
        // }
        excludeVideos={excludeVideos}
      />
    </>
  );
}

export default SuggestedVideos;
