// Menu consisting of all videos

import { useState, useEffect, useMemo } from "react";
import { SearchIcon } from "lucide-react";

import CustomSheet from "./CustomSheet";
import { CustomCheckBox, CustomInput } from "./Inputs";
import { showError } from "@/lib/reusable-funs";
import { LoadingSpinner, TableLoader } from "./LoadingSpinner";
import CustomPagination from "@/components/common/CustomPagination";

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
  useGetVideoListMutation,
  // useGetVideoListQuery,
} from "@/store/apis/library-apis";
import { videoType, courseVideoType } from "@/lib/interfaces-types";
import { CustomButton } from "./Inputs";
import toast from "react-hot-toast";

interface MenuTableProps {
  videos: videoType[];
  newelySelected: videoType[];
  setNewelySelected: React.Dispatch<React.SetStateAction<videoType[]>>;
  isLoading?: boolean;
  isSelected?: boolean;
  remainingCapacity?: number;
}

// Sub table component
function MenuTable({
  videos,
  newelySelected,
  setNewelySelected,
  isLoading,
  isSelected,
  remainingCapacity,
}: MenuTableProps) {
  return (
    <Table className="custom-table ">
      <TableCaption>
        {`A list of  ${isSelected ? "selected" : "all"} videos`}
        {isSelected && ` (${newelySelected?.length}/${remainingCapacity})`}
      </TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead className="!w-[0.5rem]">Select</TableHead>

          <TableHead className="">Video Name</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading ? (
          <TableLoader colSpan={3} />
        ) : (
          videos?.map((video) => (
            <TableRow key={video._id}>
              <TableCell className="">
                <div className="h-5 w-5 mx-auto my-auto">
                  <CustomCheckBox
                    value={
                      newelySelected?.find((v) => v._id === (video?._id || ""))
                        ? true
                        : false
                    }
                    onChange={() => {
                      if (
                        !isSelected &&
                        remainingCapacity &&
                        newelySelected.length >= remainingCapacity
                      ) {
                        toast.error(
                          `You can't add more than ${remainingCapacity} videos`
                        );
                        return;
                      }
                      setNewelySelected((prev) => {
                        if (prev?.find((v) => v._id === (video?._id || ""))) {
                          return prev?.filter(
                            (v) => v._id !== (video?._id || "")
                          );
                        } else {
                          return [...prev, video];
                        }
                      });
                    }}
                    className="h-5 w-5"
                  />
                </div>
              </TableCell>

              <TableCell className="font-medium md:w-[40%]">
                {video.title}
              </TableCell>
              <TableCell className="">{video.description}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

interface Props {
  open: boolean;
  handleOpen: () => void;
  newelySelected: videoType[];
  setNewelySelected: React.Dispatch<React.SetStateAction<videoType[]>>;
  alreadySelected: courseVideoType[] | videoType[];
  handleSubmit: () => void;
  isSubmitting: boolean;
  remainingCapacity: number;
  excludeVideos?: string[] | [];
}

// Main component
function VideoMenu({
  open,
  handleOpen,
  newelySelected,
  setNewelySelected,
  alreadySelected,
  handleSubmit,
  isSubmitting,
  remainingCapacity,
  excludeVideos,
}: Props) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all videos
  // const {
  //   data,
  //   error: loadingError,
  //   isFetching: isLoading,
  // } = useGetVideoListQuery(
  //   `search=${debouncedSearch}&currentPage=${currentPage}`
  // );

  const [fetchVideos, { data, error: loadingError, isLoading }] =
    useGetVideoListMutation();

  const memoizedExcludeVideos = useMemo(
    () => excludeVideos,
    [excludeVideos?.join(",")]
  );

  useEffect(() => {
    fetchVideos({
      searchQuery: `search=${debouncedSearch}&currentPage=${currentPage}`,
      excludeVideos: memoizedExcludeVideos,
    });
  }, [memoizedExcludeVideos, debouncedSearch, currentPage]);

  // Handle error
  useEffect(() => {
    if (loadingError) {
      showError(loadingError);
    }
  }, [loadingError]);

  // Handle debouncing on search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const videos = data?.data?.videos;
  const totalPages = data?.data?.pagesCount;

  // Filter list
  let notSelectedVideos = videos?.filter(
    (video) => !alreadySelected?.find((v) => v._id === video._id)
  );
  notSelectedVideos =
    notSelectedVideos?.filter(
      (video) => !newelySelected?.find((v) => v._id === video._id)
    ) || [];

  return (
    <CustomSheet
      open={open}
      handleOpen={() => {
        setCurrentPage(1);
        setSearch("");
        handleOpen();
      }}
    >
      <div className="uppercase text-lg">Video list</div>

      <div className="main-container mt-4">
        <div className="input-container">
          <div className="label">Search</div>
          <div className="user-input">
            <div className=" max-w-full flex items-center border border-gray-400 rounded-md ps-2 w-full ">
              <SearchIcon size={18} />
              <CustomInput
                text={search}
                setText={setSearch}
                className="py-5 !w-full border-none focus-visible:ring-0 "
                placeholder="Search..."
              />
            </div>
          </div>
        </div>

        {/* Selected videos table */}
        {newelySelected.length > 0 && (
          <div className="input-container mt-4 gap-2">
            <div className="label">Selected</div>

            <div className=" grow lg:max-w-[47rem] ">
              <MenuTable
                videos={newelySelected}
                newelySelected={newelySelected}
                setNewelySelected={setNewelySelected}
                isSelected={true}
                remainingCapacity={remainingCapacity}
              />
            </div>
          </div>
        )}

        {/* Not selected videos table */}
        <div className="input-container mt-4 gap-2">
          <div className="label ">Videos</div>

          <div className=" grow lg:max-w-[47rem] ">
            {notSelectedVideos && (
              <MenuTable
                videos={notSelectedVideos}
                newelySelected={newelySelected}
                setNewelySelected={setNewelySelected}
                isLoading={isLoading}
                isSelected={false}
                remainingCapacity={remainingCapacity}
              />
            )}
          </div>
        </div>

        {/* Save button */}
        <div className="lg:ml-[17.3rem] flex flex-col gap-2">
          {totalPages && totalPages > 1 && (
            <CustomPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              className="!pl-0"
            />
          )}

          <CustomButton
            className="green-button mt-2 "
            handleClick={() => {
              if (newelySelected.length > remainingCapacity) {
                toast.error(
                  `Only ${remainingCapacity} more videos can be added`
                );
                return;
              }
              handleSubmit();
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <LoadingSpinner /> : "Save"}
          </CustomButton>
        </div>

        {}
      </div>

      {/* {isLoading && (
        <div>
          <PageLoadingSpinner />
        </div>
      )} */}
    </CustomSheet>
  );
}

export default VideoMenu;
