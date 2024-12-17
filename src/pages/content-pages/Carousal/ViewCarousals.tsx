// View all carousals data
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { CustomButton } from "@/components/common/Inputs";
import { UpdateButton } from "@/components/common/Inputs";
import { useGetCarousalQuery } from "@/store/apis/content-mangement/carousal-apis";
import { showError } from "@/lib/reusable-funs";
import { carousalType } from "@/lib/interfaces-types";
import { PageLoadingSpinner } from "@/components/common/LoadingSpinner";
import DeleteCarousal from "./DeleteCarousal";

function ViewCarousal() {
  const navigate = useNavigate();

  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetCarousalQuery();

  useEffect(() => {
    if (loadingError) {
      showError(loadingError);
    }
  }, [loadingError]);
  return (
    <>
      <div className="main-container">
        {/* <CustomButton
          className="green-button px-2 py-4"
          handleClick={() => {
            navigate("/carousals/add");
          }}
        >
          <AddIcon size={30} className="p-0 m-0" /> Add Carousal
        </CustomButton> */}

        <Table className="custom-table">
          <TableCaption>A list of Carosuals</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Caption</TableHead>
              <TableHead className="">Description</TableHead>
              <TableHead className="">Sequence</TableHead>

              <TableHead className="w-[15rem]">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.data?.carousals.map((carousal: carousalType) => (
              <TableRow key={carousal._id}>
                <TableCell>{carousal.caption}</TableCell>
                <TableCell className="min-w-[10rem]">
                  {carousal.description}
                </TableCell>
                <TableCell className="text-center w-[4rem]">
                  {carousal.sequence || 0}
                </TableCell>

                <TableCell>
                  <div className="flex">
                    <UpdateButton
                      handleClick={() => {
                        navigate(`/carousals/${carousal._id}`, {
                          state: {
                            isEdit: true,
                            carousal: carousal,
                          },
                        });
                      }}
                    />

                    {/* <DeleteCarousal id={carousal._id || ""} /> */}
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
    </>
  );
}

export default ViewCarousal;
