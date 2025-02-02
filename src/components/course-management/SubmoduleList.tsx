import React, { useState } from "react";
import { motion } from "framer-motion";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { submoduleType } from "@/lib/interfaces-types";
import { UpdateButton } from "../common/Inputs";
import VideosList from "../common/VideosList";
import { ExpandButton } from "../common/Inputs";
import { dialogDataType } from "@/pages/course-management/EditCourse";

interface Props {
  data: submoduleType[];
  handleOpenDialog: () => void;
  setDialogData: (data: dialogDataType) => void;
  moduleId: string;
  courseId: string;
}

function SubmoduleList({
  data,
  handleOpenDialog,
  setDialogData,
  moduleId,
  courseId,
}: Props) {
  // Expand submodule id
  const [showSubmoduleId, setShowSubmoduleId] = useState<string | null>(null);

  // Sort data by sequence
  const sortedData = [...data]?.sort((a, b) => a.sequence - b.sequence);

  return (
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
      <TableCell colSpan={2}>
        <Table className="custom-table bg-[#1f1f23]">
          <TableCaption>A list of submodules</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[6rem]">Submodule name</TableHead>
              <TableHead className="min-w-[6rem]">Thumbnail Image</TableHead>
              <TableHead>Sequence</TableHead>
              <TableHead className="">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedData?.map((submodule) => (
              <React.Fragment key={submodule._id}>
                <TableRow>
                  <TableCell className="font-medium">
                    {submodule?.name}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="relative h-[5rem] w-[5rem] hover:cursor-pointer group ">
                      <img
                        src={submodule.thumbnailUrl}
                        alt={submodule.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {submodule?.sequence}
                  </TableCell>

                  {/* Action buttons */}
                  <TableCell className="font-medium">
                    <div className="flex gap-2 items-center">
                      <ExpandButton
                        handleClick={() => {
                          if (showSubmoduleId === submodule._id) {
                            setShowSubmoduleId(null);
                            return;
                          }
                          if (submodule._id) setShowSubmoduleId(submodule._id);
                        }}
                        isExpanded={showSubmoduleId === submodule._id}
                      />
                      <UpdateButton
                        handleClick={() => {
                          handleOpenDialog();
                          setDialogData({
                            type: "submodule",
                            isEdit: true,
                            item: { ...submodule, moduleId, courseId },
                          });
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>

                {/* Videos list table */}
                {showSubmoduleId === submodule._id && submodule.videos && (
                  <VideosList
                    data={submodule?.videos}
                    isSubTable={true}
                    handleOpenDialog={handleOpenDialog}
                    setDialogData={setDialogData}
                    courseId={courseId}
                    moduleId={moduleId}
                    submoduleId={submodule._id}
                  />
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableCell>
    </motion.tr>
  );
}

export default SubmoduleList;
