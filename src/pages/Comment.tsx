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
import {
  useDeleteCommentMutation,
  useGetCommentsQuery,
} from "@/store/apis/comment-apis";
import {
  CustomSelectSeperate,
  DeleteButton,
  UpdateButton,
  ViewButton,
} from "@/components/common/Inputs";
import EditReply from "@/components/comments/EditReply";
import DeleteDialog from "@/components/common/DeleteDialog";
import { showError } from "@/lib/reusable-funs";
import { TableLoader } from "@/components/common/LoadingSpinner";
import toast from "react-hot-toast";
import CustomPagination from "@/components/common/CustomPagination";
import CommentFullDetails from "@/components/comments/CommentDetails";
import { CommentType } from "@/lib/interfaces-types";

const Comment = () => {
  const [openReplyDialog, setReplyDialog] = useState(false);
  const [commentId, setCommentId] = useState("");
  const [reply, setReply] = useState("");
  const [openDeleteDialog, SetOpenDeleteDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [replied, setReplied] = useState<string>("");

  const [commentDetails, setCommentDetails] = useState<CommentType | null>(
    null
  );
  const [viewDetails, setViewDetails] = useState(false);

  // Fetch comments
  let query = `?currentPage=${currentPage}&`;
  if (replied) query += `replied=${replied}&`;

  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetCommentsQuery(query);

  // Delete a comment
  const [
    deleteComment,
    {
      isLoading: isDeleting,
      isSuccess: deletionSuccess,
      error: deletionError,
      data: deletionData,
    },
  ] = useDeleteCommentMutation();

  const handleReplyDialog = () => {
    setReplyDialog((prev) => !prev);
  };
  const handleDeleteDialog = () => {
    SetOpenDeleteDialog((prev) => !prev);
  };
  const handleViewDetails = () => {
    setViewDetails((prev) => !prev);
  };

  // Handle delete success
  useEffect(() => {
    if (deletionSuccess) {
      toast.success(deletionData.message);
      handleDeleteDialog();
      setCommentId("");
    }
  }, [deletionSuccess]);

  // Handle delete error
  useEffect(() => {
    if (deletionError) {
      showError(deletionError);
    }
  }, [deletionError]);

  // Handle fetching error
  useEffect(() => {
    if (loadingError) {
      showError(loadingError);
    }
  }, [loadingError]);

  useEffect(() => {
    if (replied === "clear") {
      setReplied("");
    }
    setCurrentPage(1);
  }, [replied]);

  const comments = data?.data?.comments;
  const totalPages = data?.data?.pagesCount;

  const RepliedMenu = [
    {
      key: "No filter",
      value: "clear",
    },
    {
      key: "Yes",
      value: "yes",
    },
    {
      key: "No",
      value: "no",
    },
  ];

  return (
    <>
      <div className="main-container">
        <CustomSelectSeperate
          menu={RepliedMenu}
          value={replied}
          onChange={setReplied}
          placeholder="Graded"
          className="max-w-[15rem]"
        />

        <Table className="custom-table">
          <TableCaption>A list of user comments</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Video</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Replied</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && <TableLoader colSpan={5} />}
            {!isLoading &&
              comments?.map((comment) => (
                <TableRow key={comment._id}>
                  <TableCell>{comment.user.name}</TableCell>
                  <TableCell>{comment.video.title}</TableCell>
                  <TableCell>{comment.comment}</TableCell>
                  <TableCell>{comment?.reply ? "Yes" : "No"}</TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <ViewButton
                        className="border-none "
                        handleClick={() => {
                          handleViewDetails();
                          setCommentDetails(comment);
                        }}
                      />

                      <UpdateButton
                        className="border-none"
                        handleClick={() => {
                          handleReplyDialog();
                          setCommentId(comment._id);
                          setReply(comment.reply || "");
                        }}
                      />

                      <DeleteButton
                        className=" ml-0 "
                        handleClick={() => {
                          handleDeleteDialog();
                          setCommentId(comment._id);
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages && totalPages > 1 && (
          <CustomPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            className="!pl-0"
          />
        )}

        {/* Add or Edit reply dialog */}
        <EditReply
          open={openReplyDialog}
          handleOpen={handleReplyDialog}
          commentId={commentId}
          reply={reply}
        />

        {/* Delete assignment dialog */}
        {commentId && (
          <DeleteDialog
            openDialog={openDeleteDialog}
            handleOpenDialog={handleDeleteDialog}
            title="Delete Comment"
            description="Are you sure you want to delete this assignment?"
            onCancel={() => {
              handleDeleteDialog();
              setCommentId("");
            }}
            onConfirm={() => {
              if (!commentId || isDeleting) return;
              deleteComment(commentId);
            }}
            isDeleting={isDeleting}
          />
        )}

        {/* View comment details */}
        {viewDetails && commentDetails && (
          <CommentFullDetails
            open={viewDetails}
            handleOpen={handleViewDetails}
            commentData={commentDetails}
          />
        )}
      </div>
    </>
  );
};

export default Comment;
