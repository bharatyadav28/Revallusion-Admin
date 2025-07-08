// View all user queries

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "lucide-react";
import { IoReload as ReloadIcon } from "react-icons/io5";
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
  CustomInput,
  CustomSelectSeperate,
  ViewButton,
} from "@/components/common/Inputs";
import {
  useGetUsersQuery,
  useRestoreUserMutation,
} from "@/store/apis/users-apis";
import { useGetPlansQuery } from "@/store/apis/content-mangement/plans-apis";
import { showError } from "@/lib/reusable-funs";
import { userDetailsType } from "@/lib/interfaces-types";
import { TableLoader } from "@/components/common/LoadingSpinner";
import CustomPagination from "@/components/common/CustomPagination";
import EmptyValue from "@/components/common/EmptyValue";
import UserForm from "@/components/users/UserForm";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { setSelectedPlan } from "@/store/features/selectedPlanSlice";
import { Button } from "@/components/ui/button";

// import DeleteQuery from "./DeleteQuery";

function DeletedUsers() {
  const [search, setSearch] = useState("");
  const [deboounceSearch, setDebounceSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openSheet, setOpenSheet] = useState(false);
  const [openRestoreDialgo, setOpenRestoreDialog] = useState(false);

  const selectedPlan = useAppSelector(
    (state) => state.selectedPlan.selectedPlan
  );
  const [selectedUser, setSelectedUser] = useState<userDetailsType | null>(
    null
  );
  const handleRestoreDialog = () => {
    setOpenRestoreDialog((prev) => !prev);
  };

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetUsersQuery(
    `search=${deboounceSearch}&currentPage=${currentPage}&selectedPlan=${selectedPlan}&isDeleted=yes`
  );

  const [restore, { isLoading: isRestoring }] = useRestoreUserMutation();

  const {
    data: plansData,
    error: planLoadingError,
    isFetching: isPlansLoading,
  } = useGetPlansQuery();

  const plans = plansData?.data?.plans;
  const plansMenu = [
    {
      key: "No filter",
      value: "clear",
    },
    {
      key: "No plan",
      value: "noPlan",
    },
  ];
  const plansFiltered = plans?.map((plan) => ({
    key: plan.plan_type,
    value: plan._id,
  }));
  if (plansFiltered) plansMenu.push(...plansFiltered);

  const getPlanName = (planId: string | undefined) => {
    const plan = plans?.find((plan) => plan._id == planId);
    return plan?.plan_type;
  };

  const handleOpenSheet = () => {
    setOpenSheet((prev) => !prev);
  };

  const handleUserDelete = async () => {
    if (!selectedUser?._id || isRestoring) return;

    const response = await restore(selectedUser._id);

    if (response?.error) showError(response.error);
    else {
      toast.success(response?.data?.message);
      handleRestoreDialog();
      setSelectedUser(null);
    }
  };

  const handleSelectedPlan: React.Dispatch<React.SetStateAction<string>> = (
    e
  ) => {
    const value = typeof e === "function" ? e(selectedPlan) : e;

    dispatch(setSelectedPlan(value)); // Update Redux store
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

  useEffect(() => {
    if (selectedPlan) {
      setCurrentPage(1);
    }
  }, [selectedPlan]);

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

          {plansMenu && (
            <CustomSelectSeperate
              menu={plansMenu}
              value={selectedPlan}
              onChange={handleSelectedPlan}
              placeholder="Filter by plan"
              className="max-w-[15rem]"
            />
          )}
        </div>

        <Table className="custom-table">
          <TableCaption>A list of users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="">Email</TableHead>
              <TableHead className="">Mobile no</TableHead>
              <TableHead className="">Plan</TableHead>
              <TableHead className="">Status</TableHead>
              <TableHead className="">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isPageLoading && <TableLoader colSpan={6} />}
            {!isPageLoading &&
              data?.data?.users?.map((user: userDetailsType) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name || <EmptyValue />}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mobile || <EmptyValue />}</TableCell>
                  <TableCell>
                    {user?.plan ? getPlanName(user?.plan) : <EmptyValue />}
                  </TableCell>

                  <TableCell>
                    {user?.plan && user?.certificates ? (
                      user.certificates?.length > 0 ? (
                        "Completed"
                      ) : (
                        "Active"
                      )
                    ) : (
                      <EmptyValue />
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <ViewButton
                        handleClick={() => {
                          navigate(`/users/${user._id}`);
                        }}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className={`green-button`}
                        onClick={() => {
                          handleRestoreDialog();
                          setSelectedUser(user);
                        }}
                      >
                        <ReloadIcon size={20} />
                      </Button>
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
        openDialog={openRestoreDialgo}
        handleOpenDialog={handleRestoreDialog}
        title="Restore User"
        description="Are you sure you want to restore this user?"
        onCancel={() => {
          handleRestoreDialog();
          setSelectedUser(null);
        }}
        onConfirm={handleUserDelete}
        isDeleting={isRestoring}
        Icon={ReloadIcon}
      />
    </>
  );
}

export default DeletedUsers;
