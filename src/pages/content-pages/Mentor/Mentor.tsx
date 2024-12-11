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
import {
  CustomInput,
  CustomTextArea,
  CustomButton,
} from "@/components/common/Inputs";
import {
  useGetMentorQuery,
  useUpdateMentorMutation,
} from "@/store/apis/mentor-apis";
import {
  LoadingSpinner,
  PageLoadingSpinner,
} from "@/components/common/LoadingSpinner";
import { toast } from "react-hot-toast";
import { showError } from "@/lib/reusable-funs";
import { UpdateButton, DeleteButton } from "@/components/common/Inputs";
import { networkType } from "@/lib/interfaces-types";
import Network from "./Network";

function HeroSection() {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [about, setAbout] = useState("");
  const [networks, setNetworks] = useState<networkType[]>([]);
  const [open, setOpen] = useState(false);
  const [updateId, setUpdateId] = useState("");

  const handleDialogOpen = () => {
    setOpen((prev) => !prev);
  };

  const allowedNetworks = 3;

  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetMentorQuery();

  const [
    updateMentor,
    { isLoading: isUpdating, error: updateError, isSuccess, data: updateData },
  ] = useUpdateMentorMutation();

  // Handle updation
  const handleSubmit = () => {
    const filteredNetworks = networks.map(({ _id, ...rest }) => rest);
    updateMentor({
      name,
      designation,
      about,
      networks: filteredNetworks,
    });
  };

  // Initialize values while updating
  useEffect(() => {
    if (!isLoading && data) {
      const { name, designation, about, networks } = data?.data?.mentor;
      setName(name);
      setDesignation(designation);
      setAbout(about);
      setNetworks(networks || []);
    }
  }, [data?.data?.mentor, isLoading]);

  // Show errors
  useEffect(() => {
    if (updateError) {
      showError(updateError);
    }
  }, [updateError]);

  useEffect(() => {
    if (loadingError) {
      showError(loadingError);
    }
  }, [loadingError]);

  // Show success message on mutation
  useEffect(() => {
    if (isSuccess && updateData) {
      toast.success(updateData?.message);
    }
  }, [isSuccess]);

  return (
    <>
      <div className="main-container">
        <div className="input-container">
          <div className="label">Name</div>
          <div className="user-input">
            <CustomInput
              maxChars={30}
              text={name}
              setText={setName}
              className="py-5"
              placeholder="Type  name here..."
            />
          </div>
        </div>

        <div className="input-container">
          <div className="label">Designation</div>
          <div className="user-input">
            <CustomInput
              maxChars={30}
              text={designation}
              setText={setDesignation}
              placeholder="Type  designation here..."
            />
          </div>
        </div>

        <div className="input-container">
          <div className="label">About</div>
          <div className="user-input">
            <CustomTextArea
              maxChars={150}
              text={about}
              setText={setAbout}
              className="h-32"
              placeholder="Type details here..."
            />
          </div>
        </div>

        {/* networks */}
        <div className="input-container mt-4 gap-2">
          <div className="label">Network</div>

          <div className=" grow lg:max-w-[47rem] ">
            <Table className="custom-table ">
              <TableCaption>{`A list of Social media followers (${networks.length}/${allowedNetworks})`}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Platform</TableHead>
                  <TableHead className="">Followers</TableHead>
                  <TableHead className="action-btns">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {networks?.map((network: networkType) => (
                  <TableRow key={network.platform}>
                    <TableCell>{network.platform}</TableCell>
                    <TableCell>{network.followers}</TableCell>
                    <TableCell>
                      <UpdateButton
                        handleClick={() => {
                          setOpen(true);
                          if (network._id) setUpdateId(network._id);
                        }}
                      />
                      <DeleteButton
                        handleClick={() => {
                          setNetworks((prev) =>
                            prev.filter((p) => p._id !== network._id)
                          );
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="lg:ml-[17.3rem] flex gap-2">
          <CustomButton
            className="purple-button mt-2 "
            handleClick={handleSubmit}
            disabled={isUpdating}
          >
            {isUpdating ? <LoadingSpinner /> : "Save"}
          </CustomButton>
          <CustomButton
            className="green-button mt-2"
            handleClick={() => {
              if (networks.length >= allowedNetworks) {
                toast.error(
                  `You can't add more than ${allowedNetworks} networks`
                );
                return;
              }
              setOpen(true);
            }}
          >
            {"Add Network"}
          </CustomButton>
        </div>
      </div>

      <Network
        open={open}
        handleOpen={handleDialogOpen}
        networks={networks}
        setNetworks={setNetworks}
        updateId={updateId}
        setUpdateId={setUpdateId}
      />

      {isLoading && (
        <div>
          <PageLoadingSpinner />
        </div>
      )}
    </>
  );
}

export default HeroSection;
