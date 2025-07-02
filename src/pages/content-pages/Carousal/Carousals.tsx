import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoMdAdd as AddIcon } from "react-icons/io";

import {
  useGetCarousalQuery,
  useAddCarousalMutation,
  useDeleteCarousalMutation,
} from "@/store/apis/content-mangement/carousal-apis";
import { showError } from "@/lib/reusable-funs";
import VideosList from "@/components/common/VideosList";
import { PageLoadingSpinner } from "@/components/common/LoadingSpinner";
import VideoMenu from "@/components/common/VideoMenu";
import { courseVideoType, videoType } from "@/lib/interfaces-types";
import { CustomButton } from "@/components/common/Inputs";
import EditCarousal from "@/components/carousal/EditCarousal";

function LatestTutorialsList() {
  // Fetch latest tutorials data
  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetCarousalQuery();

  // Add videos to tutorial
  const [
    addCarousal,
    {
      isLoading: isUpdating,
      isSuccess: updationSuccess,
      error: updateError,
      data: updateData,
    },
  ] = useAddCarousalMutation();

  // Delete video from tutorial
  const [
    deleteCarousal,
    {
      isLoading: isDeleting,
      isSuccess: deletionSuccess,
      error: deletionError,
      data: deletionData,
    },
  ] = useDeleteCarousalMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);

  // New selected videos
  const [newelySelected, setNewelySelected] = useState<videoType[]>([]);

  // Id of video to delete
  const [deleteVideoId, setDeleteVideoId] = useState<string | null>(null);

  // video data
  const [dialogData, setDialogData] = useState<{
    item: {
      sequence: number;
      videoId: string;
    };
  } | null>(null);

  // Allowed:
  const allowedCarousals = 10;

  // Handle edit video sequence dialog
  const handleOpenDialog = () => {
    setOpenDialog((prev) => !prev);
  };

  // Handle video menu dialog
  const handleOpenSheet = () => {
    setOpenSheet((prev) => !prev);
    setNewelySelected([]);
  };

  // Handle video addition
  const handleVideoSelect = () => {
    if (newelySelected.length === 0) return;

    addCarousal({
      videos: newelySelected?.map((video) => {
        return {
          videoId: video._id || "",
          sequence: -1,
        };
      }),
    });
    // setShowSectionId(null);
  };

  // Handle video deletion
  const handleVideoDelete = (videoId: string) => {
    if (isDeleting) return;

    setDeleteVideoId(videoId);
    deleteCarousal({
      videoId,
    });
  };

  // Handles loading error
  useEffect(() => {
    let error = loadingError || updateError || deletionError;
    if (error) {
      showError(error);
    }
  }, [loadingError, updateError, deletionError]);

  // Handles deletion error
  useEffect(() => {
    if (deletionData?.message) {
      toast.success(deletionData?.message);
    }
  }, [deletionSuccess]);

  // Handles updation success
  useEffect(() => {
    if (updateData?.message) {
      toast.success(updateData?.message);
      handleOpenSheet();
    }
  }, [updationSuccess]);

  // Handles deleting
  useEffect(() => {
    if (!isDeleting) {
      setDeleteVideoId(null);
    }
  }, [isDeleting]);

  const carousals = data?.data?.carousals;

  const videos: courseVideoType[] = [];
  const alreadySelected: courseVideoType[] = [];

  if (carousals) {
    for (let carousal of carousals) {
      if (carousal.sequence)
        videos.push({
          ...carousal.video,
          sequence: carousal.sequence,
          _id: carousal._id,
        });
      alreadySelected.push({
        ...carousal.video,
      });
    }
  }

  const excludeVideos =
    carousals?.map((carousal) => carousal.video._id || "") || [];

  return (
    <div className="main-container">
      <CustomButton
        className="green-button px-2 py-4"
        handleClick={() => {
          if (videos && videos?.length >= allowedCarousals) {
            toast.error(`You can't add more than ${allowedCarousals} videos`);
            return;
          }
          handleOpenSheet();
        }}
      >
        <AddIcon size={30} className="p-0 m-0" /> Add Videos
      </CustomButton>
      {/* Main table */}
      <VideosList
        data={videos}
        handleOpenDialog={handleOpenDialog}
        setDialogData={(data) => setDialogData(data)}
        handleDelete={handleVideoDelete}
        deletingItem={deleteVideoId}
        caption={` A list of carousal videos (${carousals?.length}/${allowedCarousals})`}
        hideDescription={true}
      />
      {/* Dialog box */}
      {openDialog && dialogData && (
        <EditCarousal
          open={openDialog}
          handleOpen={handleOpenDialog}
          video={dialogData?.item}
        />
      )}
      {carousals && (
        <VideoMenu
          open={openSheet}
          handleOpen={handleOpenSheet}
          newelySelected={newelySelected}
          setNewelySelected={setNewelySelected}
          alreadySelected={alreadySelected}
          handleSubmit={handleVideoSelect}
          isSubmitting={isUpdating}
          remainingCapacity={allowedCarousals - videos.length}
          excludeVideos={excludeVideos}
        />
      )}
      {isLoading && (
        <div>
          <PageLoadingSpinner />
        </div>
      )}
    </div>
  );
}

export default LatestTutorialsList;
