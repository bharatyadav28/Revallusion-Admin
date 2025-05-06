import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyTable } from "../common/EmptyTable";
import { DeleteButton, UpdateButton } from "../common/Inputs";
import { TimeStampType } from "@/lib/interfaces-types";
import {
  useDeleteTimestampMutation,
  useGetTimestampsQuery,
} from "@/store/apis/timestamp-apis";
import DeleteDialog from "../common/DeleteDialog";
import { secondsToTime, showError } from "@/lib/reusable-funs";
import toast from "react-hot-toast";
import { TableLoader } from "../common/LoadingSpinner";

interface Props {
  videoId: string;
  handleFormOpen: (timestamp?: TimeStampType) => void;
}

function TimeStampList({ handleFormOpen, videoId }: Props) {
  const [openDeleteDialgo, setOpenDeleteDialog] = useState(false);
  const [timestampId, setTimestampId] = useState("");

  const { data, isFetching: isLoading } = useGetTimestampsQuery(videoId);

  const [
    deleteTimestamp,
    {
      isLoading: isDeleting,
      isSuccess: deletionSuccess,
      error: deletionError,
      data: deletionData,
    },
  ] = useDeleteTimestampMutation();

  const handleDeleteDialog = () => {
    setOpenDeleteDialog((prev) => !prev);
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    await deleteTimestamp(timestampId);
  };

  useEffect(() => {
    if (deletionError) {
      showError(deletionError);
    }
  }, [deletionError]);

  useEffect(() => {
    if (deletionData) {
      toast.success(deletionData.message);
      setTimestampId("");
      handleDeleteDialog();
    }
  }, [deletionSuccess]);

  const timestamps = data?.data?.timestamps;
  const noTimeStamps = timestamps?.length == 0;
  return (
    <>
      <Table className="custom-table ">
        <TableCaption>{`A list of Video timestamps`}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="max-w-8">Start time</TableHead>
            <TableHead className="">Title</TableHead>
            <TableHead className="action-btns">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && <TableLoader colSpan={3} />}
          {!isLoading && noTimeStamps && (
            <EmptyTable colSpan={7} text="No timestamp found" />
          )}
          {!isLoading &&
            !noTimeStamps &&
            timestamps?.map((timestamp) => {
              return (
                <TableRow key={timestamp._id}>
                  <TableCell className="min-w-[10rem]">
                    {secondsToTime(Number(timestamp.time))}
                  </TableCell>
                  <TableCell className="min-w-[10rem]">
                    {timestamp.title}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex gap-0 items-center">
                      <UpdateButton
                        handleClick={() => handleFormOpen(timestamp)}
                      />
                      <DeleteButton
                        handleClick={() => {
                          if (timestamp._id) {
                            setTimestampId(timestamp._id);
                            handleDeleteDialog();
                          }
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>

      {/* Delete dialog */}
      <DeleteDialog
        openDialog={openDeleteDialgo}
        handleOpenDialog={handleDeleteDialog}
        title="Delete Timestamp"
        description="Are you sure you want to delete this timestamp?"
        onCancel={() => {
          handleDeleteDialog();
          setTimestampId("");
        }}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}

export default TimeStampList;
