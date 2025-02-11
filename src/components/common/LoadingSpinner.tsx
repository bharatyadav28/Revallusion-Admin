import { HashLoader, ClipLoader, BeatLoader } from "react-spinners";

import { TableRow, TableCell } from "../ui/table";

// Whole page loading spinner
const PageLoadingSpinner = ({ isFullPage }: { isFullPage?: boolean }) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-10 h-screen ${
        !isFullPage ? "md:left-[16rem]" : ""
      } `}
    >
      <HashLoader color="#ffffff" size={60} />
    </div>
  );
};

// Small loading spinner
const LoadingSpinner = ({ size, color }: { size?: number; color?: string }) => {
  return (
    <ClipLoader
      size={size || 25}
      color={color || "#ffffff"}
      cssOverride={{ borderWidth: "0.2rem" }}
    />
  );
};

const TableLoader = ({ colSpan }: { colSpan?: number }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan || 1}>
        <div className="flex justify-center items-center ">
          {" "}
          <LoadingSpinner color="var(--softpurple)" size={50} />{" "}
        </div>
      </TableCell>
    </TableRow>
  );
};

// UploadSpinner
const UploadSpinner = () => {
  return <BeatLoader color="#f1f1f1" />;
};
export { PageLoadingSpinner, LoadingSpinner, UploadSpinner, TableLoader };
