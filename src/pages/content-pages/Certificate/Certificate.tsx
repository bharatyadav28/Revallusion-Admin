import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomInput } from "@/components/common/Inputs";
import { UpdateButton, DeleteButton } from "@/components/common/Inputs";
import { CustomButton } from "@/components/common/Inputs";
import {
  PageLoadingSpinner,
  LoadingSpinner,
} from "@/components/common/LoadingSpinner";
import KeyPoint from "./KeyPoint";
import {
  useGetCertificateQuery,
  useUpdateCertificateMutation,
} from "@/store/apis/certificate-apis";
import { showError } from "@/lib/reusable-funs";
import ImageUploader from "@/components/common/ImageUpload";

function Certificate() {
  const [caption, setCaption] = useState("");
  const [key_points, setKeyPoints] = useState<string[]>([]);
  const [image, setImage] = useState("");
  const [updateId, setUpdateId] = useState("");

  const allowedKeyPoints = 5;

  const [open, setOpen] = useState(false);
  const handleDialogOpen = () => {
    setOpen((prev) => !prev);
  };

  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetCertificateQuery();

  const [
    updateCertificate,
    { isLoading: isUpdating, error: updateError, isSuccess, data: updateData },
  ] = useUpdateCertificateMutation();

  // Handle updation
  const handleSubmit = () => {
    updateCertificate({
      caption,
      key_points,
      image,
    });
  };
  console.log("image", image);

  // Initialize values while updating
  useEffect(() => {
    if (!isLoading && data) {
      const { caption, key_points, image } = data?.data?.certificate;
      setCaption(caption);
      setKeyPoints(key_points || []);
      setImage(image);
    }
  }, [data?.data?.certificate, isLoading]);

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
          <div className="label">Image</div>
          <div className="user-input ">
            <ImageUploader imageSrc={image} setImageSrc={setImage} />
          </div>
        </div>

        <div className="input-container">
          <div className="label">Caption</div>
          <div className="user-input">
            <CustomInput
              maxChars={30}
              text={caption}
              setText={setCaption}
              className="py-5"
              placeholder="Type caption here..."
            />
          </div>
        </div>

        <div className="input-container mt-4 gap-2">
          <div className="label">Key points</div>
          <div className=" grow lg:max-w-[47rem] ">
            <Table className="custom-table !rounded-[100rem] ">
              <TableCaption>{`A list of certficate key points (${key_points.length}/${allowedKeyPoints})`}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Key point</TableHead>
                  <TableHead className="action-btns">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {key_points?.map((point: string, index) => (
                  <TableRow key={point}>
                    <TableCell>{point}</TableCell>
                    <TableCell>
                      <UpdateButton
                        handleClick={() => {
                          setOpen(true);
                          setUpdateId(String(index));
                        }}
                      />
                      <DeleteButton
                        handleClick={() => {
                          setKeyPoints((prev) =>
                            prev.filter((_, i) => i !== index)
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
              if (key_points.length >= allowedKeyPoints) {
                toast.error(
                  `You can't add more than ${allowedKeyPoints} networks`
                );
                return;
              }
              setOpen(true);
            }}
          >
            {"Add key point"}
          </CustomButton>
        </div>

        <KeyPoint
          open={open}
          handleOpen={handleDialogOpen}
          keyPoints={key_points}
          setKeyPoints={setKeyPoints}
          updateId={updateId}
          setUpdateId={setUpdateId}
        />

        {isLoading && (
          <div>
            <PageLoadingSpinner />
          </div>
        )}
      </div>
    </>
  );
}

export default Certificate;
