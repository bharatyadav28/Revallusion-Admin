import { useEffect, useState } from "react";
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
import {
  AddButton,
  CustomButton,
  DeleteButton,
  ExpandButton,
} from "@/components/common/Inputs";
import { UpdateButton } from "@/components/common/Inputs";
import { showError } from "@/lib/reusable-funs";
import { TableLoader, LoadingSpinner } from "../common/LoadingSpinner";
import {
  useAddVideoToSectionMutation,
  useDeleteSectionMutation,
  useGetContentQuery,
} from "@/store/apis/primary-dashboard-apis";
import { dashboardSectionType, videoType } from "@/lib/interfaces-types";
import VideoMenu from "../common/VideoMenu";
import CustomTooltip from "../common/CustomTooltip";
import EditSection from "./EditSection";
import DeleteDialog from "../common/DeleteDialog";
import toast from "react-hot-toast";
import SectionVideos from "./SectionVideos";

const Sections = () => {
  const [openSheet, setOpenSheet] = useState(false);
  const [openSectionDialog, setOpenSectionDialog] = useState(false);
  const [selectedSection, setSelectedSection] =
    useState<dashboardSectionType | null>(null);

  const [sectionId, setSectionId] = useState<string | null>(null);
  const [openDeleteDialgo, setOpenDeleteDialog] = useState(false);

  // New selected videos
  const [newelySelected, setNewelySelected] = useState<videoType[]>([]);
  const { data, isFetching: isLoading } = useGetContentQuery();

  // Delete section
  const [
    deleteSection,
    {
      isLoading: isDeleting,
      isSuccess: deletionSuccess,
      data: deletionData,
      error: deletionError,
    },
  ] = useDeleteSectionMutation();

  // Add videos to section
  const [
    addVideos,
    {
      isLoading: isUpdating,
      isSuccess: updationSuccess,
      data: updationData,
      error: updationError,
    },
  ] = useAddVideoToSectionMutation();

  // Handle video menu dialog
  const handleOpenSheet = () => {
    setOpenSheet((prev) => !prev);
    setNewelySelected([]);
  };

  const handleOpenSectionDialog = () => {
    setOpenSectionDialog((prev) => !prev);
  };
  // Open/close delete dialog
  const handleDeleteDialog = () => {
    setOpenDeleteDialog((prev) => !prev);
  };

  const handleDeleteSection = () => {
    if (selectedSection?._id) {
      deleteSection(selectedSection?._id || "");
    }
  };

  // Handle video addition
  const handleVideoSelect = () => {
    if (newelySelected.length === 0) return;

    if (!selectedSection?._id) return;
    addVideos({
      videos: newelySelected?.map((video) => video._id || ""),
      sectionId: selectedSection?._id,
    });
  };

  // Handle success
  useEffect(() => {
    if (updationSuccess) {
      toast.success(updationData.message);
      handleOpenSheet();
      setSelectedSection(null);
    }
  }, [updationSuccess]);

  useEffect(() => {
    if (deletionSuccess) {
      toast.success(deletionData.message);
      setSelectedSection(null);
      handleDeleteDialog();
    }
  }, [deletionSuccess]);

  // Handle errors
  useEffect(() => {
    if (updationError) {
      showError(updationError);
    }
  }, [updationError]);

  useEffect(() => {
    if (deletionError) {
      showError(deletionError);
    }
  }, [deletionError]);

  const sections = data?.data?.content;
  // const allowedSectionVideos = 4;

  const alreadySelected: videoType[] = [];

  if (sections && selectedSection) {
    alreadySelected.push(...selectedSection.videos);
  }

  const excludeVideos =
    sections
      ?.find((section) => section._id === selectedSection?._id)
      ?.videos?.map((video) => video._id || "") || [];

  return (
    <>
      <div className="main-container">
        <CustomButton
          className="green-button px-2 py-4 min-w-[8rem]"
          handleClick={() => {
            handleOpenSectionDialog();
            setSelectedSection(null);
          }}
        >
          {false ? (
            <LoadingSpinner />
          ) : (
            <>
              <AddIcon size={30} className="p-0 m-0" /> Add Section{" "}
            </>
          )}
        </CustomButton>
        <Table className="custom-table">
          <TableCaption>A list of sections</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="">S.no.</TableHead>
              <TableHead className="min-w-[6rem]">Section name</TableHead>
              <TableHead className="min-w-[6rem]">Videos</TableHead>

              <TableHead className="">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && <TableLoader colSpan={5} />}
            {!isLoading &&
              sections?.map((section, index) => {
                return (
                  <>
                    <TableRow>
                      <TableCell>{index + 1}</TableCell>

                      <TableCell>{section.name}</TableCell>
                      <TableCell>{section.videos.length}</TableCell>

                      <TableCell>
                        <div className="flex gap-2 items-center w-min">
                          <ExpandButton
                            handleClick={() => {
                              if (sectionId === section._id) {
                                setSectionId(null);
                                return;
                              }
                              if (section._id) setSectionId(section._id);
                            }}
                            isExpanded={sectionId === section._id}
                          />

                          <CustomTooltip hoverContent="Add Videos">
                            <AddButton
                              className="!bg-[var(--golden)] !hover:bg-[var(--dark-golden)]"
                              handleClick={() => {
                                // if (
                                //   section.videos.length >= allowedSectionVideos
                                // ) {
                                //   return toast.error(
                                //     "Section videos limit reached"
                                //   );
                                // }

                                handleOpenSheet();
                                setSelectedSection(section);
                              }}
                            />
                          </CustomTooltip>

                          <CustomTooltip hoverContent="Update Section Name">
                            <UpdateButton
                              handleClick={() => {
                                handleOpenSectionDialog();
                                setSelectedSection(section);
                              }}
                            />
                          </CustomTooltip>

                          <CustomTooltip hoverContent="Delete Section">
                            <DeleteButton
                              className="ml-0"
                              handleClick={() => {
                                if (isDeleting) return;
                                handleDeleteDialog();
                                setSelectedSection(section);
                              }}
                            />
                          </CustomTooltip>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Section videos */}
                    {sectionId === section._id && (
                      <SectionVideos
                        data={section.videos}
                        // allowedVideos={allowedSectionVideos}
                        sectionId={section._id}
                      />
                    )}
                  </>
                );
              })}
          </TableBody>
        </Table>
      </div>

      <VideoMenu
        open={openSheet}
        handleOpen={handleOpenSheet}
        newelySelected={newelySelected}
        setNewelySelected={setNewelySelected}
        alreadySelected={alreadySelected}
        handleSubmit={handleVideoSelect}
        isSubmitting={isUpdating}
        // remainingCapacity={
        //   allowedSectionVideos - (selectedSection?.videos?.length || 0)
        // }
        excludeVideos={excludeVideos}
      />

      <EditSection
        open={openSectionDialog}
        handleOpen={handleOpenSectionDialog}
        section={selectedSection}
      />

      <DeleteDialog
        openDialog={openDeleteDialgo}
        handleOpenDialog={handleDeleteDialog}
        title="Delete Section"
        description="Are you sure you want to delete this section?"
        onCancel={() => {
          handleDeleteDialog();
          setSelectedSection(null);
        }}
        onConfirm={handleDeleteSection}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default Sections;
