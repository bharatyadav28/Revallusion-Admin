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
import { DeleteButton } from "../common/Inputs";

import { videoType } from "@/lib/interfaces-types";
import DeleteDialog from "../common/DeleteDialog";
import { useRemoveVideoFromSectionMutation } from "@/store/apis/primary-dashboard-apis";
import { showError } from "@/lib/reusable-funs";

interface Props {
  data: videoType[];
  allowedVideos: number;
  sectionId: string;
}
function SectionVideos({ data, allowedVideos, sectionId }: Props) {
  const [openDeleteDialgo, setOpenDeleteDialog] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  // Remove video from section
  const [
    removeVideo,
    {
      isLoading: isDeleting,
      isSuccess: deletionSuccess,
      data: deletionData,
      error: deletionError,
    },
  ] = useRemoveVideoFromSectionMutation();

  // Open/close delete dialog
  const handleDeleteDialog = () => {
    setOpenDeleteDialog((prev) => !prev);
  };

  // Handle success
  useEffect(() => {
    if (deletionSuccess) {
      toast.success(deletionData.message);
      handleDeleteDialog();
      setSelectedVideoId(null);
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
            <TableCaption>
              A list of Videos({data?.length}/{allowedVideos})
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[6rem]">Video name</TableHead>
                <TableHead className="min-w-[6rem]">
                  Video description
                </TableHead>

                <TableHead className="">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.map((video: videoType) => (
                <TableRow key={video._id}>
                  <TableCell>{video.title}</TableCell>
                  <TableCell>{video.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DeleteButton
                        className="ml-0"
                        handleClick={() => {
                          handleDeleteDialog();
                          if (video?._id) setSelectedVideoId(video._id);
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
          setSelectedVideoId(null);
        }}
        onConfirm={() => {
          if (selectedVideoId) {
            removeVideo({ videoId: selectedVideoId, sectionId });
          }
        }}
        isDeleting={isDeleting}
      />
    </>
  );
}

export default SectionVideos;
