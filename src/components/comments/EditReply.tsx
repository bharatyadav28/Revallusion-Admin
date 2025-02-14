import { useEffect, useState } from "react";

import { CustomDialog } from "../common/CustomDialog";
import { CustomButton, CustomTextArea } from "@/components/common/Inputs";

import toast from "react-hot-toast";
import { showError } from "@/lib/reusable-funs";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useReplyToCommentMutation } from "@/store/apis/comment-apis";

interface Props {
  open: boolean;
  handleOpen: () => void;
  commentId: string;
  reply: string | "";
}
function EditReply({ open, handleOpen, commentId, reply }: Props) {
  const [commentReply, setCommentReply] = useState("");

  // Assignment score updation
  const [
    replyToComment,
    {
      isLoading: isUpdating,
      isSuccess: isUpdationSuccess,
      error: updationError,
      data: updationData,
    },
  ] = useReplyToCommentMutation();

  const handleSubmit = () => {
    if (isUpdating) return;
    replyToComment({
      id: commentId,
      reply: commentReply,
    });
  };

  // Handle updation success
  useEffect(() => {
    if (isUpdationSuccess && updationData) {
      toast.success(updationData.message);
      handleOpen();
    }
  }, [isUpdationSuccess]);

  // Handle updation error
  useEffect(() => {
    if (updationError) {
      showError(updationError);
    }
  }, [updationError]);

  useEffect(() => {
    setCommentReply(reply);
  }, [reply]);

  return (
    <CustomDialog open={open} handleOpen={handleOpen} className="w-[33rem]">
      <div className="text-[1.5rem] font-medium h-max text-center">
        {reply ? "Edit" : "Add"} Reply
      </div>

      <div className="main-container !bg-[var(--dark-black)] !py-8">
        <div className="flex flex-col gap-2">
          <div className="label">Message</div>
          <div className="user-input">
            <CustomTextArea
              text={commentReply}
              setText={setCommentReply}
              placeholder="Type message here..."
              className="min-h-[8rem]"
            />
          </div>
        </div>

        <CustomButton className="green-button mt-2" handleClick={handleSubmit}>
          {isUpdating ? <LoadingSpinner /> : "Update"}
        </CustomButton>
      </div>
    </CustomDialog>
  );
}

export default EditReply;
