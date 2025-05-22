import { useState, useEffect } from "react";
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
import { CustomInput } from "@/components/common/Inputs";
import { useGetLeaderBoardQuery } from "@/store/apis/leaderboard-apis";

import { convertToDate, showError } from "@/lib/reusable-funs";
import { TableLoader } from "@/components/common/LoadingSpinner";
import CustomPagination from "@/components/common/CustomPagination";
import EmptyValue from "@/components/common/EmptyValue";
import { EmptyTable } from "@/components/common/EmptyTable";
import { Link } from "react-router-dom";

function LeaderBoard() {
  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  let query = "?";
  if (debounceSearch) query += `search=${debounceSearch}&`;
  if (currentPage) query += `currentPage=${currentPage}&`;
  if (from) query += `from=${from}&`;
  if (to) query += `to=${to}&`;

  const { data, error, isFetching } = useGetLeaderBoardQuery(query);

  // Show error
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  // Debouncing on search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const totalPages = data?.data?.pagesCount || 1;

  const isDataLoading = isFetching;
  const noUsers = data?.data?.leaderBoard.length === 0;

  return (
    <>
      <div className="main-container">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex flex-wrap gap-2">
            <div className="w-[15rem] max-w-full flex items-center border border-gray-400 rounded-md ps-2 ">
              <SearchIcon size={18} />
              <CustomInput
                text={search}
                setText={setSearch}
                className="py-5 border-none focus-visible:ring-0 "
                placeholder="Search..."
              />
            </div>
          </div>

          <div className="flex lg:flex-row flex-col  gap-2">
            <div className="flex items-center px-2 gap-2 lg:max-w-[12rem] lg:w-full  w-[15rem] bg-inherit border border-gray-400 rounded-md  py-[0.6rem]">
              <div className="text-sm font-semibold">From</div>
              <input
                className="w-full bg-inherit  border-none rounded-md  text-sm !m-0"
                type="date"
                placeholder="filter by date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>

            <div className="flex items-center px-2 gap-2 lg:max-w-[12rem] lg:w-full w-[15rem] bg-inherit border border-gray-400 rounded-md  py-[0.6rem]">
              <div className="text-sm font-semibold">To</div>
              <input
                className="w-full bg-inherit  border-none rounded-md  text-sm !m-0"
                type="date"
                placeholder="filter by date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Table className="custom-table">
          <TableCaption>Leader Board</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-[3rem]">Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Total Score</TableHead>
              <TableHead>Average Score</TableHead>
              <TableHead>Completed On</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isDataLoading && <TableLoader colSpan={6} />}
            {!isDataLoading && noUsers && (
              <EmptyTable colSpan={7} text="No data found" />
            )}

            {!isDataLoading &&
              !noUsers &&
              data?.data?.leaderBoard?.map((item, index) => (
                <TableRow key={item._id}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>
                    <Link
                      className="hover:underline"
                      to={`/users/${item.user._id}`}
                    >
                      {item?.user?.name || <EmptyValue />}
                    </Link>{" "}
                  </TableCell>
                  <TableCell>
                    <Link
                      className="hover:underline"
                      to={`/users/${item.user._id}`}
                    >
                      {item?.user?.email}
                    </Link>
                  </TableCell>
                  <TableCell>{item.scoresSum}</TableCell>
                  <TableCell>{item.averageAssigmentsScore}</TableCell>

                  <TableCell>{convertToDate(item.createdAt)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <CustomPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </>
  );
}

export default LeaderBoard;
