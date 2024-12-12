// View all modules

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
import { useGetModulesQuery } from "@/store/apis/modules-apis";
import { showError } from "@/lib/reusable-funs";
import { moduleType } from "@/lib/interfaces-types";
import { PageLoadingSpinner } from "@/components/common/LoadingSpinner";

function StaticPages() {
  const navigate = useNavigate();

  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetModulesQuery();

  // Show error
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
            navigate("/modules/add");
          }}
        >
          <AddIcon size={30} className="p-0 m-0" /> Add Module
        </CustomButton>
        <Table className="custom-table">
          <TableCaption>A list of modules</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="">Description</TableHead>
              <TableHead className="">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.data?.modules.map((module: moduleType) => (
              <TableRow key={module._id}>
                <TableCell>{module.name}</TableCell>
                <TableCell className="min-w-[10rem] ">
                  {module.description}
                </TableCell>

                <TableCell>
                  <div className="flex">
                    <UpdateButton
                      handleClick={() => {
                        navigate(`/modules/${module._id}`, {
                          state: {
                            isEdit: true,
                            module,
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
