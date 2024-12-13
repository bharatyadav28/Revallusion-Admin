import { useEffect, useState } from "react";

import {
  CustomInput,
  CustomTextArea,
  CustomButton,
} from "@/components/common/Inputs";
import {
  useGetHeroSectionQuery,
  useUpdateHeroSectionMutation,
} from "@/store/apis/content-mangement/hero-section-apis";
import {
  LoadingSpinner,
  PageLoadingSpinner,
} from "@/components/common/LoadingSpinner";
import { toast } from "react-hot-toast";
import { showError } from "@/lib/reusable-funs";

function HeroSection() {
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");

  const {
    data,
    error: loadingError,
    isFetching: isLoading,
  } = useGetHeroSectionQuery();
  const [
    updateHero,
    { isLoading: isUpdating, error: updateError, isSuccess, data: updateData },
  ] = useUpdateHeroSectionMutation();

  const handleSubmit = () => {
    updateHero({
      caption,
      description,
    });
  };

  useEffect(() => {
    if (!isLoading && data) {
      const { caption, description } = data?.data?.heroSection;
      setCaption(caption);
      setDescription(description);
    }
  }, [data?.data?.heroSection, isLoading]);

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

  useEffect(() => {
    if (isSuccess && updateData) {
      toast.success(updateData?.message);
    }
  }, [isSuccess]);

  return (
    <>
      <div className="main-container">
        <div className="input-container">
          <div className="label">Caption</div>
          <div className="user-input">
            <CustomInput
              maxChars={100}
              text={caption}
              setText={setCaption}
              className="py-5"
            />
          </div>
        </div>

        <div className="input-container">
          <div className="label">Description</div>
          <div className="user-input">
            <CustomTextArea
              maxChars={200}
              text={description}
              setText={setDescription}
              className="h-32"
            />
          </div>
        </div>

        <CustomButton
          className="purple-button mt-2 lg:ml-[17.3rem]"
          handleClick={handleSubmit}
          disabled={isUpdating}
        >
          {isUpdating ? <LoadingSpinner /> : "Save"}
        </CustomButton>
      </div>

      {isLoading && (
        <div>
          <PageLoadingSpinner />
        </div>
      )}
    </>
  );
}

export default HeroSection;
