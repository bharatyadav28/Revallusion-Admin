// Delete query button
import { useEffect } from "react";
import toast from "react-hot-toast";

import { DeleteButton } from "@/components/common/Inputs";
import { useDeleteQueryMutation } from "@/store/apis/queries.apis";
import { showError } from "@/lib/reusable-funs";

interface Props {
  id: string;
}
function DeleteQuery({ id }: Props) {
  const [
    deleteItem,
    {
      isLoading: isDeleting,
      error: deletionError,
      isSuccess: deletionSuccess,
      data: deleteData,
    },
  ] = useDeleteQueryMutation();

  const handleDelete = (id?: string) => {
    if (id) {
      deleteItem(id);
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

export default DeleteQuery;
