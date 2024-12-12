// Delete carousal button
import { useEffect } from "react";
import toast from "react-hot-toast";

import { DeleteButton } from "@/components/common/Inputs";
import { useDeleteCarousalMutation } from "@/store/apis/content-mangement/carousal-apis";
import { showError } from "@/lib/reusable-funs";

interface Props {
  id: string;
}
function DeleteCarousal({ id }: Props) {
  const [
    deleteFaq,
    {
      isLoading: isDeleting,
      error: deletionError,
      isSuccess: deletionSuccess,
      data: deleteData,
    },
  ] = useDeleteCarousalMutation();

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

export default DeleteCarousal;
