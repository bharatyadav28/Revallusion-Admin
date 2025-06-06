import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdAdd as AddIcon } from "react-icons/io";
import toast from "react-hot-toast";
import { motion } from "motion/react";

import {
  dateSortVideos,
  videoDurationType,
  videoType,
} from "@/lib/interfaces-types";
import {
  useDeleteVideoMutation,
  useGetVideosQuery,
} from "@/store/apis/library-apis";
import {
  convertToDate,
  isToday,
  isYesterday,
  showError,
} from "@/lib/reusable-funs";
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

  // const videos = data?.data?.videos || [];

  // Map videos according to their creation date
  const videosData = data?.data?.videos.reduce((acc: dateSortVideos, video) => {
    const createdAt = video.createdAt;
    const dateString = convertToDate(createdAt, "long");

    if (dateString) {
      if (!acc[dateString]) {
        acc[dateString] = [];
      }
      acc[dateString].push(video);
    }

    return acc;
  }, {} as dateSortVideos);
  const courses = data?.data?.courses || [];

  const handleEditVideo = (id: string, video: videoType) => {
    navigate(`${id}`, { state: { isEdit: true, video, courses } });
  };

  // Video details drawer
  const handleDrawer = (video?: videoType) => {
    setOpenDrawer((prev) => !prev);
    const requiredVideo = video;

    // Convert (course, module, submodule) ids to corrsponding names
    const requiredCourse = courses?.find(
      (course) => course._id === requiredVideo?.course
    );
    const requiredModule = requiredCourse?.modules?.find(
      (module) => module._id === requiredVideo?.module
    );
    const requestedSubModule = requiredModule?.submodules?.find(
      (submodule) => submodule._id === requiredVideo?.submodule
    );

    const courseName = requiredCourse?.title || "";
    const moduleName = requiredModule?.name;
    const submoduleName = requestedSubModule?.name;

    if (requiredVideo) {
      const selectedVideoData: videoType = {
        ...requiredVideo,
        title: requiredVideo?.title || "",
        course: courseName,
        module: moduleName,
        submodule: submoduleName,
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

  // Date string to display on pahe
  const getVideoDate = (value: string) => {
    if (videosData) {
      const dString = videosData[value][0].createdAt;
      const today = dString ? isToday(dString) : false;
      if (today) return "Today";

      const yesterDay = dString ? isYesterday(dString) : false;
      if (yesterDay) return "Yesterday";
    }
    return value;
  };

  const convertDuration = (duration: videoDurationType) => {
    const { hours, minutes, seconds } = duration;
    return `${(hours | 0).toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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

      <div>
        {/* Unique dates */}
        {videosData &&
          Object.keys(videosData)
            .reverse()
            .map((item, index) => {
              return (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.2,
                  }}
                  key={item}
                >
                  <div className="text-sm mb-2">{getVideoDate(item)}</div>
                  <div className="grid xl:grid-cols-6 lg:grid-cols-4 grid-cols-3  md:gap-8 gap-4 bg-opacity-10">
                    {/* Videos map to each date */}
                    {videosData[item]?.map((video: videoType) => {
                      return (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring" }}
                          key={video._id}
                          className="relative md:h-[9rem] h-[6rem] hover:cursor-pointer group  "
                        >
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover rounded-md"
                          />

                          {video.duration && (
                            <div className="absolute bottom-1.5 right-1.5 bg-black bg-opacity-70 text-white text-xs md:text-sm px-2 py-1 rounded-md shadow-lg flex items-center">
                              <span>{convertDuration(video.duration)}</span>
                            </div>
                          )}

                          {/* Image hover content */}
                          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 ">
                            <ViewButton
                              className="border-none "
                              handleClick={() => handleDrawer(video)}
                            />

                            <UpdateButton
                              className="border-none"
                              handleClick={() =>
                                handleEditVideo(video?._id || "", video)
                              }
                            />
                            <DeleteButton
                              className="ml-0"
                              handleClick={() => {
                                setOpenDeleteDialog((prev) => !prev);
                                setSelectedVideo(video);
                              }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <br />
                </motion.div>
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
