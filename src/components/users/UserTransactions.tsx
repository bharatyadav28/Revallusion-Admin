import { transactionType } from "@/lib/interfaces-types";
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

interface Props {
  transactions?: transactionType[];
  plansMapping?: Map<string, string>;
}
function UserTransactions({ transactions, plansMapping }: Props) {
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
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions?.map((transaction) => (
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
                    {transaction.status}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default UserTransactions;
