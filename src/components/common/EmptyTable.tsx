import { TableRow, TableCell } from "../ui/table";

export const EmptyTable = ({
  colSpan,
  text,
}: {
  colSpan?: number;
  text?: string;
}) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan || 1}>
        <div className="flex justify-center items-center ">
          {" "}
          {/* <LoadingSpinner color="var(--softpurple)" size={50} />{" "} */}
          {text}
        </div>
      </TableCell>
    </TableRow>
  );
};
