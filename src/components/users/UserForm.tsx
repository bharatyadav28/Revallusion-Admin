import { useEffect, useState } from "react";

import CustomSheet from "../common/CustomSheet";
import {
  CustomButton,
  CustomCheckBox,
  CustomInput,
  CustomSelectSeperate,
} from "@/components/common/Inputs";
import { planType, userDetailsType } from "@/lib/interfaces-types";
import {
  useAddUserMutation,
  useUpdateUserMutation,
} from "@/store/apis/users-apis";
import { showError } from "@/lib/reusable-funs";
import toast from "react-hot-toast";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { issuedCertificatesType } from "@/lib/interfaces-types";

interface Props {
  open: boolean;
  handleOpen: () => void;
  plans?: planType[];
  user: userDetailsType | null;
  setUser: React.Dispatch<React.SetStateAction<userDetailsType | null>>;
}

function UserForm({ open, handleOpen, plans, user }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [plan, setPlan] = useState("");
  const [newPlan, setNewPlan] = useState("");
  const [issuedCertificates, setIssuedCertficates] = useState<
    issuedCertificatesType[] | null
  >(null);

  const [addUser, { isLoading: isAdding }] = useAddUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const handleSubmit = async () => {
    let formdata = {
      name,
      email,
      mobile,
      plan,
    };

    if (user && user._id) {
      let isPlanUpdated = false;
      if (newPlan !== plan) {
        isPlanUpdated = true;
      }
      const response = await updateUser({
        user: {
          ...formdata,
          _id: user?._id,
          isPlanUpdated,
          plan: plan === "noPlan" ? "" : plan,
          issuedCertificates,
        },
        id: user._id,
      });

      if (response?.error) showError(response.error);
      else {
        toast.success(response?.data?.message);
        handleOpen();
      }
    } else {
      const response = await addUser({
        ...formdata,
        plan: plan === "noPlan" ? "" : plan,
      });

      if (response?.error) showError(response.error);
      else {
        toast.success(response?.data?.message);
        handleOpen();
      }
    }
  };

  const handleCertificateUpdate = (planId: string) => {
    setIssuedCertficates((prev) => {
      if (prev) {
        const updatedItems = prev.map((item) => {
          if (item._id === planId) {
            return { ...item, certificate: !item.certificate };
          }
          return item;
        });
        return updatedItems;
      }
      return null;
    });
  };

  useEffect(() => {
    if (user) {
      setName(user?.name || "");
      setEmail(user?.email || "");
      setMobile(user?.mobile || "");
      setPlan(user?.plan || "noPlan");
      setNewPlan(user?.plan || "noPlan");
    } else {
      setName(""), setEmail(""), setMobile(""), setPlan("noPlan");
    }
  }, [user]);

  useEffect(() => {
    const userCertificates = user?.certificates;

    const restructuredPlans =
      plans?.map((plan) => ({
        _id: plan._id,
        plan_type: plan.plan_type,
        level: plan.level,
        certificate: false,
      })) || null;

    userCertificates?.forEach((certificate) => {
      restructuredPlans?.forEach((plan) => {
        if (certificate.plan === plan._id) {
          plan.certificate = true;
        }
      });
    });

    setIssuedCertficates(restructuredPlans);
  }, [plans, user]);

  const plansReformat =
    plans?.map((plan) => {
      return {
        key: plan.plan_type,
        value: plan._id,
      };
    }) || [];

  const plansMenu = [{ key: "No plan", value: "noPlan" }, ...plansReformat];

  return (
    <CustomSheet open={open} handleOpen={handleOpen}>
      <div className="uppercase text-lg">
        {(user ? "Edit" : "Create") + " User"}
      </div>
      <div className="main-container mt-4">
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
              type="email"
              className="py-5"
              placeholder="Type email here..."
            />
          </div>
        </div>

        <div className="input-container">
          <div className="label">Mobile Number</div>
          <div className="user-input">
            <CustomInput
              text={mobile}
              setText={setMobile}
              className="py-5"
              placeholder="Type mobile number here..."
            />
          </div>
        </div>

        <div className="input-container">
          <div className="label">Plan</div>
          <div className="user-input">
            <CustomSelectSeperate
              menu={plansMenu}
              value={plan}
              onChange={setPlan}
            />
          </div>
        </div>

        {user && (
          <div className="input-container">
            <div className="label">Certificates</div>
            <div className="user-input">
              <div className="flex gap-4">
                {issuedCertificates?.map((item) => {
                  return (
                    <div className="flex gap-2 item-center mb-0">
                      <div>
                        <CustomCheckBox
                          value={item.certificate}
                          onChange={() => handleCertificateUpdate(item._id)}
                        />
                      </div>
                      <div>{item.plan_type}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <CustomButton
          className="purple-button mt-2 lg:ml-[17.3rem]"
          handleClick={handleSubmit}
          disabled={isAdding || isUpdating}
        >
          {isAdding || isUpdating ? <LoadingSpinner /> : "Save"}
        </CustomButton>
      </div>
    </CustomSheet>
  );
}

export default UserForm;
