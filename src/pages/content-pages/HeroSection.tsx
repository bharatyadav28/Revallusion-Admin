import { useEffect, useState } from "react";

import {
  CustomInput,
  CustomTextArea,
  PurpleButton,
} from "@/components/common/Inputs";

function HeroSection() {
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");

  console.log("Text: ", caption, description);

  const handleSubmit = () => {
    fetch("https://revallusion.onrender.com/api/v1/content/hero-section", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caption,
        description,
      }),
    });
  };

  useEffect(() => {
    fetch("https://revallusion.onrender.com/api/v1/content/hero-section")
      .then((res) => res.json())
      .then(({ data }) => {
        console.log(data);
        setCaption(data.heroSection?.caption);
        setDescription(data.heroSection?.description);
      });
  }, []);

  return (
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

      <PurpleButton className="mt-2 lg:ml-[17.3rem]" handleClick={handleSubmit}>
        Save
      </PurpleButton>
    </div>
  );
}

export default HeroSection;
