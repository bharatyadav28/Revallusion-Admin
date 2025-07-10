// Component for uploading file

import React from "react";
import toast from "react-hot-toast";
import { DotLoader as UploadSpinner } from "react-spinners";

import { Button } from "../ui/button";
import { baseAddr } from "@/lib/resuable-data";

interface Props {
  fileSrc: string;
  setFileSrc: React.Dispatch<React.SetStateAction<string>>;
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
}
const FileUploader: React.FC<Props> = ({
  fileSrc,
  setFileSrc,
  uploading,
  setUploading,
}) => {
  // Handle file upload
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        // Get url to upload
        const response = await fetch(`${baseAddr}/api/v1/admin/upload-file`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to get upload url");
        }

        const data = await response.json();
        const fileUrl = data?.data?.imageUrl;

        setFileSrc(fileUrl);
      } catch (error) {
        toast.error(
          error instanceof Error ? error?.message : "file upload failed"
        );
      } finally {
        setUploading(false);
      }
    }
  };

  // Handle choose file button click
  const handleClick = () => {
    if (!fileSrc) {
      document.getElementById("fileInput")?.click();
    } else {
      window.open(fileSrc);
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
          {fileSrc ? "View file" : "Choose file"}
        </Button>
        <p className="text-sm">
          {uploading
            ? ""
            : fileSrc
            ? fileSrc.split("/").pop()?.slice(-40)
            : "No file choosen"}{" "}
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        id="fileInput"
        type="file"
        className="hidden"
        onChange={handleFileUpload}
      />
      {uploading && (
        <div className=" flex items-center gap-2 text-sm mt-1">
          <div>Please wait while the file is uploading</div>
          <UploadSpinner color="#f1f1f1" size={20} />{" "}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
