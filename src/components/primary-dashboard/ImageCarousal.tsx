import { useEffect, useRef, useState } from "react";
import { IoMdAdd as AddIcon } from "react-icons/io";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomButton, DeleteButton } from "@/components/common/Inputs";
import { UpdateButton } from "@/components/common/Inputs";
import { showError } from "@/lib/reusable-funs";

import {
  useAddCarousalMutation,
  useGetCarousalQuery,
  useDeleteCarousalItemMutation,
} from "@/store/apis/primary-dashboard-apis";
import DeleteDialog from "../common/DeleteDialog";
import toast from "react-hot-toast";
import { LoadingSpinner, TableLoader } from "../common/LoadingSpinner";
import EditSequence from "./EditSequence";

const ImageCarousal = () => {
  const [openDeleteDialgo, setOpenDeleteDialog] = useState(false);
  const [openEditDialgo, setOpenEditDialog] = useState(false);

  const [selectedCarousal, setSelectedCarousal] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch Images
  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetCarousalQuery();

  // Add image
  const [
    addImage,
    {
      isLoading: isAdding,
      isSuccess: additionSuccess,
      error: additionError,
      data: additionData,
    },
  ] = useAddCarousalMutation();

  // Delete image
  const [
    deleteImage,
    {
      isLoading: isDeleting,
      isSuccess: deletionSuccess,
      error: deletionError,
      data: deletionData,
    },
  ] = useDeleteCarousalItemMutation();

  // Open/close delete dialog
  const handleDeleteDialog = () => {
    setOpenDeleteDialog((prev) => !prev);
  };

  const handleDeleteImage = () => {
    if (selectedCarousal?._id) deleteImage(selectedCarousal?._id);
  };

  const handleEditDialog = () => {
    setOpenEditDialog((prev) => !prev);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);

      try {
        // Prepare FormData
        const formData = new FormData();
        formData.append("file", file);

        // Upload to backend
        const response = await fetch("/api/v1/admin/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();
        if (data?.data?.imageUrl) {
          const imageUrl = data?.data?.imageUrl;
          await addImage({ imageUrl });
        } else {
          alert("Image upload failed. No URL returned.");
        }
      } catch (error) {
        toast.error("Image upload failed");
      } finally {
        setUploading(false);
      }
    }
  };

  // Show error
  useEffect(() => {
    if (loadingError) {
      showError(loadingError);
    }
  }, [loadingError]);

  useEffect(() => {
    if (additionError) {
      showError(additionError);
    }
  }, [additionError]);

  useEffect(() => {
    if (deletionError) {
      showError(deletionError);
    }
  }, [deletionError]);

  // Handle success
  useEffect(() => {
    if (deletionSuccess && deletionData) {
      handleDeleteDialog();
      toast.success(deletionData?.message);
      setSelectedCarousal(null);
    }
  }, [deletionSuccess]);

  useEffect(() => {
    if (additionSuccess) {
      toast.success(additionData?.message);
    }
  }, [additionSuccess]);

  const carousal = data?.data?.carousal || [];

  return (
    <div className="main-container">
      <CustomButton
        className="green-button px-2 py-4 min-w-[8rem]"
        handleClick={() => {
          if (uploading || isAdding) return;
          inputRef.current?.click();
        }}
      >
        {uploading || isAdding ? (
          <LoadingSpinner />
        ) : (
          <>
            <AddIcon size={30} className="p-0 m-0" /> Add Image{" "}
          </>
        )}
      </CustomButton>
      <Table className="custom-table">
        <TableCaption>A list of images</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">S.no.</TableHead>
            <TableHead className="min-w-[6rem]">Image</TableHead>
            {/* <TableHead>Created at</TableHead> */}
            <TableHead className="">Sequence</TableHead>
            <TableHead className="">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && <TableLoader colSpan={5} />}
          {!isLoading &&
            carousal?.map((item, index) => {
              return (
                <TableRow>
                  <TableCell>Image {index + 1}</TableCell>
                  <TableCell className="font-medium">
                    <div className="relative h-[5.5rem] w-[5.5rem] hover:cursor-pointer group ">
                      <img
                        src={item.image}
                        alt={`image ${index}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  </TableCell>
                  {/* <TableCell>{formatDate(item?.createdAt || "")}</TableCell> */}
                  <TableCell className="font-medium">
                    {item?.sequence}
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      <UpdateButton
                        handleClick={() => {
                          handleEditDialog();
                          setSelectedCarousal(item);
                        }}
                      />
                      <DeleteButton
                        handleClick={() => {
                          if (isDeleting) return;
                          handleDeleteDialog();
                          setSelectedCarousal(item);
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      {/* 
  {isLoading && (
    <div>
      <PageLoadingSpinner />
    </div>
  )} */}
      <input
        id="imageInput"
        type="file"
        className="hidden"
        onChange={handleImageUpload}
        ref={inputRef}
        multiple
      />

      <EditSequence
        open={openEditDialgo}
        handleOpen={handleEditDialog}
        item={selectedCarousal}
      />

      <DeleteDialog
        openDialog={openDeleteDialgo}
        handleOpenDialog={handleDeleteDialog}
        title="Delete Image"
        description="Are you sure you want to delete this image?"
        onCancel={() => {
          handleDeleteDialog();
          setSelectedCarousal(null);
        }}
        onConfirm={handleDeleteImage}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ImageCarousal;
