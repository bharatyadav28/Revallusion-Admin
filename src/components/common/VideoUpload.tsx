// Component for uploading image

import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { DotLoader as UploadSpinner } from "react-spinners";

import { Button } from "../ui/button";
import { calculateDuration, extractVideoURLKey } from "@/lib/reusable-funs";
import { videoDurationType } from "@/lib/interfaces-types";
import VideoPlayer from "../VideoPlayer";
import useStream from "@/hooks/use-stream";

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
  // uploading,
  setUploading,
}) => {
  const [openPlayer, setOpenPlayer] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenPlayer = () => {
    setOpenPlayer((prev) => !prev);
  };

  // const abortMultipartUpload = async (uploadId: string, key: string) => {
  //   try {
  //     const abortResponse = await fetch("/api/v1/video/uploads/abort", {
  //       method: "POST",
  //       body: JSON.stringify({ uploadId, key }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (!abortResponse.ok) {
  //       throw new Error("Failed to abort multipart upload");
  //     }

  //     const abortData = await abortResponse.json();
  //     // console.log("Abort response:", abortData);
  //     return abortData;
  //   } catch (error) {
  //     toast.error(
  //       error instanceof Error ? error.message : "Failed to abort upload"
  //     );
  //     throw error;
  //   }
  // };

  // const handleVideoUpload = async (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ): Promise<void> => {
  //   const file = e.target.files?.[0];

  //   if (file) {
  //     const fileSize = file.size;
  //     const fileSizeInMB = file.size / (1024 * 1024);

  //     // TODO: Remove in production;
  //     // if (fileSizeInMB > 150) {
  //     //   toast.error("For free aws tier, video size should be less than 150MB");
  //     //   return;
  //     // }

  //     setUploading(true);
  //     calculateDuration({ file, setDuration: setVideoDuration });

  //     try {
  //       const videoExtension = file.name.split(".").pop();

  //       let stringUrl = "";
  //       if (fileSizeInMB <= 150) {
  //         console.log("Single upload");
  //         // Get url to upload
  //         const response = await fetch("/api/v1/video/get-upload-url", {
  //           method: "POST",
  //           body: JSON.stringify({ videoExtension }),
  //           headers: {
  //             "Content-Type": "application/json", // Specify the content type
  //           },
  //         });

  //         if (!response.ok) {
  //           throw new Error("Failed to get upload url");
  //         }

  //         const data = await response.json();
  //         const videoUrl = data?.data?.uploadURL;

  //         // Upload video to fetched url
  //         const response2 = await fetch(videoUrl, {
  //           method: "PUT",
  //           body: file, // Send the raw file, not FormData
  //           headers: {
  //             "Content-Type": file.type,
  //           },
  //         });

  //         if (!response2.ok) {
  //           throw new Error("Failed to upload video");
  //         }

  //         const cleanUrl = new URL(videoUrl);
  //         cleanUrl.search = ""; // Remove the query string
  //         stringUrl = cleanUrl.toString();
  //       } else {
  //         console.log("Multi upload");
  //         const CHUNK_SIZE = 25 * 1024 * 1024; // 25 MB
  //         let uploadId;
  //         let key;

  //         // Multi part upload
  //         try {
  //           // Initial multipart upload
  //           const initialResponse = await fetch(
  //             "/api/v1/video/uploads/initiate",
  //             {
  //               method: "POST",
  //               body: JSON.stringify({ videoExtension }),
  //               headers: {
  //                 "Content-Type": "application/json",
  //               },
  //             }
  //           );

  //           if (!initialResponse.ok) {
  //             throw new Error("Failed to upload ");
  //           }

  //           const initialData = await initialResponse.json();
  //           uploadId = initialData?.data?.uploadId;
  //           key = initialData?.data?.key;

  //           // Fetch signed urls for uploading chunks
  //           const totalParts = Math.ceil(fileSize / CHUNK_SIZE);
  //           console.log("Total parts: ", totalParts);

  //           const urlsResponse = await fetch(
  //             "/api/v1/video/uploads/generate-urls",
  //             {
  //               method: "POST",
  //               body: JSON.stringify({ uploadId, key, partCount: totalParts }),
  //               headers: {
  //                 "Content-Type": "application/json",
  //               },
  //             }
  //           );
  //           if (!urlsResponse.ok) {
  //             throw new Error("Failed to generate urls ");
  //           }
  //           const { data: urlsData } = await urlsResponse.json();

  //           interface presignedUrls {
  //             partNumber: number;
  //             url: string;
  //           }
  //           const presignedUrls: presignedUrls[] = urlsData.urls;
  //           const completedParts = [];

  //           for (let i = 0; i < totalParts; i++) {
  //             const start = i * CHUNK_SIZE;
  //             const end = Math.min(file.size, start + CHUNK_SIZE);
  //             const chunk = file.slice(start, end);
  //             const partNumber = i + 1;

  //             const url = presignedUrls?.find(
  //               (u: urlType) => u.partNumber === partNumber
  //             )?.url;

  //             if (!url) throw new Error(`Missing URL for part ${partNumber}`);

  //             const uploadResponse = await fetch(url || "", {
  //               method: "PUT",
  //               body: chunk,
  //               headers: { "Content-Type": file.type, Accept: "/" },
  //             });
  //             if (!uploadResponse.ok) {
  //               throw new Error("Failed to upload video");
  //             }
  //             let eTag = uploadResponse.headers.get("etag");
  //             if (!eTag) throw new Error(`Missing ETag for part ${partNumber}`);

  //             if (eTag && !eTag.startsWith('"') && !eTag.endsWith('"')) {
  //               eTag = `"${eTag}"`; // Ensure ETag is wrapped in double quotes
  //             }

  //             completedParts.push({ ETag: eTag, PartNumber: partNumber });
  //           }

  //           // Merge uploaded chunks
  //           const mergeResponse = await fetch(
  //             "/api/v1/video/uploads/complete",
  //             {
  //               method: "POST",
  //               body: JSON.stringify({ uploadId, key, parts: completedParts }),
  //               headers: {
  //                 "Content-Type": "application/json",
  //               },
  //             }
  //           );

  //           if (!mergeResponse.ok) {
  //             throw new Error("Failed to upload video");
  //           }
  //           const mergeResponseData = await mergeResponse.json();

  //           stringUrl = mergeResponseData.data.result.Location;
  //         } catch (error) {
  //           if (uploadId && key) {
  //             try {
  //               await abortMultipartUpload(uploadId, key);
  //             } catch (abortError) {
  //               console.error("Error during abort:", abortError);
  //             }
  //           }

  //           toast.error(
  //             error instanceof Error ? error.message : "Video upload failed"
  //           );
  //         }
  //       }

  //       stringUrl = extractVideoURLKey(decodeURIComponent(stringUrl)) || "";
  //       setVideoSrc(stringUrl);
  //     } catch (error) {
  //       toast.error(
  //         error instanceof Error ? error?.message : "Video upload failed"
  //       );
  //     } finally {
  //       setUploading(false);
  //       if (inputRef.current) {
  //         inputRef.current.value = "";
  //       }
  //     }
  //   }
  // };

  // Handle choose file button click
  const handleClick = () => {
    if (!videoSrc) {
      // document.getElementById("videoInput")?.click();
      inputRef.current?.click();
    } else {
      handleOpenPlayer();
    }
  };

  // interface UploadPart {
  //   ETag: string;
  //   PartNumber: number;
  // }

  // interface UploadInitResponse {
  //   fileName: string;
  //   UploadId: string;
  // }

  // const chunkSize = 100 * 1024 * 1024; // 100MB

  // const [progress, setProgress] = useState<number>(0);

  const { handleFileChange, uploading, progress } = useStream({
    setFileSrc: setVideoSrc,
    setVideoDuration: setVideoDuration,
  });

  // const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   setUploading(true);
  //   calculateDuration({ file, setDuration: setVideoDuration });

  //   // Preview
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);

  //   // Start upload
  //   const initData = await startUpload();

  //   if (initData) {
  //     await uploadFileInChunks(file, initData.fileName, initData.UploadId);
  //   }
  //   setVideoSrc(initData?.fileName?.split("/")?.pop() || "");
  //   setUploading(false);
  // };

  // const startUpload = async (): Promise<UploadInitResponse | null> => {
  //   try {
  //     const res = await fetch("/api/v1/video/stream/start-upload", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({}),
  //     });

  //     if (!res.ok) throw new Error("Failed to start upload");
  //     const data = await res.json();
  //     return data;
  //   } catch (err) {
  //     console.error("startUpload error:", err);
  //     return null;
  //   }
  // };

  // const uploadChunk = async (
  //   chunk: Blob,
  //   partNumber: number,
  //   fileName: string,
  //   uploadId: string
  // ): Promise<UploadPart> => {
  //   const formData = new FormData();
  //   formData.append("file", chunk);
  //   formData.append("uploadId", uploadId);
  //   formData.append("partNumber", String(partNumber));
  //   formData.append("fileName", fileName);

  //   const res = await fetch("/api/v1/video/stream/upload", {
  //     method: "POST",
  //     body: formData,
  //   });

  //   if (!res.ok) {
  //     throw new Error(`Chunk ${partNumber} upload failed`);
  //   }

  //   const data = await res.json();
  //   return { ETag: data.ETag, PartNumber: partNumber };
  // };

  // const uploadFileInChunks = async (
  //   file: File,
  //   fileName: string,
  //   uploadId: string
  // ) => {
  //   const totalChunks = Math.ceil(file.size / chunkSize);
  //   console.log("Total chunks", totalChunks);
  //   const uploadedParts: UploadPart[] = [];

  //   let uploadedBytes = 0;

  //   for (let i = 0; i < totalChunks; i++) {
  //     const start = i * chunkSize;
  //     const end = Math.min(start + chunkSize, file.size);
  //     const chunk = file.slice(start, end);
  //     const partNumber = i + 1;

  //     try {
  //       const part = await uploadChunk(chunk, partNumber, fileName, uploadId);
  //       uploadedParts.push(part);

  //       uploadedBytes += chunk.size;
  //       const percent = ((uploadedBytes / file.size) * 100).toFixed(2);
  //       setProgress(Number(percent));
  //     } catch (err) {
  //       console.error(`Error uploading part ${partNumber}`, err);
  //       return;
  //     }
  //   }

  //   await completeUpload(uploadedParts, fileName, uploadId);
  // };

  // const completeUpload = async (
  //   parts: UploadPart[],
  //   fileName: string,
  //   uploadId: string
  // ) => {
  //   try {
  //     const res = await fetch("/api/v1/video/stream/complete-upload", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         uploadId,
  //         fileName,
  //         parts,
  //       }),
  //     });

  //     if (!res.ok) throw new Error("Failed to complete upload");

  //     alert("Upload complete!");
  //   } catch (err) {
  //     console.error("completeUpload error:", err);
  //   }
  // };

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
          <div className=" flex items-center gap-2 text-sm mt-1">
            <div>Please wait while the video is uploading</div>
            <UploadSpinner color="#f1f1f1" size={20} />
            <div>{progress}...</div>
          </div>
        )}
      </div>

      {openPlayer && (
        <VideoPlayer
          open={openPlayer}
          handleOpen={handleOpenPlayer}
          source={`https://d2b1ol8c9bt133.cloudfront.net/${videoSrc}/1080p.m3u8`}
        />
      )}
    </>
  );
};

export default VideoUploader;
