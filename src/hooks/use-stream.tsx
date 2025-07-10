import React, { useState } from "react";

import { videoDurationType } from "@/lib/interfaces-types";
import { calculateDuration } from "@/lib/reusable-funs";
import { baseAddr } from "@/lib/resuable-data";
import toast from "react-hot-toast";

interface UploadPart {
  ETag: string;
  PartNumber: number;
}

interface UploadInitResponse {
  fileName: string;
  UploadId: string;
}

interface Props {
  setFileSrc: React.Dispatch<React.SetStateAction<string>>;
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  setVideoDuration?: React.Dispatch<React.SetStateAction<videoDurationType>>;
}
function useStream({ setFileSrc, setVideoDuration, setUploading }: Props) {
  const chunkSize = 50 * 1024 * 1024; // 50MB

  const [progress, setProgress] = useState<number>(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const contentType = setVideoDuration ? null : file?.type;

    setUploading(true);

    try {
      if (setVideoDuration)
        calculateDuration({ file, setDuration: setVideoDuration });

      // Preview
      const reader = new FileReader();
      reader.readAsDataURL(file);

      // Start upload
      const fileType = setVideoDuration ? null : "assignments";
      const initData = await startUpload(contentType, fileType);

      if (initData) {
        await uploadFileInChunks(
          file,
          initData.fileName,
          initData.UploadId,
          fileType
        );
      }
      // setFileSrc(initData?.fileName?.split("/")?.pop() || "");
      let fileName = initData?.fileName;
      if (setVideoDuration) {
        fileName = fileName?.split("/")?.pop();
      }
      if (fileName) {
        setFileSrc(fileName);
      }
    } catch (error) {
      console.log("Error in video upload: ", error);
      toast.error("File upload failed");
    }

    setUploading(false);
  };

  const startUpload = async (
    contentType: string | null,
    fileType: string | null
  ): Promise<UploadInitResponse | null> => {
    const res = await fetch(`${baseAddr}/api/v1/video/stream/start-upload`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType, fileType }),
    });

    if (!res.ok) throw new Error("Failed to start upload");
    const data = await res.json();
    return data;
  };

  const uploadChunk = async (
    chunk: Blob,
    partNumber: number,
    fileName: string,
    uploadId: string,
    fileType: string | null
  ): Promise<UploadPart> => {
    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("uploadId", uploadId);
    formData.append("partNumber", String(partNumber));
    formData.append("fileName", fileName);
    formData.append("fileType", fileType || "");

    const res = await fetch(`${baseAddr}/api/v1/video/stream/upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Chunk ${partNumber} upload failed`);
    }

    const data = await res.json();
    return { ETag: data.ETag, PartNumber: partNumber };
  };

  const uploadFileInChunks = async (
    file: File,
    fileName: string,
    uploadId: string,
    fileType: string | null
  ) => {
    const totalChunks = Math.ceil(file.size / chunkSize);
    console.log("Total chunks", totalChunks);
    const uploadedParts: UploadPart[] = [];

    let uploadedBytes = 0;

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      const partNumber = i + 1;

      const part = await uploadChunk(
        chunk,
        partNumber,
        fileName,
        uploadId,
        fileType
      );
      uploadedParts.push(part);

      uploadedBytes += chunk.size;
      const percent = ((uploadedBytes / file.size) * 100).toFixed(2);
      setProgress(Number(percent));
    }

    await completeUpload(uploadedParts, fileName, uploadId, fileType);
  };

  const completeUpload = async (
    parts: UploadPart[],
    fileName: string,
    uploadId: string,
    fileType: string | null
  ) => {
    const res = await fetch(`${baseAddr}/api/v1/video/stream/complete-upload`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uploadId,
        fileName,
        parts,
        fileType,
      }),
    });

    if (!res.ok) throw new Error("Failed to complete upload");
  };

  return {
    handleFileChange,
    progress,
  };
}

export default useStream;
