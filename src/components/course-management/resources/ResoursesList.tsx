import { useState, useEffect, useRef } from "react";
import { IoMdAdd as AddIcon } from "react-icons/io";
import { FaFileZipper as ZipIcon } from "react-icons/fa6";
import { RxCrossCircled as RemoveIcon } from "react-icons/rx";
import { motion } from "motion/react";
import toast from "react-hot-toast";

import {
  useAddResourceMutation,
  useDeleteResourceMutation,
  useGetResourcesQuery,
} from "@/store/apis/resources-apis";
import { CustomButton } from "@/components/common/Inputs";
import {
  UploadSpinner,
  LoadingSpinner,
} from "@/components/common/LoadingSpinner";
import DeleteDialog from "@/components/common/DeleteDialog";
import { showError } from "@/lib/reusable-funs";

interface Props {
  submodule: string;
}

function ResoursesList({ submodule }: Props) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [resourceId, setResourceId] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetching
  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetResourcesQuery(submodule, {
    skip: !submodule,
  });

  //   Adding
  const [
    addResource,
    {
      isLoading: isAdding,
      isSuccess: additionSuccess,
      error: additionError,
      data: additionData,
    },
  ] = useAddResourceMutation();

  //   Deleting
  const [
    deleteResource,
    {
      isLoading: isDeleting,
      isSuccess: deletionSuccess,
      error: deletionError,
      data: deletionData,
    },
  ] = useDeleteResourceMutation();

  const resources = data?.data?.resources;

  const handleDeleteDialog = () => {
    setOpenDeleteDialog((prev) => !prev);
  };

  // Handle file upload
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();
      Array.from(files as FileList).forEach((file) => {
        formData.append("file", file); // Adjust the field name based on your backend
      });

      await addResource({
        id: submodule,
        file: formData,
      });

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  //   Handles addition success
  useEffect(() => {
    if (additionData) {
      toast.success(additionData.message);
    }
  }, [additionSuccess]);

  // Handles deletion success
  useEffect(() => {
    if (deletionData) {
      toast.success(deletionData.message);
      handleDeleteDialog();
      setResourceId("");
    }
  }, [deletionSuccess]);

  //   Handles errors
  useEffect(() => {
    if (loadingError) {
      showError(loadingError);
    }
  }, [loadingError]);

  useEffect(() => {
    if (deletionError) {
      showError(deletionError);
    }
  }, [deletionError]);

  useEffect(() => {
    if (additionError) {
      showError(additionError);
    }
  }, [additionError]);

  return (
    <div className="main-container">
      <div className="input-container">
        <div className="label uppercase text-[1.1rem]">Resources</div>
        <div className="grow lg:max-w-[47rem]">
          {isLoading && (
            <div className=" ml-2 flex h-[8rem] items-center">
              {" "}
              <UploadSpinner />{" "}
            </div>
          )}
          {!isLoading && (
            <ul className="flex flex-col gap-2">
              {resources?.map((resource, index) => (
                <motion.li
                  key={resource._id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring" }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2 border border-gray-400  rounded-xl p-4 w-max">
                    <ZipIcon size={20} />
                    <div className="flex items-center gap-5 border  ">
                      <span> File {index + 1} -</span>
                      <span className="monospace">
                        {" "}
                        ...
                        {resource.url
                          .split("/")
                          .reverse()[0]
                          .padStart(20, ".")
                          .slice(-20)}
                      </span>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring" }}
                        className="!p-0 m-0 sm:ml-[3rem] "
                        onClick={() => {
                          if (resource._id) {
                            handleDeleteDialog();
                            setResourceId(resource._id);
                          }
                        }}
                      >
                        <RemoveIcon
                          className="hover:text-[var(--softpurple)] transition-all"
                          size={20}
                        />
                      </motion.button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <CustomButton
        className="green-button px-2 py-4 lg:ml-[17.3rem] min-w-[8rem]"
        handleClick={() => {
          if (isAdding) return;
          document.getElementById("resourceInput")?.click();
        }}
      >
        {isAdding ? (
          <LoadingSpinner />
        ) : (
          <>
            <AddIcon size={30} className="p-0 m-0 " /> Add Resource
          </>
        )}
      </CustomButton>

      {/* Hidden input to select files */}
      <input
        id="resourceInput"
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        ref={inputRef}
        multiple
      />

      {/* Delete assignment confirmation dialog */}
      <DeleteDialog
        openDialog={openDeleteDialog}
        handleOpenDialog={handleDeleteDialog}
        title="Delete Resource"
        description="Are you sure you want to delete this resource?"
        onCancel={() => {
          handleDeleteDialog();
          setResourceId("");
        }}
        onConfirm={() => {
          if (!resourceId || isDeleting) return;
          deleteResource({
            id: submodule,
            resourceId: resourceId,
          });
        }}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default ResoursesList;
