import { useEffect } from "react";
import toast from "react-hot-toast";

import { DeleteButton } from "@/components/common/Inputs";
import { useDeleteFaqMutation } from "@/store/apis/faq-apis";
import { showError } from "@/lib/reusable-funs";

interface Props {
  id: string;
}
function DeleteFaq({ id }: Props) {
  const [
    deleteFaq,
    {
      isLoading: isDeleting,
      error: deletionError,
      isSuccess: deletionSuccess,
      data: deleteData,
    },
  ] = useDeleteFaqMutation();

  const handleDelete = (id?: string) => {
    if (id) {
      deleteFaq(id);
    }
  };

  useEffect(() => {
    if (deletionSuccess) {
      toast.success(deleteData.message);
    }
  }, [deletionSuccess]);

  useEffect(() => {
    if (deletionError) {
      showError(deletionError);
    }
  }, [deletionError]);

  return (
    <DeleteButton
      handleClick={() => handleDelete(id)}
      isDeleting={isDeleting}
    />
  );
}

export default DeleteFaq;
