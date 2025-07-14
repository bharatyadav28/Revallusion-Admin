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
import {
  useGetCourseQuery,
  useDeleteModuleMutation,
} from "@/store/apis/course-apis";
import { showError } from "@/lib/reusable-funs";
import { useAppDispatch } from "@/hooks/use-redux";
import { replacePageName } from "@/store/features/generalSlice";
import {
  DeleteButton,
  ExpandButton,
  UpdateButton,
} from "@/components/common/Inputs";
import SubmoduleList from "@/components/course-management/SubmoduleList";
import { PageLoadingSpinner } from "@/components/common/LoadingSpinner";
import VideosList from "@/components/common/VideosList";
import { CustomButton } from "@/components/common/Inputs";
import AddEditItems from "@/components/course-management/AddEditItem";
import { courseItemType } from "@/lib/interfaces-types";
import CustomBreadcumb from "@/components/common/CustomBreadcumb";
import DeleteDialog from "@/components/common/DeleteDialog";
import toast from "react-hot-toast";

export interface dialogDataType {
  type: string;
  isEdit: boolean;
  item: courseItemType | null;
}
function EditCourse() {
  // Expand module id
  const [showModuleId, setShowModuleId] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialgo, setOpenDeleteDialog] = useState(false);

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

  const handleDeleteDialog = () => {
    setOpenDeleteDialog((prev) => !prev);
  };

  const [dialogData, setDialogData] = useState<dialogDataType>({
    type: "module",
    isEdit: false,
    item: null,
  });
  const [deleteSubmodule, { isLoading: isDeleting }] =
    useDeleteModuleMutation();

  const handleModuleDelete = async () => {
    if (isDeleting || !courseId) return;
    try {
      if (selectedModule) {
        const response = await deleteSubmodule({
          courseId,
          moduleId: selectedModule,
        }).unwrap();

        handleDeleteDialog();
        setSelectedModule(null);
        toast.success(response.message);
      }
    } catch (error) {
      const err = error as { data?: { message?: string } };
      const message = err.data?.message || "Something went wrong";
      toast.error(message);
    }
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

  // Breadcumb list
  const breadcrumbList = {
    currentPage: "Edit course - " + data?.data?.course?.title,
    pageTraces: [
      {
        name: "Courses management",
        href: "/course-management",
      },
    ],
  };

  return (
    <>
      {<CustomBreadcumb list={breadcrumbList} />}
      {/* Paid course */}
      {!course?.isFree && (
        <div className="main-container">
          {/* Add Buttons */}
          <div className="flex flex-wrap gap-2">
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
            <TableCaption>A list of {course?.title} Tools</TableCaption>
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

                        <DeleteButton
                          className="ml-0"
                          handleClick={() => {
                            handleDeleteDialog();
                            setSelectedModule(module._id);
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
        <div className="main-container">
          <VideosList
            data={course?.freeVideos}
            handleOpenDialog={handleOpenDialog}
            setDialogData={setDialogData}
            courseId={course?._id}
            className="bg-[hsl(var(--border))]"
          />
        </div>
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

      {/* Delete dialog */}
      <DeleteDialog
        openDialog={openDeleteDialgo}
        handleOpenDialog={handleDeleteDialog}
        title="Delete Tool"
        description="Are you sure you want to delete this tool?"
        onCancel={() => {
          handleDeleteDialog();
          setSelectedModule(null);
        }}
        onConfirm={handleModuleDelete}
        isDeleting={isDeleting}
      />

      {isLoading && (
        <div>
          <PageLoadingSpinner />
        </div>
      )}
    </>
  );
}

export default EditCourse;
