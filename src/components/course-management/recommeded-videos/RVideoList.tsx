import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CustomButton,
  DeleteButton,
  UpdateButton,
} from "@/components/common/Inputs";

import { RecommendedVideoType } from "@/lib/interfaces-types";
import DeleteDialog from "@/components/common/DeleteDialog";
import { showError } from "@/lib/reusable-funs";
import {
  useDeleteRecommendedVideoMutation,
  useUpdateRecommendedVideoStatusMutation,
} from "@/store/apis/course-apis";
import UpdateSequence from "./RUpdateSequence";
import {
  LoadingSpinner,
  TableLoader,
} from "@/components/common/LoadingSpinner";

interface Props {
  data: RecommendedVideoType[];
  courseId: string;
  isLoading: boolean;
}
function SuggestedVideoList({ data, courseId, isLoading }: Props) {
  const [openDeleteDialgo, setOpenDeleteDialog] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [selectedDocSequence, setSelectedDocSequence] = useState<number>(0);
  const [updateSequenceOpen, setUpdateSequenceOpen] = useState(false);

  const [
    removeVideo,
    {
      isLoading: isDeleting,
      isSuccess: deletionSuccess,
      data: deletionData,
      error: deletionError,
    },
  ] = useDeleteRecommendedVideoMutation();

  // Open/close delete dialog
  const handleDeleteDialog = () => {
    setOpenDeleteDialog((prev) => !prev);
  };

  const handleUpdateOpen = () => {
    setUpdateSequenceOpen((prev) => !prev);
  };

  const [
    updateVideoStatus,
    {
      isLoading: isUpdatingStatus,
      isSuccess: statusUpdationSuccess,
      error: statusUpdationError,
      data: statusUpdationData,
    },
  ] = useUpdateRecommendedVideoStatusMutation();

  // Handle video status changes
  const handleStatusUpdate = (docId: string, isActive: boolean) => {
    if (docId) {
      updateVideoStatus({
        id: docId,
        isActive: isActive ? false : true,
        courseId,
      });
    }
  };

  // Handle status update success
  useEffect(() => {
    if (statusUpdationSuccess) {
      toast.success(statusUpdationData.message);
      setSelectedDocId(null);
      setSelectedDocSequence(0);
    }
  }, [statusUpdationSuccess]);

  // Handle errors
  useEffect(() => {
    if (statusUpdationError) {
      showError(statusUpdationError);
    }
  }, [statusUpdationError]);

  // Handle success
  useEffect(() => {
    if (deletionSuccess) {
      toast.success(deletionData.message);
      handleDeleteDialog();
      setSelectedDocId(null);
    }
  }, [deletionSuccess]);

  // Handle error
  useEffect(() => {
    if (deletionError) {
      showError(deletionError);
    }
  }, [deletionError]);

  return (
    <>
      <motion.tr
        initial={{ opacity: 0.5, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{
          opacity: 0,
          y: 0,
          transition: { duration: 0.2 },
        }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <TableCell colSpan={4}>
          <Table className="custom-table bg-[#34343a]">
            <TableCaption>A list of Recommended Videos</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[6rem]">Video name</TableHead>
                <TableHead className="min-w-[6rem]">
                  Video description
                </TableHead>
                <TableHead>Sequence</TableHead>
                <TableHead>Status</TableHead>

                <TableHead className="">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && <TableLoader colSpan={5} />}
              {!isLoading &&
                data?.map((doc) => (
                  <TableRow key={doc._id}>
                    <TableCell>{doc?.video?.title}</TableCell>
                    <TableCell>{doc?.video?.description}</TableCell>
                    <TableCell>
                      {" "}
                      <span className="highlight-digit">{doc?.sequence}</span>
                    </TableCell>

                    <TableCell>
                      <CustomButton
                        className={` w-[5rem] ${
                          doc?.isActive ? "green-button" : "red-button"
                        }`}
                        disabled={isUpdatingStatus}
                        handleClick={() => {
                          setSelectedDocId(doc?._id);
                          handleStatusUpdate(doc?._id, doc?.isActive);
                        }}
                      >
                        {isUpdatingStatus && doc?._id === selectedDocId ? (
                          <LoadingSpinner />
                        ) : doc?.isActive ? (
                          "Active"
                        ) : (
                          "Inactive"
                        )}
                      </CustomButton>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UpdateButton
                          handleClick={() => {
                            handleUpdateOpen();
                            if (doc?._id) {
                              setSelectedDocId(doc._id);
                              setSelectedDocSequence(doc?.sequence || 0);
                            }
                          }}
                        />
                        <DeleteButton
                          className="ml-0"
                          handleClick={() => {
                            handleDeleteDialog();
                            if (doc?._id) setSelectedDocId(doc._id);
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableCell>
      </motion.tr>

      <DeleteDialog
        openDialog={openDeleteDialgo}
        handleOpenDialog={handleDeleteDialog}
        title="Remove Video"
        description="Are you sure you want to remove this video?"
        onCancel={() => {
          handleDeleteDialog();
          setSelectedDocId(null);
        }}
        onConfirm={() => {
          if (selectedDocId) {
            removeVideo({ id: selectedDocId, courseId });
          }
        }}
        isDeleting={isDeleting}
      />

      <UpdateSequence
        open={updateSequenceOpen}
        handleOpen={handleUpdateOpen}
        id={selectedDocId || ""}
        sequence={Number(selectedDocSequence) || 0}
        courseId={courseId}
      />
    </>
  );
}

export default SuggestedVideoList;
