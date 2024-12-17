import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useUpdatePagesMutation } from "@/store/apis/content-mangement/static-pages-apis";
import {
  CustomInput,
  CustomSelect,
  CustomButton,
} from "@/components/common/Inputs";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { showError } from "@/lib/reusable-funs";
import { modules, formats } from "@/lib/resuable-data";

function EditStaticPage() {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  const location = useLocation();
  const pageData = location?.state?.page;
  const navigate = useNavigate();

  const [updatePages, { isLoading: isUpdating, error, isSuccess, data }] =
    useUpdatePagesMutation();

  // Handles static page update
  const handleSubmit = async () => {
    const updatedData = {
      _id: pageData._id,
      title,
      description,
      status: status,
      type,
    };
    await updatePages({
      page: updatedData,
      id: pageData._id,
    });
  };

  // Initialise data
  useEffect(() => {
    if (pageData) {
      const { title, status, type, description } = pageData;
      setTitle(title);
      setStatus(status);
      setDescription(description);
      setType(type);
    }
  }, [pageData]);

  // Handle mutation errors
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  // Handle mutation success messages
  useEffect(() => {
    let message = "Updated successfully";
    if (isSuccess) {
      message = data.message;
    }
    if (isSuccess) {
      toast.success(message);
      navigate("/static-pages");
    }
  }, [isSuccess]);

  return (
    <>
      <div className="main-container">
        <div className="input-container">
          <div className="label">Title</div>
          <div className="user-input">
            <CustomInput
              text={title}
              setText={setTitle}
              className="py-5 "
              style={{ opacity: 1 }}
              disabled
            />
          </div>
        </div>

        <div className="input-container">
          <div className="label">Description</div>
          <div className="user-input h-[20rem] ">
            <ReactQuill
              theme="snow"
              value={description}
              onChange={(value) => setDescription(value)}
              modules={modules}
              formats={formats}
              className="bg-[#fff] rounded-md text-black h-full overflow-hidden border  "
            />
          </div>
        </div>

        <div className="input-container">
          <div className="label">Type</div>
          <div className="user-input">
            <CustomSelect
              menu={["T&C", "Help", "Company", "Social"]}
              value={type}
              onChange={setType}
            />
          </div>
        </div>

        <div className="input-container">
          <div className="label">Status</div>
          <div className="user-input">
            <CustomSelect
              menu={["Active", "Inactive"]}
              value={status}
              onChange={setStatus}
            />
          </div>
        </div>

        <CustomButton
          className="purple-button mt-2 lg:ml-[17.3rem]"
          handleClick={handleSubmit}
          disabled={isUpdating}
        >
          {isUpdating ? <LoadingSpinner /> : "Save"}
        </CustomButton>
      </div>
    </>
  );
}

export default EditStaticPage;
