import { useEffect, useState } from "react";
import { IoMdAdd as AddIcon } from "react-icons/io";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageLoadingSpinner } from "@/components/common/LoadingSpinner";
import {
  useDeleteFooterLinkMutation,
  useGetFooterLinksQuery,
} from "@/store/apis/content-mangement/footer-links-apis";
import { DeleteButton, UpdateButton } from "@/components/common/Inputs";
import { CustomButton } from "@/components/common/Inputs";
import FooterLinkForm from "@/components/footer/FooterLinkForm";
import { FooterLinkType } from "@/lib/interfaces-types";
import DeleteDialog from "@/components/common/DeleteDialog";
import { showError } from "@/lib/reusable-funs";
import toast from "react-hot-toast";

function FooterLinks() {
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [selectedLink, setSelectedLink] = useState<null | FooterLinkType>(null);

  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetFooterLinksQuery();

  const [
    deleteLink,
    { isLoading: isDeleting, error: deletionError, isSuccess: isDeleteSuccess },
  ] = useDeleteFooterLinkMutation();

  console.log("Data:", data);
  const footerLinks = data?.data?.footers || [];

  const handleForm = () => {
    setOpenForm((prev) => !prev);
  };
  const handleDeleteDialog = () => {
    setOpenDeleteDialog((prev) => !prev);
  };

  const handleDeleteLink = () => {
    if (selectedLink?._id) {
      deleteLink({ footerLinkId: selectedLink._id });
    }
  };

  useEffect(() => {
    if (deletionError) {
      showError(deletionError);
    }
  }, [deletionError]);

  useEffect(() => {
    if (loadingError) {
      showError(loadingError);
    }
  }, [loadingError]);

  useEffect(() => {
    if (isDeleteSuccess) {
      toast.success("Link deleted successfully");
      handleDeleteDialog();
      setSelectedLink(null);
    }
  }, [isDeleteSuccess]);

  return (
    <>
      <div className="main-container">
        <CustomButton
          className="green-button px-2 py-4"
          handleClick={() => {
            setSelectedLink(null);
            handleForm();
          }}
        >
          <AddIcon size={30} className="p-0 m-0" /> Add new link
        </CustomButton>
        <Table className="custom-table">
          <TableCaption>A list of footer links</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-10">S.No.</TableHead>
              <TableHead className="">Icon</TableHead>
              <TableHead className="">URL</TableHead>
              <TableHead className="">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {footerLinks?.map((link, index) => (
              <TableRow key={link._id}>
                <TableCell className="max-w-10">{index + 1}</TableCell>
                <TableCell className="">
                  <div className="h-10 w-10">
                    <img
                      className="max-w-full"
                      src={link.iconPath}
                      alt={link.iconPath}
                    />
                  </div>
                </TableCell>
                <TableCell>{link.url}</TableCell>
                <TableCell>
                  <div className="flex">
                    <UpdateButton
                      handleClick={() => {
                        setSelectedLink(link);
                        handleForm();
                      }}
                    />

                    <DeleteButton
                      handleClick={() => {
                        setSelectedLink(link);
                        handleDeleteDialog();
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <FooterLinkForm
        open={openForm}
        handleOpen={handleForm}
        linkData={selectedLink}
      />

      <DeleteDialog
        openDialog={openDeleteDialog}
        handleOpenDialog={handleDeleteDialog}
        title="Delete Link"
        description="Are you sure you want to delete this link?"
        onCancel={() => {
          handleDeleteDialog();
          setSelectedLink(null);
        }}
        onConfirm={handleDeleteLink}
        isDeleting={isDeleting}
      />

      {isLoading && (
        <div>
          <PageLoadingSpinner />
        </div>
      )}
    </>
  );
}

export default FooterLinks;
