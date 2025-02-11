// List showing all assignments of a module

import { useEffect, useState } from "react";
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
import { formatDate, showError } from "@/lib/reusable-funs";
import { assignmentType } from "@/lib/interfaces-types";
import { PageLoadingSpinner } from "@/components/common/LoadingSpinner";
import {
  useDeleteAssignmentMutation,
  useGetSubmoduleAssignmentsQuery,
} from "@/store/apis/assignment-apis";
import AddorEditAssignment from "./AddorEditAssignment";
import DeleteDialog from "../../common/DeleteDialog";
import toast from "react-hot-toast";

interface Props {
  submodule: string;
  courseId: string;
  moduleId: string;
}

function AssignmentList({ submodule, courseId, moduleId }: Props) {
  const [isEdit, setIsEdit] = useState(false);
  const [openEditDialog, SetOpenEditDialog] = useState(false);
  const [openDeleteDialog, SetOpenDeleteDialog] = useState(false);
  const [assignmentData, setAssignmentData] = useState<assignmentType | null>(
    null
  );

  // Fetching
  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetSubmoduleAssignmentsQuery(submodule, {
    skip: !submodule,
  });

  // Deleting
  const [
    deleteAssignment,
    {
      isLoading: isDeleting,
      isSuccess: deletionSuccess,
      error: deletionError,
      data: deletionData,
    },
  ] = useDeleteAssignmentMutation();

  const handleEditDialog = () => {
    SetOpenEditDialog((prev) => !prev);
  };
  const handleDeleteDialog = () => {
    SetOpenDeleteDialog((prev) => !prev);
  };

  // Handles deletion success
  useEffect(() => {
    if (deletionData) {
      toast.success(deletionData.message);
      handleDeleteDialog();
      setAssignmentData(null);
    }
  }, [deletionSuccess]);

  // Handles error
  useEffect(() => {
    const error = deletionError || loadingError;
    if (error) {
      showError(error);
    }
  }, [deletionError, loadingError]);

  const assignments = data?.data?.assignments || [];

  return (
    <div>
      <div className="text-[1.2rem] uppercase mb-4">Assignments</div>
      <div className="main-container">
        <CustomButton
          className="green-button px-2 py-4"
          handleClick={() => {
            handleEditDialog();
            setIsEdit(false);
          }}
        >
          <AddIcon size={30} className="p-0 m-0" /> Add Assignment
        </CustomButton>
        <Table className="custom-table">
          <TableCaption>A list of assignments</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[6rem]">Name</TableHead>
              <TableHead className="">Created At</TableHead>
              <TableHead className=""> File</TableHead>
              <TableHead className="">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {assignments?.map((assignment) => (
              <TableRow key={assignment._id}>
                <TableCell>{assignment.name}</TableCell>
                <TableCell>
                  {assignment?.createdAt && formatDate(assignment?.createdAt)}
                </TableCell>
                <TableCell>
                  <CustomButton
                    className="purple-button px-3 py-4"
                    handleClick={() => {
                      window.open(assignment.fileUrl, "_blank");
                    }}
                  >
                    View file
                  </CustomButton>
                </TableCell>
                <TableCell>
                  <UpdateButton
                    className="green-button"
                    handleClick={() => {
                      handleEditDialog();
                      setIsEdit(true);
                      setAssignmentData(assignment);
                    }}
                  />
                  <DeleteButton
                    className="red-button"
                    handleClick={() => {
                      handleDeleteDialog();
                      setAssignmentData(assignment);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Dialog to add or edit assignment */}
        <AddorEditAssignment
          open={openEditDialog}
          handleOpen={handleEditDialog}
          isEdit={isEdit}
          assignmentData={assignmentData}
          courseId={courseId}
          moduleId={moduleId}
          submoduleId={submodule}
        />

        {/* Delete assignment confirmation dialog */}
        <DeleteDialog
          openDialog={openDeleteDialog}
          handleOpenDialog={handleDeleteDialog}
          title="Delete Assignment"
          description="Are you sure you want to delete this assignment?"
          onCancel={() => {
            handleDeleteDialog();
            setAssignmentData(null);
          }}
          onConfirm={() => {
            if (!assignmentData?._id || isDeleting) return;
            deleteAssignment(assignmentData?._id);
          }}
          isDeleting={isDeleting}
        />

        {isLoading && (
          <div>
            <PageLoadingSpinner isFullPage={true} />
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignmentList;
