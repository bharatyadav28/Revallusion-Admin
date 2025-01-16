import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdAdd as AddIcon } from "react-icons/io";
import toast from "react-hot-toast";

import { videoType } from "@/lib/interfaces-types";
import {
  useDeleteVideoMutation,
  useGetVideosQuery,
} from "@/store/apis/library-apis";
import { showError } from "@/lib/reusable-funs";
import { PageLoadingSpinner } from "@/components/common/LoadingSpinner";
import {
  CustomButton,
  DeleteButton,
  UpdateButton,
  ViewButton,
} from "@/components/common/Inputs";
import VideoDetails from "@/components/VideoDetails";
import DeleteDialog from "@/components/common/DeleteDialog";

function VideoList() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDeleteDialgo, setOpenDeleteDialog] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<videoType | null>();
  const navigate = useNavigate();

  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetVideosQuery();

  const [
    deleteVideo,
    {
      isLoading: isDeleting,
      isSuccess: deletionSuccess,
      error: deletionError,
      data: deletionData,
    },
  ] = useDeleteVideoMutation();

  const videos = data?.data?.videos || [];
  const courses = data?.data?.courses || [];

  const handleEditVideo = (id: string, video: videoType) => {
    navigate(`${id}`, { state: { isEdit: true, video, courses } });
  };

  // Video details drawer
  const handleDrawer = (videoId?: string) => {
    setOpenDrawer((prev) => !prev);
    const requiredVideo = videos?.find((video) => video._id === videoId);

    // Convert (course, module, subModule) ids to corrsponding names
    const requiredCourse = courses?.find(
      (course) => course._id === requiredVideo?.course
    );
    const requiredModule = requiredCourse?.modules?.find(
      (module) => module._id === requiredVideo?.module
    );
    const requestedSubModule = requiredModule?.subModules?.find(
      (subModule) => subModule._id === requiredVideo?.subModule
    );

    const courseName = requiredCourse?.title || "";
    const moduleName = requiredModule?.name;
    const subModuleName = requestedSubModule?.name;

    if (requiredVideo) {
      const selectedVideoData: videoType = {
        ...requiredVideo,
        title: requiredVideo?.title || "",
        course: courseName,
        module: moduleName,
        subModule: subModuleName,
      };

      setSelectedVideo(selectedVideoData);
    }
  };

  // Open/close delete dialog
  const handleDeleteDialog = () => {
    setOpenDeleteDialog((prev) => !prev);
    setSelectedVideo(null);
  };

  // Delete Video on confirmation
  const handleDeleteVideo = async () => {
    if (!selectedVideo || isDeleting) return;

    await deleteVideo(selectedVideo?._id || "");
    handleDeleteDialog();
  };

  // Handle errors
  useEffect(() => {
    if (loadingError) {
      showError(loadingError);
    }
    if (deletionError) {
      showError(deletionError);
    }
  }, [loadingError, deletionError]);

  // Handle success on deletion
  useEffect(() => {
    if (deletionSuccess && deletionData) {
      toast.success(deletionData?.message);
      navigate("/library-management");
    }
  }, [deletionSuccess]);

  return (
    <div>
      <CustomButton
        className="green-button px-2 py-4 mt-5 mb-5"
        handleClick={() => {
          navigate("add", { state: { isEdit: false, courses } });
        }}
      >
        <AddIcon size={30} className="p-0 m-0 " /> Add Video
      </CustomButton>

      <div className="grid xl:grid-cols-6 lg:grid-cols-4 grid-cols-3  gap-8 bg-opacity-10">
        {videos.map((video: videoType) => {
          return (
            <div
              key={video._id}
              className="relative md:h-[9rem] h-[6rem] hover:cursor-pointer group "
            >
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover rounded-md"
              />

              {/* Image hover content */}
              <div className="absolute inset-0 bg-black bg-opacity-20 rounded-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 ">
                <ViewButton
                  className="border-none"
                  handleClick={() => handleDrawer(video?._id)}
                />
                <UpdateButton
                  className="border-none"
                  handleClick={() => handleEditVideo(video?._id || "", video)}
                />
                <DeleteButton
                  className="ml-0"
                  handleClick={() => {
                    setOpenDeleteDialog((prev) => !prev);
                    setSelectedVideo(video);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <VideoDetails
        open={openDrawer}
        handleOpen={handleDrawer}
        videoData={selectedVideo || null}
      />

      <DeleteDialog
        openDialog={openDeleteDialgo}
        handleOpenDialog={handleDeleteDialog}
        title="Delete Video"
        description="Are you sure you want to delete this video?"
        onCancel={handleDeleteDialog}
        onConfirm={handleDeleteVideo}
        isDeleting={isDeleting}
      />

      {isLoading && (
        <div>
          <PageLoadingSpinner />
        </div>
      )}
    </div>
  );
}

export default VideoList;