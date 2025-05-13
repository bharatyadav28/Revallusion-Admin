// View all plans

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
import { UpdateButton } from "@/components/common/Inputs";
import { useGetPlansQuery } from "@/store/apis/content-mangement/plans-apis";
import { secondsToDays, showError } from "@/lib/reusable-funs";
import { planType } from "@/lib/interfaces-types";
import { PageLoadingSpinner } from "@/components/common/LoadingSpinner";
import EditPlan from "./EditPlan";

function Plan() {
  const [updateId, setUpdateId] = useState("");
  const [open, setOpen] = useState(false);

  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetPlansQuery();

  const handleDialogOpen = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (loadingError) {
      showError(loadingError);
    }
  }, [loadingError]);
  return (
    <>
      <div className="main-container">
        <Table className="custom-table">
          <TableCaption>A list of subscription pages</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Plan Name</TableHead>
              <TableHead className="">INR Price</TableHead>
              <TableHead className="">USD Price</TableHead>
              <TableHead className="">Validity</TableHead>
              <TableHead className="">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.data?.plans.map((plan: planType) => (
              <TableRow key={plan._id}>
                <TableCell>{plan.plan_type}</TableCell>
                <TableCell>
                  ₹ {Number(plan.inr_price).toLocaleString("en-US")}
                </TableCell>
                <TableCell>
                  $ {Number(plan.usd_price).toLocaleString("en-US")}
                </TableCell>
                <TableCell>{secondsToDays(plan.validity)} days</TableCell>

                <TableCell>
                  <div className="flex">
                    <UpdateButton
                      handleClick={() => {
                        setOpen(true);
                        setUpdateId(plan._id);
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {isLoading && (
          <div>
            <PageLoadingSpinner />
          </div>
        )}
      </div>

      <EditPlan
        open={open}
        handleOpen={handleDialogOpen}
        updateId={updateId}
        setUpdateId={setUpdateId}
        plans={data?.data?.plans || []}
      />
    </>
  );
}

export default Plan;
