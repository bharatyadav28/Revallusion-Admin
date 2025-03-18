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
import { DeleteButton, UpdateButton } from "../common/Inputs";
import VideosList from "../common/VideosList";
import { ExpandButton } from "../common/Inputs";
import { dialogDataType } from "@/pages/course-management/EditCourse";
import DeleteDialog from "../common/DeleteDialog";
import { useDeleteSubmoduleMutation } from "@/store/apis/course-apis";
import toast from "react-hot-toast";

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
  const [selectedSubmodule, setSelectedSubmodule] = useState<string | null>(
    null
  );
  const [openDeleteDialgo, setOpenDeleteDialog] = useState(false);

  const [deleteSubmodule, { isLoading: isDeleting }] =
    useDeleteSubmoduleMutation();

  const handleDeleteDialog = () => {
    setOpenDeleteDialog((prev) => !prev);
  };

  const handleSubmoduleDelete = async () => {
    if (isDeleting) return;
    try {
      if (selectedSubmodule) {
        const response = await deleteSubmodule({
          courseId,
          submoduleId: selectedSubmodule,
        }).unwrap();

        handleDeleteDialog();
        setSelectedSubmodule(null);
        toast.success(response.message);
      }
    } catch (error) {
      const err = error as { data?: { message?: string } };
      const message = err.data?.message || "Something went wrong";
      toast.error(message);
    }
  };

  // Sort data by sequence
  const sortedData = [...data]?.sort((a, b) => a.sequence - b.sequence);

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
        <TableCell colSpan={2}>
          <Table className="custom-table bg-[#1f1f23]">
            <TableCaption>A list of Topics</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[6rem]">Topic name</TableHead>
                <TableHead className="min-w-[6rem]">Thumbnail Image</TableHead>
                <TableHead>
                  <div className="flex">
                    <span>Sequence</span>{" "}
                    <span className="opacity-0 mx-0 px-0">__</span>
                  </div>
                </TableHead>

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
                      <div className="relative h-[5.5rem] w-[5.5rem] hover:cursor-pointer group ">
                        <img
                          src={submodule.thumbnailUrl}
                          alt={submodule.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    </TableCell>

                    <TableCell className="font-medium">
                      <div className="w-min highlight-digit ">
                        {submodule?.sequence}
                      </div>
                    </TableCell>

                    {/* Action buttons */}
                    <TableCell className="font-medium">
                      <div className="flex gap-2 items-center w-min">
                        <ExpandButton
                          handleClick={() => {
                            if (showSubmoduleId === submodule._id) {
                              setShowSubmoduleId(null);
                              return;
                            }
                            if (submodule._id)
                              setShowSubmoduleId(submodule._id);
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

                        <DeleteButton
                          className="ml-0"
                          handleClick={() => {
                            handleDeleteDialog();
                            setSelectedSubmodule(submodule._id);
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
                      className="bg-[#34343a]"
                    />
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableCell>
      </motion.tr>

      {/* Delete dialog */}
      <DeleteDialog
        openDialog={openDeleteDialgo}
        handleOpenDialog={handleDeleteDialog}
        title="Delete Topic"
        description="Are you sure you want to delete this topic?"
        onCancel={() => {
          handleDeleteDialog();
          setSelectedSubmodule(null);
        }}
        onConfirm={handleSubmoduleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}

export default SubmoduleList;
