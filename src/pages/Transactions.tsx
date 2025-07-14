import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaFileInvoice as InvoiceIcon } from "react-icons/fa";
import JSZip from "jszip";
import { FaSort as SortIcon } from "react-icons/fa";
import * as XLSX from "xlsx";

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
  CustomButton,
  CustomInput,
  CustomSelectSeperate,
} from "@/components/common/Inputs";
import { useGetTransactionsQuery } from "@/store/apis/transactions-apis";
import { useGetPlansQuery } from "@/store/apis/content-mangement/plans-apis";
import { formatDate, showError } from "@/lib/reusable-funs";
import { TableLoader } from "@/components/common/LoadingSpinner";
import CustomPagination from "@/components/common/CustomPagination";
import EmptyValue from "@/components/common/EmptyValue";
import { EmptyTable } from "@/components/common/EmptyTable";
import toast from "react-hot-toast";
import { baseAddr } from "@/lib/resuable-data";

// import DeleteQuery from "./DeleteQuery";

function Transactions() {
  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [sortByAmount, setSortByAmount] = useState("");
  const [sortByDate, setSortByDate] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  let query = "?";
  if (debounceSearch) query += `search=${debounceSearch}&`;
  if (currentPage) query += `currentPage=${currentPage}&`;
  if (from) query += `from=${from}&`;
  if (to) query += `to=${to}&`;
  if (sortByAmount) query += `sortByAmount=${sortByAmount}&`;
  if (sortByDate) query += `sortByDate=${sortByDate}&`;
  if (status) query += `status=${status}&`;

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

  const totalPages = data?.data?.pagesCount || 1;

  const plansMap = new Map();
  plansData?.data?.plans?.forEach((plan) => {
    plansMap.set(plan._id, plan.plan_type);
  });

  const isDataLoading = isFetching || isPlansLoading;
  const noTransactions = data?.data?.transactions.length === 0;

  const downloadBulkInvoices = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const response = await fetch(
        `${baseAddr}/api/v1/transaction/filtered?to=${to}&from=${from}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Download invoices failed");
      }
      const res = await response.json();
      const transactions = res?.data?.transactions;
      if (transactions.length === 0) {
        toast.error("No transactions found");
        setIsLoading(false);
        return;
      }

      const zip = new JSZip();
      for (let transaction of transactions) {
        if (transaction.invoice_url) {
          try {
            const invoiceUrl = transaction.invoice_url;
            const invoiceBlob = await fetch(invoiceUrl).then((res) => {
              if (!res.ok)
                throw new Error(`Failed to fetch invoice: ${res.statusText}`);
              return res.blob();
            });

            const fileName = `Invoice_${transaction.payment_id}.pdf`;
            zip.file(fileName, invoiceBlob);
          } catch (error) {
            console.error(
              "Error fetching invoice for transaction",
              transaction.payment_id,
              error
            );
            toast.error(`Error fetching invoice for ${transaction.payment_id}`);
          }
        }
      }

      if (Object.keys(zip.files).length === 0) {
        toast.error("No invoices available to download.");
        setIsLoading(false);
        return;
      }

      zip.generateAsync({ type: "blob" }).then((content) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = `Invoices_${from}_to_${to}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Invoices downloaded successfully.");
        setIsLoading(false); // Set loading to false after the process completes
      });
    } catch (error) {
      console.log(error);
      toast.error("Download invoices failed");
    }
  };

  const exportTransactions = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const response = await fetch(
        `${baseAddr}/api/v1/transaction/export?to=${to}&from=${from}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Download invoices failed");
      }

      const data = await response.arrayBuffer();

      const workbook = XLSX.read(data, { type: "array" });
      const xlsxData = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([xlsxData], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", `Ravallusion.xlsx`);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);

      toast.success("File Downloaded Successfully");
    } catch (error) {
      console.log("Error", error);
      toast.error("An error occured");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortByAmount = () => {
    if (sortByAmount === "asc") {
      setSortByAmount("desc");
    } else {
      setSortByAmount("asc");
    }
  };

  const handleSortByDate = () => {
    if (sortByDate === "asc") {
      setSortByDate("desc");
    } else {
      setSortByDate("asc");
    }
  };

  const statusMenu = [
    { key: "No filter", value: "No filter" },
    { key: "Successful", value: "Completed" },
    { key: "Failed", value: "Failed" },
  ];

  return (
    <>
      <div className="main-container">
        <div className="flex flex-wrap gap-3 items-center">
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

          <CustomSelectSeperate
            menu={statusMenu}
            value={status}
            onChange={setStatus}
            placeholder="Filter by status"
            className="max-w-[15rem]"
          />

          <div className="flex lg:flex-row flex-col  gap-2">
            <div className="flex items-center px-2 gap-2 lg:max-w-[12rem] lg:w-full  w-[15rem] bg-inherit border border-gray-400 rounded-md  py-[0.6rem]">
              <div className="text-sm font-semibold">From</div>
              <input
                className="w-full bg-inherit  border-none rounded-md  text-sm !m-0"
                type="date"
                placeholder="filter by date"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="flex items-center px-2 gap-2 lg:max-w-[12rem] lg:w-full w-[15rem] bg-inherit border border-gray-400 rounded-md  py-[0.6rem]">
              <div className="text-sm font-semibold">To</div>
              <input
                className="w-full bg-inherit  border-none rounded-md  text-sm !m-0"
                type="date"
                placeholder="filter by date"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          <CustomButton
            className="green-button px-2  py-5 "
            handleClick={downloadBulkInvoices}
          >
            Download invoices
          </CustomButton>
          <CustomButton
            className="green-button px-2  py-5 "
            handleClick={exportTransactions}
          >
            Export Transactions
          </CustomButton>
        </div>

        <Table className="custom-table">
          <TableCaption>A list of user transactions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>
                <button onClick={handleSortByAmount}>
                  <div className="flex gap-2 items-center">
                    <div>Amount</div>
                    <div>
                      <SortIcon
                        className={
                          sortByAmount ? "text-[var(--lightpurple)]" : ""
                        }
                      />
                    </div>
                  </div>
                </button>
              </TableHead>
              <TableHead>Payment Id</TableHead>
              <TableHead>
                <button onClick={handleSortByDate}>
                  <div className="flex gap-2 items-center">
                    <div> Date & Time </div>
                    <div>
                      <SortIcon
                        className={
                          sortByDate ? "text-[var(--lightpurple)]" : ""
                        }
                      />
                    </div>
                  </div>
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invoice</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isDataLoading && <TableLoader colSpan={8} />}
            {!isDataLoading && noTransactions && (
              <EmptyTable colSpan={8} text="No transaction found" />
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
                  <TableCell>
                    {plansMap.get(transaction.plan) || <EmptyValue />}
                  </TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>
                    {" "}
                    <div className="max-w-[10rem] text-wrap break-all">
                      {transaction.payment_id}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                  <TableCell>
                    <div
                      className={`${
                        transaction.status === "Completed"
                          ? "green-button"
                          : "red-button"
                      } py-1 px-2 w-[6rem] rounded-sm text-sm text-center`}
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
