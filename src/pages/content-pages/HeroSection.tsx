import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
  CustomTextArea,
  CustomButton,
  CustomReactQuill,
} from "@/components/common/Inputs";
import {
  useGetHeroSectionQuery,
  useUpdateHeroSectionMutation,
} from "@/store/apis/content-mangement/hero-section-apis";
import {
  LoadingSpinner,
  PageLoadingSpinner,
} from "@/components/common/LoadingSpinner";
import { showError, strippedHtmlTags } from "@/lib/reusable-funs";

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
    if (!strippedHtmlTags(caption)) return toast.error("Please enter caption");
    if (!description) return toast.error("Please enter description");

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
          <div className="label shrink-0">Caption</div>
          <div className="grow lg:max-w-[47rem]">
            <CustomReactQuill
              maxChars={100}
              text={caption}
              setText={setCaption}
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
