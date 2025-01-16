import { HashLoader, ClipLoader, BeatLoader } from "react-spinners";

// Whole page loading spinner
const PageLoadingSpinner = () => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-10 ">
      <HashLoader color="#ffffff" size={60} />
    </div>
  );
};

// Small loading spinner
const LoadingSpinner = ({ size }: { size?: number }) => {
  return (
    <ClipLoader
      size={size || 25}
      color="#ffffff"
      cssOverride={{ borderWidth: "0.2rem" }}
    />
  );
};

// UploadSpinner
const UploadSpinner = () => {
  return <BeatLoader color="#f1f1f1" />;
};
export { PageLoadingSpinner, LoadingSpinner, UploadSpinner };
