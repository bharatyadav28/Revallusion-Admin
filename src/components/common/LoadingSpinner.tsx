import { HashLoader, ClipLoader } from "react-spinners";

// Whole page loading spinner
const PageLoadingSpinner = () => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-10 ">
      <HashLoader color="#ffffff" size={60} />
    </div>
  );
};

// Small loading spinner
const LoadingSpinner = () => {
  return (
    <ClipLoader
      size={25}
      color="#ffffff"
      cssOverride={{ borderWidth: "0.2rem" }}
    />
  );
};

export { PageLoadingSpinner, LoadingSpinner };
