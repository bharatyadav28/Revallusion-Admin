// View all user queries

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "lucide-react";
import { IoMdAdd as AddIcon } from "react-icons/io";
import DeleteDialog from "@/components/common/DeleteDialog";

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
  CustomButton,
  CustomInput,
  DeleteButton,
  UpdateButton,
  ViewButton,
} from "@/components/common/Inputs";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "@/store/apis/users-apis";
import { useGetPlansQuery } from "@/store/apis/content-mangement/plans-apis";
import { showError } from "@/lib/reusable-funs";
import { userDetailsType } from "@/lib/interfaces-types";
import { TableLoader } from "@/components/common/LoadingSpinner";
import CustomPagination from "@/components/common/CustomPagination";
import EmptyValue from "@/components/common/EmptyValue";
import UserForm from "@/components/users/UserForm";
import toast from "react-hot-toast";

// import DeleteQuery from "./DeleteQuery";

function UsersList() {
  const [search, setSearch] = useState("");
  const [deboounceSearch, setDebounceSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openSheet, setOpenSheet] = useState(false);
  const [openDeleteDialgo, setOpenDeleteDialog] = useState(false);

  const [selectedUser, setSelectedUser] = useState<userDetailsType | null>(
    null
  );
  const handleDeleteDialog = () => {
    setOpenDeleteDialog((prev) => !prev);
  };

  const navigate = useNavigate();

  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetUsersQuery(`search=${deboounceSearch}&currentPage=${currentPage}`);

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const {
    data: plansData,
    error: planLoadingError,
    isFetching: isPlansLoading,
  } = useGetPlansQuery();

  const handleOpenSheet = () => {
    setOpenSheet((prev) => !prev);
  };

  const handleUserDelete = async () => {
    if (!selectedUser?._id || isDeleting) return;

    const response = await deleteUser(selectedUser._id);

    if (response?.error) showError(response.error);
    else {
      toast.success(response?.data?.message);
      handleDeleteDialog();
      setSelectedUser(null);
    }
  };

  // Show error
  useEffect(() => {
    if (loadingError) {
      showError(loadingError);
    }
  }, [loadingError]);

  useEffect(() => {
    if (planLoadingError) {
      showError(planLoadingError);
    }
  }, [planLoadingError]);

  // Debouncing on search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const totalPages = data?.data?.pagesCount || 1;
  const isPageLoading = isLoading || isPlansLoading;

  return (
    <>
      <div className="main-container">
        <div className="flex gap-2 items-center">
          <div className="w-[20rem] max-w-full flex items-center border border-gray-400 rounded-md ps-2 ">
            <SearchIcon size={18} />
            <CustomInput
              text={search}
              setText={setSearch}
              className="py-5 border-none focus-visible:ring-0 "
              placeholder="Search..."
            />
          </div>

          <CustomButton
            className="green-button ps-2 pr-3 py-5"
            handleClick={() => {
              handleOpenSheet();
              setSelectedUser(null);
            }}
          >
            <AddIcon size={30} className="p-0 m-0" /> Add User
          </CustomButton>
        </div>

        <Table className="custom-table">
          <TableCaption>A list of user queries</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="">Email</TableHead>
              <TableHead className="">Mobile no</TableHead>
              <TableHead className="">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isPageLoading && <TableLoader colSpan={4} />}
            {!isPageLoading &&
              data?.data?.users?.map((user: userDetailsType) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name || <EmptyValue />}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mobile || <EmptyValue />}</TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <ViewButton
                        handleClick={() => {
                          navigate(`/users/${user._id}`);
                        }}
                      />
                      <UpdateButton
                        handleClick={() => {
                          setOpenSheet(true);
                          setSelectedUser(user);
                          //   setOpen(true);
                          //   setUpdateId(String(index));
                        }}
                      />
                      <DeleteButton
                        className="ml-0"
                        handleClick={() => {
                          handleDeleteDialog();
                          setSelectedUser(user);
                        }}
                        isDeleting={false}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <CustomPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        )}
      </div>
      <UserForm
        open={openSheet}
        handleOpen={handleOpenSheet}
        plans={plansData?.data?.plans}
        user={selectedUser}
        setUser={setSelectedUser}
      />
      <DeleteDialog
        openDialog={openDeleteDialgo}
        handleOpenDialog={handleDeleteDialog}
        title="Delete User"
        description="Are you sure you want to delete this user?"
        onCancel={() => {
          handleDeleteDialog();
          setSelectedUser(null);
        }}
        onConfirm={handleUserDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}

export default UsersList;
