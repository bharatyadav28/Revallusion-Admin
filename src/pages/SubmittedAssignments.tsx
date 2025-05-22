import { useEffect, useState } from "react";
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
import { useAppDispatch } from "@/hooks/use-redux";
import {
  useGetSubmittedAssignmentsQuery,
  useRevokeAssignmentMutation,
} from "@/store/apis/assignment-apis";
import { showError } from "@/lib/reusable-funs";
import { replacePageName } from "@/store/features/generalSlice";
import { TableLoader } from "@/components/common/LoadingSpinner";
import {
  ViewButton,
  UpdateButton,
  CustomButton,
  CustomSelectSeperate,
  DeleteButton,
} from "@/components/common/Inputs";
import EditScore from "@/components/course-management/submitted-assignments/EditScore";
import ViewDetails from "@/components/course-management/submitted-assignments/ViewDetails";
import { SubmittedAssignmentType } from "@/lib/interfaces-types";
import CustomTooltip from "@/components/common/CustomTooltip";
import DeleteDialog from "@/components/common/DeleteDialog";
import CustomPagination from "@/components/common/CustomPagination";
import EmptyValue from "@/components/common/EmptyValue";

function SubmittedAssignments() {
  const dispatch = useAppDispatch();

  const [openScore, setOpenScore] = useState(false);
  const [score, setScore] = useState<number | null>(0);
  const [subAssignmentId, setSubAssignmentId] = useState("");
  const [openDeleteDialog, SetOpenDeleteDialog] = useState(false);

  const [graded, setGraded] = useState<string>("");
  const [submoduleFilter, setSubmoduleFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const [assignmentDetails, setAssignmentsDetails] =
    useState<SubmittedAssignmentType | null>(null);

  const [viewDetails, setViewDetails] = useState(false);

  const handleOpenScore = () => {
    setOpenScore((prev) => !prev);
  };
  const handleViewDetails = () => {
    setViewDetails((prev) => !prev);
  };

  const handleDeleteDialog = () => {
    SetOpenDeleteDialog((prev) => !prev);
  };

  let query = "?";
  if (graded !== "clear") query += `isGraded=${graded}&`;
  if (submoduleFilter !== "clear") query += `submoduleId=${submoduleFilter}&`;
  if (currentPage) query += `currentPage=${currentPage}`;

  // Fetching
  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetSubmittedAssignmentsQuery(query);

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

  // Replace page name
  useEffect(() => {
    dispatch(replacePageName("Submitted Assignments"));
  }, []);

  const submittedAssignments = data?.data?.submittedAssignments || [];

  const submodules = data?.data?.submodules || [];
  const submoduleMenu = [{ key: "No filter", value: "clear" }, ...submodules];

  const GradedMenu = [
    {
      key: "No filter",
      value: "clear",
    },
    {
      key: "Yes",
      value: "yes",
    },
    {
      key: "No",
      value: "no",
    },
  ];

  useEffect(() => {
    if (submoduleFilter === "clear") {
      setSubmoduleFilter("");
    }
    if (graded === "clear") {
      setGraded("");
    }
    setCurrentPage(1);
  }, [submoduleFilter, graded]);

  const totalPages = data?.data?.pagesCount;

  return (
    <>
      <div className="main-container">
        <div className="flex gap-2">
          <CustomSelectSeperate
            menu={GradedMenu}
            value={graded}
            onChange={setGraded}
            placeholder="Graded"
            className="max-w-[15rem]"
          />
          <CustomSelectSeperate
            menu={submoduleMenu}
            value={submoduleFilter}
            onChange={setSubmoduleFilter}
            placeholder="Filter by topic"
            className="max-w-[15rem]"
          />
        </div>

        <Table className="custom-table">
          <TableCaption>A list of submitted assignments</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User Email</TableHead>
              <TableHead>Video</TableHead>
              <TableHead>Tool</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Files</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && <TableLoader colSpan={7} />}
            {!isLoading &&
              submittedAssignments.map((subAssignment) => (
                <TableRow key={subAssignment._id}>
                  <TableCell>{subAssignment.user.email}</TableCell>
                  <TableCell>
                    {subAssignment.video?.title || <EmptyValue />}
                  </TableCell>
                  <TableCell>
                    {subAssignment.video?.module?.name || <EmptyValue />}
                  </TableCell>
                  <TableCell>
                    {subAssignment.video?.submodule?.name || <EmptyValue />}
                  </TableCell>
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

                  <TableCell>{subAssignment.score}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <ViewButton
                        className="border-none "
                        handleClick={() => {
                          handleViewDetails();
                          setAssignmentsDetails(subAssignment);
                        }}
                      />

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

      {viewDetails && assignmentDetails && (
        <ViewDetails
          open={viewDetails}
          handleOpen={handleViewDetails}
          assigmentData={assignmentDetails}
        />
      )}

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

export default SubmittedAssignments;
