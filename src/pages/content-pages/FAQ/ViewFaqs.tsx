// View all faqs data
import { useEffect, useState } from "react";
import { CustomButton, UpdateButton } from "@/components/common/Inputs";
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
import { useGetFaqsQuery } from "@/store/apis/content-mangement/faq-apis";
import { PageLoadingSpinner } from "@/components/common/LoadingSpinner";
import { faqType } from "@/lib/interfaces-types";
import { showError } from "@/lib/reusable-funs";
import DeleteFaq from "./DeleteFaq";
import CustomPagination from "@/components/common/CustomPagination";

function ViewFaqs() {
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  let query = "";
  if (currentPage) query += `currentPage=${currentPage}`;

  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetFaqsQuery(query);

  // Show error
  useEffect(() => {
    if (loadingError) {
      showError(loadingError);
    }
  }, [loadingError]);

  const totalPages = data?.data?.pagesCount;
  const noFaqs = data?.data?.faqs?.length == 0;

  return (
    <>
      <div className="main-container">
        <CustomButton
          className="green-button px-2 py-4"
          handleClick={() => {
            navigate("/faq/add");
          }}
        >
          <AddIcon size={30} className="p-0 m-0" /> Add Faq
        </CustomButton>

        <Table className="custom-table">
          <TableCaption>A list of FAQs</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="w-[12rem]">Status</TableHead>
              <TableHead className="w-[15rem]">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.data?.faqs.map((faq: faqType) => (
              <TableRow key={faq._id}>
                <TableCell className="min-w-[10rem]">{faq.title}</TableCell>
                <TableCell>
                  <CustomButton
                    className={`${
                      faq.status === "Active" ? "green-button" : "red-button"
                    }  w-[5rem]`}
                    handleClick={() => {}}
                  >
                    {faq.status}
                  </CustomButton>
                </TableCell>
                <TableCell>
                  <div className="flex">
                    <UpdateButton
                      handleClick={() => {
                        navigate(`/faq/${faq._id}`, {
                          state: {
                            isEdit: true,
                            faq: faq,
                          },
                        });
                      }}
                    />

                    <DeleteFaq id={faq._id || ""} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!noFaqs && totalPages && totalPages > 1 && (
          <CustomPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            className="!pl-0"
          />
        )}
      </div>

      {isLoading && (
        <div>
          <PageLoadingSpinner />
        </div>
      )}
    </>
  );
}

export default ViewFaqs;
