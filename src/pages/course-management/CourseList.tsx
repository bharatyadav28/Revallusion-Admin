// View all modules

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { UpdateButton } from "@/components/common/Inputs";
import { useGetCoursesQuery } from "@/store/apis/course-apis";
import { showError } from "@/lib/reusable-funs";
import { courseType } from "@/lib/interfaces-types";
import { PageLoadingSpinner } from "@/components/common/LoadingSpinner";

function CourseList() {
  const navigate = useNavigate();

  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetCoursesQuery();

  // Show error
  useEffect(() => {
    if (loadingError) {
      showError(loadingError);
    }
  }, [loadingError]);

  return (
    <>
      <div className="main-container">
        <Table className="custom-table">
          <TableCaption>A list of courses</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[6rem]">Name</TableHead>
              <TableHead className="">Type</TableHead>
              <TableHead className="">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.data?.courses.map((course: courseType) => (
              <TableRow key={course._id}>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.isFree ? "Free" : "Paid"}</TableCell>

                <TableCell>
                  <div className="flex">
                    <UpdateButton
                      handleClick={() => {
                        navigate(`${course._id}`, {});
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {isLoading && (
          <div>
            <PageLoadingSpinner />
          </div>
        )}
      </div>
    </>
  );
}

export default CourseList;
