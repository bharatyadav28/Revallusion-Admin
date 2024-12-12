// View all static pages : Terms and Conditions, Privacy Policy, Refund Policy, Pricing Policy

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
import { useGetPagesQuery } from "@/store/apis/content-mangement/static-pages-apis";
import { showError } from "@/lib/reusable-funs";
import { staticPageType } from "@/lib/interfaces-types";
import { PageLoadingSpinner } from "@/components/common/LoadingSpinner";

function StaticPages() {
  const navigate = useNavigate();

  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetPagesQuery();

  useEffect(() => {
    if (loadingError) {
      showError(loadingError);
    }
  }, [loadingError]);
  return (
    <>
      <div className="main-container">
        <Table className="custom-table">
          <TableCaption>A list of static pages</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Page Title</TableHead>
              <TableHead className="">Page Type</TableHead>
              <TableHead className="">Status</TableHead>

              <TableHead className="">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.data?.pages.map((page: staticPageType) => (
              <TableRow key={page._id}>
                <TableCell>{page.title}</TableCell>
                <TableCell className="min-w-[10rem] ">{page.type}</TableCell>
                <TableCell className="text-center w-[6rem]">
                  <CustomButton
                    className="green-button w-[5rem]"
                    handleClick={() => {}}
                  >
                    {page.status}
                  </CustomButton>
                </TableCell>

                <TableCell>
                  <div className="flex">
                    <UpdateButton
                      handleClick={() => {
                        navigate(`/static-pages/${page._id}`, {
                          state: {
                            page,
                          },
                        });
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
    </>
  );
}

export default StaticPages;