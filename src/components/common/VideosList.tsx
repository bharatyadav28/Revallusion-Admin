// Video table  with video sequnce updation
import { motion } from "framer-motion";

import {
  Table,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table";
import { courseVideoType } from "@/lib/interfaces-types";
import { DeleteButton, UpdateButton } from "./Inputs";
import VideoStatusButton from "../course-management/VideoStatusButton";

interface Props {
  data: courseVideoType[];
  isSubTable?: boolean;
  handleOpenDialog: () => void;
  setDialogData: (data: any) => void;
  courseId?: string;
  moduleId?: string;
  submoduleId?: string;
  handleDelete?: (videoId: string) => void;
  deletingItem?: string | null;
  caption?: string;
}
function VideosList({
  data,
  isSubTable,
  handleOpenDialog,
  setDialogData,
  courseId,
  moduleId,
  submoduleId,
  handleDelete,
  deletingItem,
  caption,
}: Props) {
  // Sort data by sequence
  const sortedData = [...data]?.sort((a, b) => a.sequence - b.sequence);

  const MainTable = (
    <Table className="custom-table bg-[#34343a] w-full">
      <TableCaption>{caption || `A list of videos`}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[6rem]">Video name</TableHead>
          <TableHead className="min-w-[6rem]">Video Description</TableHead>
          <TableHead>Sequence</TableHead>
          {courseId && <TableHead>Status</TableHead>}
          <TableHead className="">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {sortedData?.map((video) => (
          <TableRow className="!hover:bg-blue-500 dfdf  s" key={video?._id}>
            <TableCell className="font-medium">{video?.title}</TableCell>
            <TableCell className="font-medium">{video?.description}</TableCell>
            <TableCell className="font-medium">
              {video?.sequence > 0 ? video?.sequence : "NA"}
            </TableCell>

            {courseId && (
              <TableCell>
                {video?._id && courseId && (
                  <VideoStatusButton
                    videoId={video?._id}
                    sequence={video?.sequence}
                    courseId={courseId}
                  />
                )}
              </TableCell>
            )}

            {/* Action buttons */}
            <TableCell className="font-medium">
              <div className="flex gap-0 items-center">
                <UpdateButton
                  handleClick={() => {
                    handleOpenDialog();
                    if (courseId)
                      setDialogData({
                        type: "video",
                        isEdit: true,
                        item: {
                          _id: video?._id,
                          courseId,
                          moduleId,
                          submoduleId,
                          sequence: video?.sequence,
                        },
                      });

                    if (!courseId)
                      setDialogData({
                        item: {
                          videoId: video?._id,
                          sequence: video?.sequence,
                        },
                      });
                  }}
                />

                {handleDelete && (
                  <DeleteButton
                    handleClick={() => {
                      const videoId = video?._id;
                      if (videoId) handleDelete(videoId);
                    }}
                    isDeleting={deletingItem === video?._id}
                  />
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // Is subtable
  const MainContent = !isSubTable ? (
    MainTable
  ) : (
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
      <TableCell colSpan={5}>{MainTable}</TableCell>
    </motion.tr>
  );

  return <>{MainContent}</>;
}

export default VideosList;
