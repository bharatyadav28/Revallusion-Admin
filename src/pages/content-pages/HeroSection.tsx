import { useEffect, useState } from "react";

import {
  CustomInput,
  CustomTextArea,
  PurpleButton,
} from "@/components/common/Inputs";
import {
  useGetHeroSectionQuery,
  useUpdateHeroSectionMutation,
} from "@/store/apis/content-management";
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

  console.log("data: ", data, isLoading);

  useEffect(() => {
    console.log("use Effect");
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
      <div className="bg-[hsl(var(--border));] pt-8 pb-10 px-6 rounded-sm flex flex-col gap-5">
        <div className="flex w-full lg:flex-row flex-col lg:gap-0 gap-2">
          <div className="lg:w-[17.3rem] w-auto  font-medium">Caption</div>
          <div className="grow max-w-[47rem]">
            <CustomInput
              maxChars={30}
              text={caption}
              setText={setCaption}
              className="py-5"
            />
          </div>
        </div>

        <div className="flex w-full lg:flex-row flex-col lg:gap-0 gap-2">
          <div className="lg:w-[17.3rem] w-auto font-medium ">Description</div>
          <div className="grow max-w-[47rem] flex flex-col">
            <CustomTextArea
              maxChars={50}
              text={description}
              setText={setDescription}
              className="h-32"
            />
          </div>
        </div>

        <PurpleButton
          className="mt-2 lg:ml-[17.3rem]"
          handleClick={handleSubmit}
          disabled={isUpdating}
        >
          {isUpdating ? <LoadingSpinner /> : "Save"}
        </PurpleButton>
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
