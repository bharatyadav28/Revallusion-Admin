import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoMdAdd as AddIcon } from "react-icons/io";
import { AnimatePresence } from "framer-motion";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCourseQuery } from "@/store/apis/course-apis";
import { showError } from "@/lib/reusable-funs";
import { useAppDispatch } from "@/hooks/use-redux";
import { replacePageName } from "@/store/features/generalSlice";
import { ExpandButton, UpdateButton } from "@/components/common/Inputs";
import SubmoduleList from "@/components/course-management/SubmoduleList";
import { PageLoadingSpinner } from "@/components/common/LoadingSpinner";
import VideosList from "@/components/common/VideosList";
import { CustomButton } from "@/components/common/Inputs";
import AddEditItems from "@/components/course-management/AddEditItem";
import { courseItemType } from "@/lib/interfaces-types";

export interface dialogDataType {
  type: string;
  isEdit: boolean;
  item: courseItemType | null;
}
function EditCourse() {
  // Expand module id
  const [showModuleId, setShowModuleId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState<dialogDataType>({
    type: "module",
    isEdit: false,
    item: null,
  });

  const { id: courseId } = useParams();
  const dispatch = useAppDispatch();

  // Fetch course data
  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetCourseQuery(courseId ?? "", {
    skip: !courseId, // Skip the query if courseId is undefined
  });

  const handleOpenDialog = () => {
    setOpenDialog((prev) => !prev);
  };

  // Show error
  useEffect(() => {
    if (loadingError) {
      showError(loadingError);
    }
  }, [loadingError]);

  // Page title
  useEffect(() => {
    dispatch(replacePageName("Edit Course"));
  }, []);

  const course = data?.data?.course;
  const modules = course?.modules;

  // Menu for module combobox
  const moduleList = course?.modules?.map((module) => {
    return {
      key: module.name,
      value: module._id,
    };
  });

  return (
    <>
      {/* Paid course */}
      {!course?.isFree && (
        <div className="main-container">
          {/* Add Buttons */}
          <div className="flex gap-2">
            <CustomButton
              className="green-button px-2 py-4"
              handleClick={() => {
                handleOpenDialog();

                if (course) {
                  setDialogData({
                    type: "module",
                    isEdit: false,
                    item: { courseId: course?._id },
                  });
                }
              }}
            >
              <AddIcon size={30} className="p-0 m-0" /> Add Tool
            </CustomButton>

            <CustomButton
              className="green-button px-2 py-4"
              handleClick={() => {
                handleOpenDialog();
                if (course) {
                  setDialogData({
                    type: "submodule",
                    isEdit: false,
                    item: { courseId: course?._id },
                  });
                }
              }}
            >
              <AddIcon size={30} className="p-0 m-0" /> Add Topic
            </CustomButton>
          </div>

          {/* Main table */}
          <Table className="custom-table">
            <TableCaption>A list of {course?.title} modules</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[6rem]">Tool name</TableHead>
                <TableHead className="">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {modules?.map((module) => (
                <React.Fragment key={module._id}>
                  <TableRow>
                    <TableCell className="font-medium">
                      {module?.name}
                    </TableCell>

                    {/* Action buttons */}
                    <TableCell className="font-medium">
                      <div className="flex gap-2 items-center">
                        <ExpandButton
                          handleClick={() => {
                            if (showModuleId === module._id) {
                              setShowModuleId(null);
                              return;
                            }
                            setShowModuleId(module._id);
                          }}
                          isExpanded={showModuleId === module._id}
                        />
                        <UpdateButton
                          handleClick={() => {
                            handleOpenDialog();
                            if (course) {
                              setDialogData({
                                type: "module",
                                isEdit: true,
                                item: { ...module, courseId: course?._id },
                              });
                            }
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Submodules table */}
                  <AnimatePresence>
                    {showModuleId === module._id && course?._id && (
                      <SubmoduleList
                        data={module.submodules}
                        handleOpenDialog={handleOpenDialog}
                        setDialogData={setDialogData}
                        courseId={course?._id}
                        moduleId={module?._id}
                      />
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Free course */}
      {course?.isFree && (
        <VideosList
          data={course?.freeVideos}
          handleOpenDialog={handleOpenDialog}
          setDialogData={setDialogData}
          courseId={course?._id}
        />
      )}

      {/* Dialog box */}
      {openDialog && (
        <AddEditItems
          open={openDialog}
          handleOpen={handleOpenDialog}
          type={dialogData.type}
          isEdit={dialogData.isEdit}
          item={dialogData.item}
          moduleList={moduleList || []}
        />
      )}

      {isLoading && (
        <div>
          <PageLoadingSpinner />
        </div>
      )}
    </>
  );
}

export default EditCourse;
