import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { replacePageName } from "@/store/features/generalSlice";
import { CustomButton, CustomInput } from "@/components/common/Inputs";
import { useUpdateProfileMutation } from "@/store/apis/auth.apis";
import { userType } from "@/lib/interfaces-types";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { showError } from "@/lib/reusable-funs";
import { setUser } from "@/store/features/generalSlice";

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user = useAppSelector((state) => state.general.user);
  const dispatch = useAppDispatch();

  const [updateProfile, { isLoading: isUpdating, error, isSuccess, data }] =
    useUpdateProfileMutation();

  // Form submit handler
  const handleSubmit = () => {
    if (isUpdating) return;
    const profileDetails: userType = {
      _id: user._id,
      name,
      email,
    };
    if (password) profileDetails.password = password;
    updateProfile(profileDetails);
  };

  // Initialise data
  useEffect(() => {
    dispatch(replacePageName("Profile"));

    if (user.name) setName(user.name);
    if (user.email) setEmail(user.email);
  }, []);

  // Show error message
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  // Show success message on signin
  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data?.message);
      dispatch(setUser(data?.data?.user));
      setPassword("");
    }
  }, [isSuccess]);

  return (
    <div className="main-container">
      <div className="input-container">
        <div className="label">Name</div>
        <div className="user-input">
          <CustomInput
            text={name}
            setText={setName}
            className="py-5"
            placeholder="Type name here..."
          />
        </div>
      </div>

      <div className="input-container">
        <div className="label">Email</div>
        <div className="user-input">
          <CustomInput
            text={email}
            setText={setEmail}
            className="py-5"
            placeholder="Type email here..."
          />
        </div>
      </div>

      <div className="input-container">
        <div className="label"> New Password</div>
        <div className="user-input">
          <CustomInput
            text={password}
            setText={setPassword}
            className="py-5"
            placeholder="Type password here..."
            type="password"
          />
        </div>
      </div>

      <div className="lg:ml-[17.3rem] flex gap-2">
        <CustomButton
          className="purple-button mt-2 "
          handleClick={handleSubmit}
          disabled={isUpdating}
        >
          {isUpdating ? <LoadingSpinner /> : "Save"}
        </CustomButton>
      </div>
    </div>
  );
}

export default Profile;
