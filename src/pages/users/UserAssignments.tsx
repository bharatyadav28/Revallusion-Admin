import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaDownload as DownloadIcon } from "react-icons/fa";
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
  useGetUserAssignmentsQuery,
  useRevokeAssignmentMutation,
} from "@/store/apis/assignment-apis";
import { formatDate, showError } from "@/lib/reusable-funs";
import { TableLoader } from "@/components/common/LoadingSpinner";
import {
  UpdateButton,
  CustomButton,
  DeleteButton,
} from "@/components/common/Inputs";
import EditScore from "@/components/course-management/submitted-assignments/EditScore";

import CustomTooltip from "@/components/common/CustomTooltip";
import DeleteDialog from "@/components/common/DeleteDialog";
import CustomPagination from "@/components/common/CustomPagination";

function UserAssignments() {
  const { id: userId } = useParams();

  const [openScore, setOpenScore] = useState(false);
  const [score, setScore] = useState<number | null>(0);
  const [subAssignmentId, setSubAssignmentId] = useState("");
  const [openDeleteDialog, SetOpenDeleteDialog] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const handleOpenScore = () => {
    setOpenScore((prev) => !prev);
  };

  const handleDeleteDialog = () => {
    SetOpenDeleteDialog((prev) => !prev);
  };

  let query = userId + "?";
  if (currentPage) query += `currentPage=${currentPage}`;

  // Fetching
  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetUserAssignmentsQuery(query, {
    skip: !userId,
  });

  const [
    revokeAssignment,
    {
      isLoading: isRevoking,
      isSuccess: revokingSuccess,
      error: revokingError,
      data: revokingData,
    },
  ] = useRevokeAssignmentMutation();

  // Handle success
  useEffect(() => {
    if (revokingSuccess) {
      toast.success(revokingData?.message);
      handleDeleteDialog();
    }
  }, [revokingSuccess]);

  // Handle errors
  useEffect(() => {
    if (loadingError) showError(loadingError);
  }, [loadingError]);

  useEffect(() => {
    if (revokingError) showError(revokingError);
  }, [revokingError]);

  const submittedAssignments = data?.data?.assigments || [];

  const totalPages = data?.data?.pagesCount;

  return (
    <>
      <div className="main-container">
        <Table className="custom-table">
          <TableCaption>A list of submitted assignments</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>S.No.</TableHead>
              <TableHead>Video</TableHead>
              <TableHead>Files</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && <TableLoader colSpan={7} />}
            {!isLoading &&
              submittedAssignments.map((subAssignment, index) => (
                <TableRow key={subAssignment._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{subAssignment?.video?.title}</TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-2">
                      {
                        <CustomButton
                          className="bg-[#2C2C2C)] text-[#f1f1f1] hover:bg-[#3C3C3C] transition px-3"
                          handleClick={() => {
                            window.open(
                              subAssignment?.submittedFileUrl,
                              "_blank"
                            );
                          }}
                        >
                          <DownloadIcon size={15} className="mr-2" />{" "}
                          {/* Download icon */}
                          Download file
                        </CustomButton>
                      }
                    </div>
                  </TableCell>

                  <TableCell>
                    {formatDate(subAssignment?.submittedAt)}
                  </TableCell>

                  <TableCell>{subAssignment.score}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <UpdateButton
                        className="border-none"
                        handleClick={() => {
                          handleOpenScore();
                          setSubAssignmentId(subAssignment._id);
                          setScore(subAssignment.score);
                        }}
                      />

                      <CustomTooltip hoverContent="Revoke">
                        <DeleteButton
                          className=" ml-0 "
                          handleClick={() => {
                            handleDeleteDialog();
                            setSubAssignmentId(subAssignment._id);
                          }}
                        />
                      </CustomTooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {totalPages && totalPages > 1 && (
          <CustomPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            className="!pl-0"
          />
        )}
      </div>

      {openScore && (
        <EditScore
          open={openScore}
          handleOpen={handleOpenScore}
          score={score}
          subAssignmentId={subAssignmentId}
        />
      )}
      {/* View Details drawer */}

      {/* Revoke assignment dialog */}
      <DeleteDialog
        openDialog={openDeleteDialog}
        handleOpenDialog={handleDeleteDialog}
        title="Revoke Assignment"
        description="Are you sure you want to revoke this assignment?"
        onCancel={() => {
          handleDeleteDialog();
          setSubAssignmentId("");
        }}
        onConfirm={() => {
          if (!subAssignmentId || isRevoking) return;
          revokeAssignment(subAssignmentId);
        }}
        isDeleting={isRevoking}
      />
    </>
  );
}

export default UserAssignments;
