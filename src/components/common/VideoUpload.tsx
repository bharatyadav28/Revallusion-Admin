// Component for uploading image

import React from "react";
import toast from "react-hot-toast";
import { DotLoader as UploadSpinner } from "react-spinners";

import { Button } from "../ui/button";

interface Props {
  videoSrc: string;
  setVideoSrc: React.Dispatch<React.SetStateAction<string>>;
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
}
const VideoUploader: React.FC<Props> = ({
  videoSrc,
  setVideoSrc,
  uploading,
  setUploading,
}) => {
  const handleVideoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);

      try {
        const videoExtension = file.name.split(".").pop();

        // Get url to upload
        const response = await fetch("/api/v1/video/get-upload-url", {
          method: "POST",
          body: JSON.stringify({ videoExtension }),
          headers: {
            "Content-Type": "application/json", // Specify the content type
          },
        });

        if (!response.ok) {
          throw new Error("Failed to get upload url");
        }

        const data = await response.json();
        const videoUrl = data?.data?.uploadURL;

        // Upload video to fetched url
        const response2 = await fetch(videoUrl, {
          method: "PUT",
          body: file, // Send the raw file, not FormData
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!response2.ok) {
          throw new Error("Failed to upload video");
        }

        const cleanUrl = new URL(videoUrl);
        cleanUrl.search = ""; // Remove the query string
        const stringUrl = cleanUrl.toString();
        setVideoSrc(stringUrl);
      } catch (error) {
        toast.error(
          error instanceof Error ? error?.message : "Video upload failed"
        );
      } finally {
        setUploading(false);
      }
    }
  };

  // Handle choose file button click
  const handleClick = () => {
    if (!videoSrc) {
      document.getElementById("videoInput")?.click();
    } else {
      window.open(videoSrc);
    }
  };

  return (
    <div className="relative border bottom-1 rounded-sm w-full  group">
      <div className="flex gap-2 items-center border border-gray-400 rounded-md">
        <Button
          onClick={handleClick}
          className="rounded-sm"
          disabled={uploading}
        >
          {videoSrc ? "View file" : "Choose file"}
        </Button>
        <p className="text-sm">
          {uploading
            ? ""
            : videoSrc
            ? videoSrc.split("/").pop()
            : "No file choosen"}{" "}
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        id="videoInput"
        type="file"
        accept="video/mp4,video/x-m4v,video/*"
        className="hidden"
        onChange={handleVideoUpload}
      />
      {uploading && (
        <div className=" flex items-center gap-2 text-sm mt-1">
          <div>Please wait while the video is uploading</div>
          <UploadSpinner color="#f1f1f1" size={20} />{" "}
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
