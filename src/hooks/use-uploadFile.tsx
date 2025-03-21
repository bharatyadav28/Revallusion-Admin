import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

function useUploadFile() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [fileSrc, setFileSrc] = useState<string>("");

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);

      try {
        // TODO: Remove in production
        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > 50) {
          toast.error("For free aws tier, file size should be less than 50MB");
          return;
        }

        const formData = new FormData();
        formData.append("file", file);

        // Get url to upload
        const response = await fetch("/api/v1/admin/upload-file", {
          method: "POST",
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
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    }
  };

  const triggerFileUpload = () => {
    if (uploading) return;
    inputRef.current?.click();
  };

  return {
    inputRef,
    uploading,
    fileSrc,
    setFileSrc,
    handleFileUpload,
    triggerFileUpload,
  };

  // return (
  //   <input
  //     id="resourceInput"
  //     type="file"
  //     className="hidden"
  //     onChange={handleFileUpload}
  //     ref={inputRef}
  //     multiple
  //   />
  // );
}

export default useUploadFile;
