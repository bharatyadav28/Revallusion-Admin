// Menu consisting of all videos

import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";

import CustomSheet from "./CustomSheet";
import { CustomCheckBox, CustomInput } from "./Inputs";
import { showError } from "@/lib/reusable-funs";
import { PageLoadingSpinner } from "./LoadingSpinner";
import { LoadingSpinner } from "./LoadingSpinner";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetVideoListQuery } from "@/store/apis/library-apis";
import { videoType, courseVideoType } from "@/lib/interfaces-types";
import { CustomButton } from "./Inputs";
import toast from "react-hot-toast";

interface MenuTableProps {
  videos: videoType[];
  newelySelected: videoType[];
  setNewelySelected: React.Dispatch<React.SetStateAction<videoType[]>>;
}

// Sub table component
function MenuTable({
  videos,
  newelySelected,
  setNewelySelected,
}: MenuTableProps) {
  return (
    <Table className="custom-table ">
      <TableCaption>{`A list of videos`}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="!w-[0.5rem]">Select</TableHead>
          <TableHead className="">Video Name</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {videos?.map((video) => (
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
            <TableCell className="font-medium">{video.title}</TableCell>
            <TableCell className="">{video.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface Props {
  open: boolean;
  handleOpen: () => void;
  newelySelected: videoType[];
  setNewelySelected: React.Dispatch<React.SetStateAction<videoType[]>>;
  alreadySelected: courseVideoType[];
  handleSubmit: () => void;
  isSubmitting: boolean;
  remainingCapacity: number;
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
}: Props) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Fetch all videos
  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetVideoListQuery(debouncedSearch);

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
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const videos = data?.data?.videos;

  // Filter list
  let notSelectedVideos = videos?.filter(
    (video) => !alreadySelected?.find((v) => v.videoId._id === video._id)
  );
  notSelectedVideos = notSelectedVideos?.filter(
    (video) => !newelySelected?.find((v) => v._id === video._id)
  );

  return (
    <CustomSheet open={open} handleOpen={handleOpen}>
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
              {videos && (
                <MenuTable
                  videos={newelySelected}
                  newelySelected={newelySelected}
                  setNewelySelected={setNewelySelected}
                />
              )}
            </div>
          </div>
        )}

        {/* Not selected videos table */}
        <div className="input-container mt-4 gap-2">
          <div className="label">Videos</div>

          <div className=" grow lg:max-w-[47rem] ">
            {notSelectedVideos && (
              <MenuTable
                videos={notSelectedVideos}
                newelySelected={newelySelected}
                setNewelySelected={setNewelySelected}
              />
            )}
          </div>
        </div>

        {/* Save button */}
        <div className="lg:ml-[17.3rem] flex gap-2">
          <CustomButton
            className="purple-button mt-2 "
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
      </div>

      {isLoading && (
        <div>
          <PageLoadingSpinner />
        </div>
      )}
    </CustomSheet>
  );
}

export default VideoMenu;
