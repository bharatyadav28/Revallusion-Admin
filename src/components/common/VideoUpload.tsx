// Component for uploading image

import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { DotLoader as UploadSpinner } from "react-spinners";

import { Button } from "../ui/button";
import { calculateDuration, extractVideoURLKey } from "@/lib/reusable-funs";
import { videoDurationType } from "@/lib/interfaces-types";
import VideoPlayer from "../VideoPlayer";

interface Props {
  videoSrc: string;
  setVideoSrc: React.Dispatch<React.SetStateAction<string>>;
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  setVideoDuration: React.Dispatch<React.SetStateAction<videoDurationType>>;
}
interface urlType {
  partNumber: number;
  url: string;
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

  const abortMultipartUpload = async (uploadId: string, key: string) => {
    try {
      const abortResponse = await fetch("/api/v1/video/uploads/abort", {
        method: "POST",
        body: JSON.stringify({ uploadId, key }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!abortResponse.ok) {
        throw new Error("Failed to abort multipart upload");
      }

      const abortData = await abortResponse.json();
      // console.log("Abort response:", abortData);
      return abortData;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to abort upload"
      );
      throw error;
    }
  };

  const handleOpenPlayer = () => {
    setOpenPlayer((prev) => !prev);
  };

  const handleVideoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];

    if (file) {
      const fileSize = file.size;
      const fileSizeInMB = file.size / (1024 * 1024);

      // TODO: Remove in production;
      if (fileSizeInMB > 150) {
        toast.error("For free aws tier, video size should be less than 150MB");
        return;
      }

      setUploading(true);
      calculateDuration({ file, setDuration: setVideoDuration });

      try {
        const videoExtension = file.name.split(".").pop();

        let stringUrl = "";
        if (fileSizeInMB <= 150) {
          console.log("Single upload");
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
          stringUrl = cleanUrl.toString();
        } else {
          console.log("Multi upload");
          const CHUNK_SIZE = 25 * 1024 * 1024; // 25 MB
          let uploadId;
          let key;

          // Multi part upload
          try {
            // Initial multipart upload
            const initialResponse = await fetch(
              "/api/v1/video/uploads/initiate",
              {
                method: "POST",
                body: JSON.stringify({ videoExtension }),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (!initialResponse.ok) {
              throw new Error("Failed to upload ");
            }

            const initialData = await initialResponse.json();
            uploadId = initialData?.data?.uploadId;
            key = initialData?.data?.key;

            // Fetch signed urls for uploading chunks
            const totalParts = Math.ceil(fileSize / CHUNK_SIZE);
            console.log("Total parts: ", totalParts);

            const urlsResponse = await fetch(
              "/api/v1/video/uploads/generate-urls",
              {
                method: "POST",
                body: JSON.stringify({ uploadId, key, partCount: totalParts }),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (!urlsResponse.ok) {
              throw new Error("Failed to generate urls ");
            }
            const { data: urlsData } = await urlsResponse.json();

            interface presignedUrls {
              partNumber: number;
              url: string;
            }
            const presignedUrls: presignedUrls[] = urlsData.urls;
            const completedParts = [];

            for (let i = 0; i < totalParts; i++) {
              const start = i * CHUNK_SIZE;
              const end = Math.min(file.size, start + CHUNK_SIZE);
              const chunk = file.slice(start, end);
              const partNumber = i + 1;

              const url = presignedUrls?.find(
                (u: urlType) => u.partNumber === partNumber
              )?.url;

              if (!url) throw new Error(`Missing URL for part ${partNumber}`);

              const uploadResponse = await fetch(url || "", {
                method: "PUT",
                body: chunk,
                headers: { "Content-Type": file.type, Accept: "/" },
              });
              if (!uploadResponse.ok) {
                throw new Error("Failed to upload video");
              }
              let eTag = uploadResponse.headers.get("etag");
              if (!eTag) throw new Error(`Missing ETag for part ${partNumber}`);

              if (eTag && !eTag.startsWith('"') && !eTag.endsWith('"')) {
                eTag = `"${eTag}"`; // Ensure ETag is wrapped in double quotes
              }

              completedParts.push({ ETag: eTag, PartNumber: partNumber });
            }

            // Merge uploaded chunks
            const mergeResponse = await fetch(
              "/api/v1/video/uploads/complete",
              {
                method: "POST",
                body: JSON.stringify({ uploadId, key, parts: completedParts }),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (!mergeResponse.ok) {
              throw new Error("Failed to upload video");
            }
            const mergeResponseData = await mergeResponse.json();

            stringUrl = mergeResponseData.data.result.Location;
          } catch (error) {
            if (uploadId && key) {
              try {
                await abortMultipartUpload(uploadId, key);
              } catch (abortError) {
                console.error("Error during abort:", abortError);
              }
            }

            toast.error(
              error instanceof Error ? error.message : "Video upload failed"
            );
          }
        }

        stringUrl = extractVideoURLKey(decodeURIComponent(stringUrl)) || "";
        setVideoSrc(stringUrl);
      } catch (error) {
        toast.error(
          error instanceof Error ? error?.message : "Video upload failed"
        );
      } finally {
        setUploading(false);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    }
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
          onChange={handleVideoUpload}
          ref={inputRef}
        />
        {uploading && (
          <div className=" flex items-center gap-2 text-sm mt-1">
            <div>Please wait while the video is uploading</div>
            <UploadSpinner color="#f1f1f1" size={20} />{" "}
          </div>
        )}
      </div>

      {openPlayer && (
        <VideoPlayer
          open={openPlayer}
          handleOpen={handleOpenPlayer}
          source={`/videos/${videoSrc}/1080p.m3u8`}
        />
      )}
    </>
  );
};

export default VideoUploader;
