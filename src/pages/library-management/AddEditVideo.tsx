// Add or Edit video
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FaFileZipper as ZipIcon } from "react-icons/fa6";
import { RxCrossCircled as RemoveIcon } from "react-icons/rx";
import { motion } from "motion/react";
import useUploadFile from "@/hooks/use-uploadFile";
import { Upload } from "lucide-react";

import { replacePageName } from "@/store/features/generalSlice";
import { useAppDispatch } from "@/hooks/use-redux";
import {
  CustomInput,
  CustomSelectSeperate,
  CustomTextArea,
  CustomButton,
} from "@/components/common/Inputs";
import ImageUploader from "@/components/common/ImageUpload";
import {
  coursemoduleType,
  courseType,
  submoduleType,
  videoType,
} from "@/lib/interfaces-types";
import VideoUploader from "@/components/common/VideoUpload";
import {
  useAddVideoMutation,
  useUpdateVideoMutation,
} from "@/store/apis/library-apis";
import { showError, truncateString } from "@/lib/reusable-funs";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

function AddEditVideo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDuration, setVideoDuration] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [course, setCourse] = useState("");
  const [module, setModule] = useState("");
  const [submodule, setSubModule] = useState("");
  const [uploading, setUploading] = useState<boolean>(false);

  const {
    inputRef,
    uploading: uploadingAssignment,
    fileSrc,
    handleFileUpload,
    triggerFileUpload,
    setFileSrc,
  } = useUploadFile("assignments");

  const [
    addVideo,
    {
      isLoading: isAdding,
      isSuccess: additionSuccess,
      error: additionError,
      data: additionData,
    },
  ] = useAddVideoMutation();

  const [
    updateVideo,
    {
      isLoading: isUpdating,
      isSuccess: updationSuccess,
      error: updateError,
      data: updateData,
    },
  ] = useUpdateVideoMutation();

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { id: videoId } = useParams();

  const isEdit = location.state?.isEdit;
  const video = location.state?.video;

  const handleSubmit = async () => {
    const videodata: videoType = {
      title,
      description,
      thumbnailUrl,
      course,
      module,
      submodule,
      assignment: fileSrc,
    };

    const isEdit = location.state?.isEdit;
    if (!isEdit) {
      videodata.videoUrl = videoUrl;
      videodata.duration = videoDuration;
      await addVideo(videodata);
    } else {
      await updateVideo({
        video: videodata,
        id: video._id,
      });
    }
  };

  //   Create course menu
  const courses = location.state?.courses || [];
  const initalCourseMenu =
    courses?.map((course: courseType) => ({
      key: course.title,
      value: course._id,
    })) || [];
  const courseMenu = [{ key: "No course", value: null }, ...initalCourseMenu];

  //   Create module menu
  const targetCourse = courses?.find((c: courseType) => c._id === course);
  const moduleMenu =
    targetCourse?.modules?.map((module: coursemoduleType) => ({
      key: module.name,
      value: module._id,
    })) || [];

  //   Create submodule menu
  const targetModule = targetCourse?.modules?.find(
    (m: coursemoduleType) => m._id === module
  );
  const submoduleMenu =
    targetModule?.submodules?.map((module: submoduleType) => ({
      key: module.name,
      value: module._id,
    })) || [];

  // Handle errors
  useEffect(() => {
    if (additionError) {
      showError(additionError);
    }
  }, [additionError]);

  useEffect(() => {
    if (updateError) {
      showError(updateError);
    }
  }, [updateError]);

  // Handle success on addition or updation
  useEffect(() => {
    if (additionSuccess && additionData) {
      toast.success(additionData?.message);
      navigate("/library-management");
    }
  }, [additionSuccess]);

  useEffect(() => {
    if (updationSuccess && updateData) {
      toast.success(updateData?.message);
      navigate("/library-management");
    }
  }, [updationSuccess]);

  // Initialise data
  useEffect(() => {
    const title = isEdit ? "Edit Video" : "Add Video";
    dispatch(replacePageName(title));

    if (isEdit) {
      setTitle(video.title);
      setDescription(video.description);
      setThumbnailUrl(video.thumbnailUrl);
      setVideoUrl(video.videoUrl);
      setCourse(video.course);
      if (video.module) setModule(video.module);
      if (video.submodule) setSubModule(video.submodule);
      if (video.assignment) setFileSrc(video.assignment);
    } else if (videoId) {
      navigate("..");
    }
  }, [dispatch, isEdit, video]);

  return (
    <div className="main-container">
      <div className="input-container">
        <div className="label">Title</div>
        <div className="user-input">
          <CustomInput text={title} setText={setTitle} className="py-5" />
        </div>
      </div>

      <div className="input-container">
        <div className="label">Description</div>
        <div className="user-input">
          <CustomTextArea
            text={description}
            setText={setDescription}
            className="h-[8rem]"
          />
        </div>
      </div>

      <div className="input-container">
        <div className="label">Thumbnail</div>
        <div className="user-input ">
          <ImageUploader
            imageSrc={thumbnailUrl}
            setImageSrc={setThumbnailUrl}
            alt="Thumbnail"
          />
        </div>
      </div>

      <div className="input-container">
        <div className="label">Course</div>
        <div className="user-input">
          <CustomSelectSeperate
            menu={courseMenu}
            value={course}
            onChange={setCourse}
          />
        </div>
      </div>

      {moduleMenu?.length > 0 && (
        <div className="input-container">
          <div className="label">Tool</div>
          <div className="user-input">
            <CustomSelectSeperate
              menu={moduleMenu}
              value={module}
              onChange={setModule}
            />
          </div>
        </div>
      )}

      {submoduleMenu?.length > 0 && (
        <div className="input-container">
          <div className="label">Topic</div>
          <div className="user-input">
            <CustomSelectSeperate
              menu={submoduleMenu}
              value={submodule}
              onChange={setSubModule}
            />
          </div>
        </div>
      )}

      <div className="input-container">
        <div className="label">Video</div>
        <div className="user-input">
          <VideoUploader
            videoSrc={videoUrl}
            setVideoSrc={setVideoUrl}
            uploading={uploading}
            setUploading={setUploading}
            setVideoDuration={setVideoDuration}
          />
        </div>
      </div>
      <div className="input-container">
        <div className="label">Assignment</div>
        <div className="user-input">
          <input
            id="resourceInput"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            ref={inputRef}
            multiple
          />
          {fileSrc && (
            <div>
              <div className="flex items-center gap-2 border border-gray-400  rounded-md px-4 py-2 w-max">
                <ZipIcon size={16} />
                <div className="flex items-center gap-5 border  ">
                  <span> File -</span>
                  <span className="monospace">
                    {" "}
                    {truncateString(
                      fileSrc?.split("/").pop()?.split("-").pop() || "",
                      20
                    )}
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring" }}
                    className="!p-0 m-0 sm:ml-[2rem] "
                    onClick={() => {
                      setFileSrc("");
                    }}
                  >
                    <RemoveIcon
                      className="hover:text-[var(--softpurple)] transition-all"
                      size={20}
                    />
                  </motion.button>
                </div>
              </div>
            </div>
          )}
          {!fileSrc && (
            <label
              onClick={triggerFileUpload}
              className="flex items-center gap-2 px-5 py-2 bg-black backdrop-blur-md  text-white text-sm font-medium rounded-md cursor-pointer hover:bg-gray-900 transition w-[15rem] min-w-[10rem] "
            >
              {!uploadingAssignment ? (
                <>
                  <Upload size={16} />
                  <div className=" w-full flex ml-2 items-center">
                    No file choosen
                  </div>
                </>
              ) : (
                <div className=" w-full flex justify-center items-center">
                  <LoadingSpinner size={16} />
                </div>
              )}
            </label>
          )}

          <input type="file" className="hidden" />
        </div>
      </div>
      <CustomButton
        className="purple-button mt-2 lg:ml-[17.3rem]"
        handleClick={handleSubmit}
        disabled={isAdding || uploading || uploadingAssignment}
      >
        {isAdding || isUpdating ? <LoadingSpinner /> : "Save"}
      </CustomButton>
    </div>
  );
}

export default AddEditVideo;
