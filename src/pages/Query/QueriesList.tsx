// View all user queries

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomInput, ViewButton } from "@/components/common/Inputs";
import { useGetQueriesQuery } from "@/store/apis/queries.apis";
import { showError } from "@/lib/reusable-funs";
import { queryType } from "@/lib/interfaces-types";
import { PageLoadingSpinner } from "@/components/common/LoadingSpinner";
import CustomPagination from "@/components/common/CustomPagination";
import DeleteQuery from "./DeleteQuery";

function QueriesList() {
  const [search, setSearch] = useState("");
  const [deboounceSearch, setDebounceSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetQueriesQuery(
    `?resultPerPage=8&keyword=${deboounceSearch}&currentPage=${currentPage}`
  );

  // Pagination pages
  const totalQueryCount = data?.data?.totalQueryCount;
  let totalPages = 1;
  if (totalQueryCount) {
    totalPages = Math.ceil(totalQueryCount / 8);
  }

  // Show error
  useEffect(() => {
    if (loadingError) {
      showError(loadingError);
    }
  }, [loadingError]);

  // Debouncing on search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <>
      <div className="main-container">
        <div className="">
          <div className="w-[20rem] max-w-full flex items-center border border-gray-400 rounded-md ps-2 ">
            <SearchIcon size={18} />
            <CustomInput
              text={search}
              setText={setSearch}
              className="py-5 border-none focus-visible:ring-0 "
              placeholder="Search..."
            />
          </div>
        </div>

        <Table className="custom-table">
          <TableCaption>A list of user queries</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="">Email</TableHead>
              <TableHead className="">Mobile no</TableHead>
              <TableHead className="">Address</TableHead>
              <TableHead className="">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.data?.queries?.map((query: queryType) => (
              <TableRow key={query._id}>
                <TableCell>{query.name}</TableCell>
                <TableCell>{query.email}</TableCell>
                <TableCell>{query.mobile}</TableCell>
                <TableCell>{query.address}</TableCell>

                <TableCell>
                  <div className="flex">
                    <ViewButton
                      handleClick={() => {
                        navigate(`/queries/${query._id}`, {
                          state: {
                            query,
                          },
                        });
                      }}
                    />
                    <DeleteQuery id={query._id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <CustomPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
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

export default QueriesList;
