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

import { useGetFaqsQuery } from "@/store/apis/faq-apis";
import { PageLoadingSpinner } from "@/components/common/LoadingSpinner";
import { faqType } from "@/lib/interfaces-types";
import { useEffect } from "react";
import { showError } from "@/lib/reusable-funs";
import DeleteFaq from "./DeleteFaq";

function ViewFaqs() {
  const navigate = useNavigate();

  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetFaqsQuery();

  useEffect(() => {
    if (loadingError) {
      showError(loadingError);
    }
  }, [loadingError]);

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
                    className="green-button w-[5rem]"
                    handleClick={() => {}}
                  >
                    {faq.status}
                  </CustomButton>
                </TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
