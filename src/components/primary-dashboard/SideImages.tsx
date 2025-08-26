import { useEffect, useState } from "react";

import ImageUploader from "../common/ImageUpload";
import {
  useUpdateSideImagesMutation,
  useGetCarousalQuery,
} from "@/store/apis/primary-dashboard-apis";
import { CustomButton } from "../common/Inputs";
import { showError } from "@/lib/reusable-funs";
import toast from "react-hot-toast";
import { LoadingSpinner } from "../common/LoadingSpinner";

function SideImages() {
  const [leftImage, setLeftImage] = useState<string>("");
  const [rightImage, setRightImage] = useState<string>("");

  const { data } = useGetCarousalQuery();

  const [
    updateSideImage,
    {
      isLoading: isUpdating,
      isSuccess: updationSuccess,
      error: updationError,
      data: updationData,
    },
  ] = useUpdateSideImagesMutation();

  const handleSave = () => {
    updateSideImage({ leftImage, rightImage });
  };

  useEffect(() => {
    let error = updationError;
    if (error) {
      showError(error);
    }
  }, [updationError]);

  useEffect(() => {
    if (updationData?.message) {
      toast.success(updationData?.message);
    }
  }, [updationSuccess]);

  useEffect(() => {
    console.log("data?.data?.sideImage", data?.data?.sideImages);
    if (data?.data?.sideImages) {
      setLeftImage(data?.data?.sideImages.dashboardLeftImage);
      setRightImage(data?.data?.sideImages.dashboardRightImage);
    }
  }, [data]);

  return (
    <div className="main-container">
      <div className="input-container">
        <div className="label">Left Image</div>
        <div className="user-input ">
          <ImageUploader
            imageSrc={leftImage}
            setImageSrc={setLeftImage}
            alt="Left Image"
            folder="Thumbnails"
          />
        </div>
      </div>

      <div className="input-container">
        <div className="label">Right Image</div>
        <div className="user-input ">
          <ImageUploader
            imageSrc={rightImage}
            setImageSrc={setRightImage}
            alt="Right Image"
            folder="Thumbnails"
          />
        </div>
      </div>

      <div className="lg:ml-[17.3rem] flex gap-2">
        <CustomButton className="green-button mt-2" handleClick={handleSave}>
          {isUpdating ? <LoadingSpinner /> : "Save"}
        </CustomButton>
      </div>
    </div>
  );
}

export default SideImages;
