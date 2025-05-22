import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaFileInvoice as InvoiceIcon } from "react-icons/fa";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertToDate } from "@/lib/reusable-funs";
import { useGetUserTransactionsQuery } from "@/store/apis/transactions-apis";
import { showError } from "@/lib/reusable-funs";
import { TableLoader } from "../common/LoadingSpinner";
import CustomPagination from "../common/CustomPagination";
import { EmptyTable } from "../common/EmptyTable";

interface Props {
  plansMapping?: Map<string, string>;
}
function UserTransactions({ plansMapping }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const { id: userId } = useParams();

  let query = userId + "?";
  if (currentPage) query += `currentPage=${currentPage}`;

  // Fetching
  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetUserTransactionsQuery(query, {
    skip: !userId,
  });

  // Handle errors
  useEffect(() => {
    if (loadingError) showError(loadingError);
  }, [loadingError]);

  const transactions = data?.data?.transactions || [];

  const totalPages = data?.data?.pagesCount;
  const noTransactions = transactions?.length == 0;

  return (
    <>
      <div className="main-container">
        <Table className="custom-table">
          <TableCaption>A list of transactions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Gateway</TableHead>
              <TableHead>Payment Id</TableHead>
              <TableHead>Payment Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invoice</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && <TableLoader colSpan={7} />}
            {!isLoading && noTransactions && (
              <EmptyTable colSpan={7} text="No transactions found" />
            )}
            {!isLoading &&
              transactions?.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>{plansMapping?.get(transaction.plan)}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.gateway}</TableCell>
                  <TableCell>{transaction.payment_id}</TableCell>
                  <TableCell>{convertToDate(transaction.createdAt)}</TableCell>
                  <TableCell>
                    <div
                      className={`${
                        transaction.status === "Completed"
                          ? "green-button"
                          : "red-button"
                      } py-1 px-2 rounded-sm text-sm w-[6rem] text-center`}
                    >
                      {transaction.status === "Completed"
                        ? "Successful"
                        : transaction.status}
                    </div>
                  </TableCell>

                  <TableCell>
                    <button
                      className={`p-0 m-0 ${
                        !transaction?.invoice_url ? "cursor-not-allowed" : ""
                      } `}
                      onClick={() => {
                        if (!transaction?.invoice_url) return;
                        window.open(
                          transaction?.invoice_url,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                    >
                      <InvoiceIcon size={25} className="" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {!noTransactions && totalPages && totalPages > 1 && (
          <CustomPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            className="!pl-0"
          />
        )}
      </div>
    </>
  );
}

export default UserTransactions;
