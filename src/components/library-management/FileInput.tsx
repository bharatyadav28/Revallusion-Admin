import { useState, useRef } from "react";
import { motion } from "motion/react";
import { FaFileZipper as ZipIcon } from "react-icons/fa6";
import { RxCrossCircled as RemoveIcon } from "react-icons/rx";
import { Upload } from "lucide-react";

import { LoadingSpinner } from "../common/LoadingSpinner";
import { Progress } from "../ui/progress";
import useStream from "@/hooks/use-stream";
import { Link } from "react-router-dom";
import { cdnAddr } from "@/lib/resuable-data";
import { truncateString } from "@/lib/reusable-funs";

interface UploadInputProps {
  fileSrc?: string;
  setFileSrc: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  acceptTypes?: "zip" | "video" | "both" | "all";
}

export function FileInput({
  fileSrc,
  setFileSrc,
  title,
  acceptTypes,
}: UploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { handleFileChange, progress: assigmentUploadProgress } = useStream({
    setFileSrc: setFileSrc,
    uploading: isUploading,
    setUploading: setIsUploading,
    awsFileName: title,
  });

  const triggerFileUpload = () => {
    inputRef.current?.click();
  };

  const videoFileTypes =
    "video/*,.mp4,.avi,.mkv,.mov,.wmv,.flv,.webm,.m4v,.3gp,.ogv";

  const getFileTypes = () => {
    switch (acceptTypes) {
      case "zip":
        return ".zip";
      case "video":
        return videoFileTypes;
      case "both":
        return `.zip,${videoFileTypes}`;
      case "all":
        return "*/*";
      default:
        return ".zip";
    }
  };

  return (
    <>
      <input
        id="resourceInput"
        type="file"
        className="hidden"
        // onChange={handleFileUpload}
        onChange={handleFileChange}
        accept={getFileTypes()}
        ref={inputRef}
      />
      {fileSrc && (
        <div>
          <div className="flex items-center gap-2 border border-gray-400  rounded-md px-4 py-2 w-max">
            <Link
              to={`${cdnAddr}/${fileSrc}`}
              className="flex items-center gap-1"
            >
              <ZipIcon size={16} />
              <div className="flex items-center gap-5 border  ">
                <span> File -</span>
                <span className="monospace">
                  {" "}
                  {truncateString(
                    fileSrc?.split("/").pop()?.split("-").pop() || "",
                    20
                  )}
                </span>
              </div>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring" }}
              className="!p-0 m-0 sm:ml-[2rem] "
              onClick={() => {
                setFileSrc("");
              }}
            >
              <RemoveIcon
                className="hover:text-[var(--softpurple)] transition-all"
                size={20}
              />
            </motion.button>
          </div>
        </div>
      )}
      {!fileSrc && (
        <div className="flex flex-col gap-2 w-max">
          <label
            onClick={triggerFileUpload}
            className="flex items-center gap-2 px-5 py-2 bg-black backdrop-blur-md  text-white text-sm font-medium rounded-md cursor-pointer hover:bg-gray-900 transition w-[15rem] min-w-[10rem] "
          >
            {!isUploading ? (
              <>
                <Upload size={16} />
                <div className=" w-full flex ml-2 items-center">
                  No file choosen
                </div>
              </>
            ) : (
              <div className=" w-full flex justify-center items-center">
                <LoadingSpinner size={16} />
              </div>
            )}
          </label>

          {isUploading && (
            <div className="flex items-center justify-center gap-2 ">
              <Progress value={assigmentUploadProgress} className=" w-[5rem]" />
              <div className="text-sm">{assigmentUploadProgress}%</div>
            </div>
          )}
        </div>
      )}

      <input type="file" className="hidden" />
    </>
  );
}
