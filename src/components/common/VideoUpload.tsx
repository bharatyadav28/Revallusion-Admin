// Component for uploading image

import React, { useRef, useState } from "react";
import { DotLoader as UploadSpinner } from "react-spinners";

import { Button } from "../ui/button";
import { videoDurationType } from "@/lib/interfaces-types";
import VideoPlayer from "../VideoPlayer";
import useStream from "@/hooks/use-stream";
import { cdnAddr } from "@/lib/resuable-data";
import { Progress } from "../ui/progress";

interface Props {
  videoSrc: string;
  setVideoSrc: React.Dispatch<React.SetStateAction<string>>;
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  setVideoDuration: React.Dispatch<React.SetStateAction<videoDurationType>>;
}

const VideoUploader: React.FC<Props> = ({
  videoSrc,
  setVideoSrc,
  setVideoDuration,
  uploading,
  setUploading,
}) => {
  const [openPlayer, setOpenPlayer] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenPlayer = () => {
    setOpenPlayer((prev) => !prev);
  };

  // Handle choose file button click
  const handleClick = () => {
    if (!videoSrc) {
      // document.getElementById("videoInput")?.click();
      inputRef.current?.click();
    } else {
      handleOpenPlayer();
    }
  };

  const { handleFileChange, progress } = useStream({
    setFileSrc: setVideoSrc,
    setVideoDuration: setVideoDuration,
    uploading: uploading,
    setUploading: setUploading,
  });

  return (
    <>
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
          accept=".mp4,.m4v,.mkv,.avi,.mov,.wmv,.flv,.webm,.ogg,video/*"
          className="hidden"
          onChange={handleFileChange}
          ref={inputRef}
        />
        {uploading && (
          <div className=" flex items-center lg:flex-row flex-col justify-between gap-2 text-sm mt-1">
            <div className="flex items-center gap-2">
              <div>Please wait while the video is uploading </div>
              <UploadSpinner color="#f1f1f1" size={20} />
            </div>
            <div className="flex items-center gap-2">
              <Progress value={progress} className=" w-[5rem]" />
              <div className="text-sm">{progress}%</div>
            </div>
          </div>
        )}
      </div>

      {openPlayer && (
        <VideoPlayer
          open={openPlayer}
          handleOpen={handleOpenPlayer}
          source={`${cdnAddr}/${videoSrc}/1080p.m3u8`}
        />
      )}
    </>
  );
};

export default VideoUploader;
