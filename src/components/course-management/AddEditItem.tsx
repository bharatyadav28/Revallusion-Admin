import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { CustomDialog } from "../common/CustomDialog";
import {
  CustomInput,
  CustomButton,
  CustomSelectSeperate,
} from "../common/Inputs";
import ImageUploader from "../common/ImageUpload";
import {
  useAddCourseModuleMutation,
  useAddSubmoduleMutation,
  useUpdateCourseModuleNameMutation,
  useUpdateSubmoduleMutation,
  useUpdateVideoSequenceMutation,
} from "@/store/apis/course-apis";
import { showError } from "@/lib/reusable-funs";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { courseItemType } from "@/lib/interfaces-types";

interface Props {
  type?: string;
  isEdit?: boolean;
  item: courseItemType | null;
  open: boolean;
  moduleList: {
    key: string;
    value: string;
  }[];
  handleOpen: () => void;
}
function AddEditItems({
  type,
  isEdit,
  item,
  open,
  moduleList,
  handleOpen,
}: Props) {
  const [name, setName] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [sequence, setSequence] = useState("0");
  // const [course, setCourse] = useState("");
  const [module, setModule] = useState("");
  // const [video, setVideo] = useState("");

  const [
    addModule,
    {
      isLoading: isAddingModule,
      isSuccess: moduleAdditionSuccess,
      error: moduleAdditionError,
      data: moduleAdditionData,
    },
  ] = useAddCourseModuleMutation();

  const [
    updateModule,
    {
      isLoading: isUpdatingModule,
      isSuccess: moduleUpdationSuccess,
      error: moduleUpdationError,
      data: moduleUpdationData,
    },
  ] = useUpdateCourseModuleNameMutation();

  const [
    addSubmodule,
    {
      isLoading: isAddingSubmodule,
      isSuccess: subModuleAdditionSuccess,
      error: subModuleAdditionError,
      data: subModuleAdditionData,
    },
  ] = useAddSubmoduleMutation();

  const [
    updateSubmodule,
    {
      isLoading: isUpdatingSubmodule,
      isSuccess: submoduleUpdationSuccess,
      error: submoduleUpdationError,
      data: submoduleUpdationData,
    },
  ] = useUpdateSubmoduleMutation();

  const [
    updateVideoSequence,
    {
      isLoading: isUpdatingVideoSequence,
      isSuccess: videoSequenceUpdationSuccess,
      error: videoSequenceUpdationError,
      data: videoSequenceUpdationData,
    },
  ] = useUpdateVideoSequenceMutation();

  useEffect(() => {
    const error =
      moduleAdditionError ||
      moduleUpdationError ||
      subModuleAdditionError ||
      submoduleUpdationError ||
      videoSequenceUpdationError;
    if (error) {
      showError(error);
    }
  }, [
    moduleAdditionError,
    moduleUpdationError,
    subModuleAdditionError,
    submoduleUpdationError,
    videoSequenceUpdationError,
  ]);

  // Handle success on addition or updation
  useEffect(() => {
    if (
      moduleAdditionSuccess ||
      moduleUpdationSuccess ||
      subModuleAdditionSuccess ||
      submoduleUpdationSuccess ||
      videoSequenceUpdationSuccess
    ) {
      const message =
        moduleAdditionData?.message ||
        moduleUpdationData?.message ||
        subModuleAdditionData?.message ||
        submoduleUpdationData?.message ||
        videoSequenceUpdationData?.message ||
        "Success";
      toast.success(message);
      handleOpen();
    }
  }, [
    moduleAdditionSuccess,
    moduleUpdationSuccess,
    subModuleAdditionSuccess,
    submoduleUpdationSuccess,
    videoSequenceUpdationSuccess,
  ]);

  useEffect(() => {
    if (isEdit && item) {
      const { name, thumbnailUrl, sequence, moduleId } = item;
      if (name) setName(name);
      if (thumbnailUrl) setThumbnailUrl(thumbnailUrl);
      if (sequence) setSequence(`${sequence}`);
      if (moduleId) setModule(moduleId);
    }
  }, [isEdit, item]);

  const moduleType = type === "module";
  const subModuleType = type === "submodule";
  const videoType = type === "video";
  const isFormSubmitting =
    isAddingModule ||
    isUpdatingModule ||
    isAddingSubmodule ||
    isUpdatingSubmodule ||
    isUpdatingVideoSequence;

  const handleFormSubmit = async () => {
    if (isFormSubmitting || !item) return;
    if (moduleType && item.courseId) {
      if (!isEdit) {
        addModule({
          name,
          courseId: item.courseId,
        });
      } else {
        updateModule({
          id: item?._id || "",
          name,
          courseId: item.courseId,
        });
      }
    }

    if (subModuleType && item?.courseId) {
      if (!isEdit) {
        addSubmodule({
          name,
          thumbnailUrl,
          courseId: item?.courseId,
          moduleId: module,
        });
      } else if (isEdit && item?._id && item.moduleId) {
        const moduleUpdated = item?.moduleId !== module;
        updateSubmodule({
          id: item?._id,
          name,
          thumbnailUrl,
          courseId: item?.courseId,
          moduleId: moduleUpdated ? item.moduleId : module,
          newModuleId: moduleUpdated ? module : "",
          sequence: Number(sequence),
        });
      }
    }

    if (videoType && item?._id && item?.courseId) {
      {
        updateVideoSequence({
          id: item?._id,
          sequence: Number(sequence),
          courseId: item?.courseId,
          moduleId: item?.moduleId,
          subModuleId: item?.submoduleId,
        });
      }
    }
  };

  return (
    <CustomDialog open={open} handleOpen={handleOpen} className="w-[35rem]">
      <div className="text-[1.5rem] font-medium h-max text-center">
        {" "}
        {isEdit ? "Edit" : "Add"} {type}
      </div>

      <div className="main-container !bg-[#000111] !py-8">
        {(moduleType || subModuleType) && (
          <div className="flex flex-col gap-2">
            <div className="label">Name</div>
            <div className="user-input">
              <CustomInput
                text={name}
                setText={setName}
                className="py-5"
                placeholder="Type name here..."
              />
            </div>
          </div>
        )}

        {subModuleType && (
          <div className="flex flex-col gap-2">
            <div className="label mb-1">Thumbnail</div>
            <div className="user-input ">
              <ImageUploader
                imageSrc={thumbnailUrl}
                setImageSrc={setThumbnailUrl}
                alt="Thumbnail"
                className="w-[8rem] h-[8rem]"
              />
            </div>
          </div>
        )}

        {subModuleType && (
          <div className="flex flex-col gap-2">
            <div className="label">Module</div>
            <div className="user-input">
              <CustomSelectSeperate
                menu={moduleList}
                value={module}
                onChange={setModule}
              />
            </div>
          </div>
        )}

        {(subModuleType || videoType) && isEdit && (
          <div className="flex flex-col gap-2">
            <div className="label">Sequence</div>
            <div className="user-input">
              <CustomInput
                text={sequence}
                setText={setSequence}
                className="py-5"
                placeholder="Type name here..."
                type="number"
              />
            </div>
          </div>
        )}

        <CustomButton
          className="green-button mt-2"
          handleClick={handleFormSubmit}
        >
          {isFormSubmitting ? <LoadingSpinner /> : isEdit ? "Update" : "Add"}
        </CustomButton>
      </div>
    </CustomDialog>
  );
}

export default AddEditItems;
