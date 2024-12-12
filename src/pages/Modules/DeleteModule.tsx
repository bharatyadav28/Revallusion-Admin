// Delete module button
import { useEffect } from "react";
import toast from "react-hot-toast";

import { DeleteButton } from "@/components/common/Inputs";
import { useDeleteModuleMutation } from "@/store/apis/modules-apis";
import { showError } from "@/lib/reusable-funs";

interface Props {
  id?: string;
}
function DeleteModule({ id }: Props) {
  const [
    deleteItem,
    {
      isLoading: isDeleting,
      error: deletionError,
      isSuccess: deletionSuccess,
      data: deleteData,
    },
  ] = useDeleteModuleMutation();

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

export default DeleteModule;
