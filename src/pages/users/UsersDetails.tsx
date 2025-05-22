import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAppDispatch } from "@/hooks/use-redux";
import { replacePageName } from "@/store/features/generalSlice";
import { useGetUserDetailsQuery } from "@/store/apis/users-apis";
import { showError } from "@/lib/reusable-funs";
import BasicDetails from "@/components/users/BasicDetails";
import UserTransactions from "@/components/users/UserTransactions";
import { useGetPlansQuery } from "@/store/apis/content-mangement/plans-apis";
import { PageLoadingSpinner } from "@/components/common/LoadingSpinner";
import UserAssignments from "./UserAssignments";

function UsersDetails() {
  const dispatch = useAppDispatch();
  const { id: userId } = useParams();

  const {
    data,
    error,
    isFetching: isLoading,
  } = useGetUserDetailsQuery(userId || "", {
    skip: !userId,
  });

  const { data: plansData, isFetching: isPlansLoading } = useGetPlansQuery();

  useEffect(() => {
    dispatch(replacePageName("View user"));
  });
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  const user = data?.data?.user;
  const activeOrder = data?.data?.activeOrder;
  const transactions = data?.data?.user?.transactions;
  const plans = plansData?.data?.plans;

  const plansMapping = new Map();
  plans?.forEach((plan) => {
    plansMapping.set(plan._id, plan.plan_type);
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        <BasicDetails
          user={user}
          activeOrder={activeOrder}
          plansMapping={plansMapping}
          completionDate={user?.certificate?.completionDate}
          completionTime={user?.certificate?.completionTime}
          file={user?.certificate?.path}
        />
        <UserTransactions
          transactions={transactions}
          plansMapping={plansMapping}
        />
        <UserAssignments />
      </div>

      {(isLoading || isPlansLoading) && <PageLoadingSpinner />}
    </>
  );
}

export default UsersDetails;
