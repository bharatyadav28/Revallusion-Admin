// Component for uploading image

import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineEdit as EditIcon } from "react-icons/md";

import { Button } from "../ui/button";
import { UploadSpinner } from "./LoadingSpinner";

interface Props {
  imageSrc: string;
  setImageSrc: React.Dispatch<React.SetStateAction<string>>;
  alt?: string;
}
const ImageUploader: React.FC<Props> = ({ imageSrc, setImageSrc, alt }) => {
  const [uploading, setUploading] = useState<boolean>(false);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);

      try {
        // Prepare FormData
        const formData = new FormData();
        formData.append("file", file);
        if (alt) formData.append("type", alt);

        // Upload to backend
        const response = await fetch("/api/v1/admin/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();
        if (data?.data?.imageUrl) {
          setImageSrc(data?.data?.imageUrl);
        } else {
          alert("Image upload failed. No URL returned.");
        }
      } catch (error) {
        toast.error("Image upload failed");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="relative border bottom-1 rounded-sm w-[15rem] h-[10rem] group bg-black bg-opacity-80">
      {!imageSrc && (
        <div className="flex items-center justify-center h-full">
          No file choosen
        </div>
      )}
      {/* Image Display */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt || "Image"}
          className="w-full h-full object-cover rounded-sm"
        />
      )}

      {/* Spinner while uploading video */}
      {uploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center  justify-center rounded-sm">
          <span className="text-white text-lg">
            <UploadSpinner />
          </span>
        </div>
      )}

      {/* Hover Effect */}
      {!uploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-sm backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            variant="outline"
            size="icon"
            className="bg-opacity-80  text-[#fff] hover:bg-opacity-50"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <EditIcon />
          </Button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default ImageUploader;
