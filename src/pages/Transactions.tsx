// View all user queries

import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";
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
import { CustomInput } from "@/components/common/Inputs";
import { useGetTransactionsQuery } from "@/store/apis/transactions-apis";
import { useGetPlansQuery } from "@/store/apis/content-mangement/plans-apis";
import { formatDate, showError } from "@/lib/reusable-funs";
import { TableLoader } from "@/components/common/LoadingSpinner";
import CustomPagination from "@/components/common/CustomPagination";
import EmptyValue from "@/components/common/EmptyValue";
import { EmptyTable } from "@/components/common/EmptyTable";

// import DeleteQuery from "./DeleteQuery";

function Transactions() {
  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");

  const [paymentId, setPaymentId] = useState("");
  const [debouncePaymentId, setDebouncePaymentId] = useState("");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  let query = "?";
  if (debounceSearch) query += `search=${debounceSearch}&`;
  if (debouncePaymentId) query += `paymentId=${paymentId}&`;
  if (currentPage) query += `currentPage=${currentPage}&`;
  if (from) query += `from=${from}&`;
  if (to) query += `to=${to}&`;

  const { data, error, isFetching } = useGetTransactionsQuery(query);

  const { data: plansData, isFetching: isPlansLoading } = useGetPlansQuery();

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

  // Debouncing on payment id
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncePaymentId(paymentId);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [paymentId]);

  const totalPages = data?.data?.pagesCount || 1;

  const plansMap = new Map();
  plansData?.data?.plans?.forEach((plan) => {
    plansMap.set(plan._id, plan.plan_type);
  });

  const isDataLoading = isFetching || isPlansLoading;
  const noTransactions = data?.data?.transactions.length === 0;

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

            <div className="w-[15rem] max-w-full flex items-center border border-gray-400 rounded-md ps-2 ">
              <CustomInput
                text={paymentId}
                setText={setPaymentId}
                className="py-5 border-none focus-visible:ring-0 "
                placeholder="Payment Id"
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
          <TableCaption>A list of user tranactions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              {/* <TableHead>Payment Id</TableHead> */}
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isDataLoading && <TableLoader colSpan={6} />}
            {!isDataLoading && noTransactions && (
              <EmptyTable colSpan={6} text="No transaction found" />
            )}

            {!isDataLoading &&
              data?.data?.transactions?.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>
                    {transaction?.user?.name || <EmptyValue />}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() =>
                        navigate(`/users/${transaction?.user?._id}`)
                      }
                    >
                      {transaction?.user?.email}
                    </button>
                  </TableCell>
                  <TableCell>{plansMap.get(transaction.plan)}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  {/* <TableCell>
                    {" "}
                    <div className="max-w-[10rem] text-wrap break-all">
                      {transaction.payment_id}
                    </div> 
                  </TableCell> */}
                  <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                  <TableCell>
                    <div
                      className={`${
                        transaction.status === "Completed"
                          ? "green-button"
                          : "red-button"
                      } py-1 px-2 w-[6rem] rounded-sm text-sm text-center`}
                    >
                      {transaction.status}
                    </div>
                  </TableCell>
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

export default Transactions;
