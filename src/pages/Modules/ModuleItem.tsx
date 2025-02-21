import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAppDispatch } from "@/hooks/use-redux";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CustomInput,
  CustomTextArea,
  CustomButton,
} from "@/components/common/Inputs";
import {
  useAddModuleMutation,
  useUpdateModuleMutation,
} from "@/store/apis/modules-apis";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { toast } from "react-hot-toast";
import { showError } from "@/lib/reusable-funs";
import { UpdateButton, DeleteButton } from "@/components/common/Inputs";
import KeyPoint from "@/components/common/KeyPoint";
import { replacePageName } from "@/store/features/generalSlice";

function ModuleItem() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [key_points, setKeyPoints] = useState<string[]>([]);
  const [updateId, setUpdateId] = useState("");

  const { id: moduleId } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const isEdit = location.state?.isEdit;
  const data = location.state?.module;

  const [open, setOpen] = useState(false);
  const handleDialogOpen = () => {
    setOpen((prev) => !prev);
  };

  const allowedKeyPoints = 5;

  const [
    addModule,
    {
      isLoading: isAdding,
      error: additionError,
      isSuccess: additionSuccess,
      data: additionData,
    },
  ] = useAddModuleMutation();

  const [
    updateModule,
    {
      isLoading: isUpdating,
      error: updateError,
      isSuccess: updationSuccess,
      data: updateData,
    },
  ] = useUpdateModuleMutation();

  // Handle module updation or additon
  const handleSubmit = () => {
    if (isEdit) {
      updateModule({
        module: {
          _id: data?._id,
          name,
          description,
          key_points,
        },
        id: data?._id,
      });
    } else {
      addModule({
        name,
        description,
        key_points,
      });
    }
  };

  // Initialise data on edit
  useEffect(() => {
    if (data && isEdit) {
      const { name, description, key_points } = data;
      setName(name);
      setDescription(description);
      setKeyPoints(key_points);
      dispatch(replacePageName("Edit Module"));
    } else {
      if (moduleId) {
        navigate(`..`);
      } else {
        dispatch(replacePageName("Add Module"));
      }
    }
  }, [data, isEdit]);

  // Handle errors
  useEffect(() => {
    if (additionError) {
      showError(additionError);
    }
  }, [additionError]);

  useEffect(() => {
    if (updateError) {
      showError(updateError);
    }
  }, [updateError]);

  // Handle success on addition or updation
  useEffect(() => {
    if (additionSuccess && additionData) {
      toast.success(additionData?.message);
      navigate("/modules");
    }
  }, [additionSuccess]);

  useEffect(() => {
    if (updationSuccess && updateData) {
      toast.success(updateData?.message);
      navigate("/modules");
    }
  }, [updationSuccess]);

  return (
    <>
      <div className="main-container">
        <div className="input-container">
          <div className="label">Name</div>
          <div className="user-input">
            <CustomInput
              maxChars={50}
              text={name}
              setText={setName}
              className="py-5"
            />
          </div>
        </div>

        <div className="input-container">
          <div className="label">Description</div>
          <div className="user-input">
            <CustomTextArea
              maxChars={200}
              text={description}
              setText={setDescription}
              className="h-32"
            />
          </div>
        </div>

        {key_points.length > 0 && (
          <div className="input-container mt-4 gap-2">
            <div className="label">Key points</div>
            <div className=" grow lg:max-w-[47rem] ">
              <Table className="custom-table !rounded-[100rem] ">
                <TableCaption>{`A list of certficate key points (${key_points.length}/${allowedKeyPoints})`}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Key point</TableHead>
                    <TableHead className="action-btns">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {key_points?.map((point: string, index) => (
                    <TableRow key={point}>
                      <TableCell>{point}</TableCell>
                      <TableCell>
                        <UpdateButton
                          handleClick={() => {
                            setOpen(true);
                            setUpdateId(String(index));
                          }}
                        />
                        <DeleteButton
                          handleClick={() => {
                            setKeyPoints((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <div className="lg:ml-[17.3rem] flex gap-2">
          <CustomButton
            className="purple-button mt-2 "
            handleClick={handleSubmit}
            disabled={isUpdating}
          >
            {isUpdating || isAdding ? <LoadingSpinner /> : "Save"}
          </CustomButton>
          <CustomButton
            className="green-button mt-2"
            handleClick={() => {
              if (key_points.length >= allowedKeyPoints) {
                toast.error(
                  `You can't add more than ${allowedKeyPoints} key points`
                );
                return;
              }
              setOpen(true);
            }}
          >
            {"Add key point"}
          </CustomButton>
        </div>
      </div>

      <KeyPoint
        open={open}
        handleOpen={handleDialogOpen}
        keyPoints={key_points}
        setKeyPoints={setKeyPoints}
        updateId={updateId}
        setUpdateId={setUpdateId}
      />
    </>
  );
}

export default ModuleItem;
