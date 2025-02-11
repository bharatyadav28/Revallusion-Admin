import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaDownload as DownloadIcon } from "react-icons/fa";

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
import { useGetSubmittedAssignmentsQuery } from "@/store/apis/assignment-apis";
import { formatDate, showError } from "@/lib/reusable-funs";
import { replacePageName } from "@/store/features/generalSlice";
import {
  LoadingSpinner,
  PageLoadingSpinner,
  TableLoader,
} from "@/components/common/LoadingSpinner";
import {
  ViewButton,
  UpdateButton,
  CustomButton,
  CustomSelectSeperate,
} from "@/components/common/Inputs";
import EditScore from "@/components/course-management/submitted-assignments/EditScore";
import { View } from "lucide-react";
import ViewDetails from "@/components/course-management/submitted-assignments/ViewDetails";
import { SubmittedAssignmentType } from "@/lib/interfaces-types";

function SubmittedAssignments() {
  const dispatch = useAppDispatch();
  const { id: courseId } = useParams();

  const [openScore, setOpenScore] = useState(false);
  const [score, setScore] = useState<number | null>(0);
  const [subAssignmentId, setSubAssignmentId] = useState("");

  const [graded, setGraded] = useState<string>("");
  const [submoduleFilter, setSubmoduleFilter] = useState<string>("");

  const [assignmentDetails, setAssignmentsDetails] =
    useState<SubmittedAssignmentType | null>(null);

  const [viewDetails, setViewDetails] = useState(false);

  const handleOpenScore = () => {
    setOpenScore((prev) => !prev);
  };
  const handleViewDetails = () => {
    setViewDetails((prev) => !prev);
  };

  let query = courseId + "?" || " ";
  if (graded !== "clear") query += `isGraded=${graded}&`;
  if (submoduleFilter !== "clear") query += `submoduleId=${submoduleFilter}&`;

  // Fetching
  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetSubmittedAssignmentsQuery(query, {
    skip: !courseId,
  });

  useEffect(() => {
    if (loadingError) showError(loadingError);
  }, [loadingError]);

  console.log("data:", data);

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
  }, [submoduleFilter, graded]);

  console.log("Graded menu", graded);
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
              <TableHead>Assignment name</TableHead>
              <TableHead>Tool</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Files</TableHead>
              <TableHead>Submitted on</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && <TableLoader colSpan={7} />}
            {!isLoading &&
              submittedAssignments.map((subAssignment) => (
                <TableRow key={subAssignment._id}>
                  <TableCell>{subAssignment.assignment.name}</TableCell>
                  <TableCell>{subAssignment.assignment.module.name}</TableCell>
                  <TableCell>
                    {subAssignment.assignment.submodule.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      {subAssignment?.submittedFileUrls?.map((url, index) => (
                        <CustomButton
                          className="bg-[#2C2C2C)] text-[#f1f1f1] hover:bg-[#3C3C3C] transition px-3"
                          handleClick={() => {
                            window.open(url, "_blank");
                          }}
                        >
                          <DownloadIcon size={15} className="mr-2" />{" "}
                          {/* Download icon */}
                          Download file {index + 1}
                        </CustomButton>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell>
                    {formatDate(subAssignment.submittedAt).split(",")[0]}
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {openScore && (
        <EditScore
          open={openScore}
          handleOpen={handleOpenScore}
          score={score}
          subAssignmentId={subAssignmentId}
        />
      )}

      {viewDetails && assignmentDetails && (
        <ViewDetails
          open={viewDetails}
          handleOpen={handleViewDetails}
          assigmentData={assignmentDetails}
        />
      )}

      {/* {isLoading && (
        <div>
          <PageLoadingSpinner />
        </div>
      )} */}
    </>
  );
}

export default SubmittedAssignments;
