import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/use-redux";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { carousalPointType } from "@/lib/interfaces-types";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { replacePageName } from "@/store/features/generalSlice";
import { CustomInput, CustomTextArea } from "@/components/common/Inputs";
import { CustomButton } from "@/components/common/Inputs";
import {
  useAddCarousalMutation,
  useUpdateCarousalMutation,
} from "@/store/apis/content-mangement/carousal-apis";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { showError } from "@/lib/reusable-funs";
import KeyPoint from "./KeyPoint";
import { UpdateButton, DeleteButton } from "@/components/common/Inputs";

function Carousal() {
  const dispatch = useAppDispatch();
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [sequence, setSequence] = useState("0");
  const [keyPoints, setKeyPoints] = useState<carousalPointType[]>([]);
  const [updateId, setUpdateId] = useState("");

  const allowedKeyPoints = 5;

  const [open, setOpen] = useState(false);
  const handleDialogOpen = () => {
    setOpen((prev) => !prev);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const [
    addCarousal,
    { isLoading: isAdding, error: additionError, isSuccess, data },
  ] = useAddCarousalMutation();
  const [
    updateCarousal,
    {
      isLoading: isUpdating,
      error: updationError,
      isSuccess: updateSuccess,
      data: updateData,
    },
  ] = useUpdateCarousalMutation();

  // Handle carousal updation or additon
  const handleSubmit = async () => {
    const filteredKeyPoints = keyPoints.map(({ _id, ...rest }) => rest);
    const data = {
      caption,
      description,
      sequence: Number(sequence),
      key_points: filteredKeyPoints,
      updateId,
    };
    if (location.state?.isEdit) {
      await updateCarousal({
        carousal: data,
        id: location.state.carousal._id,
      });
    } else {
      await addCarousal(data);
    }
  };

  // Initialize carousal data on edit
  useEffect(() => {
    const isEdit = location.state?.isEdit;
    const carousal = location.state?.carousal;

    const title = isEdit ? "Edit Carousal" : "Add Carousal";
    dispatch(replacePageName(title));
    if (isEdit) {
      setCaption(carousal?.caption || "");
      setDescription(carousal?.description || "");
      setSequence(carousal?.sequence || 0);
      setKeyPoints(carousal?.key_points);
    }
  }, [dispatch]);

  // Show error while adding carousal data
  useEffect(() => {
    if (additionError) {
      showError(additionError);
    }
  }, [additionError]);

  // Show error while updating carousal data
  useEffect(() => {
    if (updationError) {
      showError(updationError);
    }
  }, [updationError]);

  // Show success message on addition or updation of carousal data
  useEffect(() => {
    let message = "Updated successfully";
    if (isSuccess) {
      message = data.message;
    }
    if (updateSuccess) {
      message = updateData.message;
    }
    if (isSuccess || updateSuccess) {
      toast.success(message);
      navigate("/carousals");
    }
  }, [isSuccess, updateSuccess]);

  return (
    <>
      <div className="main-container">
        <div className="input-container">
          <div className="label">Caption</div>
          <div className="user-input">
            <CustomInput
              text={caption}
              setText={setCaption}
              className="py-5"
              maxChars={35}
            />
          </div>
        </div>

        <div className="input-container">
          <div className="label">Description</div>
          <div className="user-input">
            <CustomTextArea
              text={description}
              setText={setDescription}
              className="h-32"
              maxChars={300}
            />
          </div>
        </div>

        <div className="input-container">
          <div className="label">Sequence</div>
          <div className="user-input">
            <CustomInput
              text={sequence}
              setText={setSequence}
              className="py-5"
              type="number"
              placeholder="Type your sequence here..."
            />
          </div>
        </div>

        {/* Key points */}
        {keyPoints.length > 0 && (
          <div className="input-container mt-4 gap-2">
            <div className="label">Key points</div>
            <div className=" grow lg:max-w-[47rem] ">
              <Table className="custom-table ">
                <TableCaption>{`A list of Key points (${keyPoints.length}/${allowedKeyPoints})`}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Title</TableHead>
                    <TableHead className="w-2/4">Description</TableHead>
                    <TableHead className="action-btns">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {keyPoints.map((point: carousalPointType, index) => (
                    <TableRow key={point._id || index}>
                      <TableCell>{point.title}</TableCell>
                      <TableCell>{point.explanation}</TableCell>
                      <TableCell>
                        <div className="flex">
                          <UpdateButton
                            handleClick={() => {
                              setOpen(true);
                              if (point._id) setUpdateId(point._id);
                            }}
                          />
                          <DeleteButton
                            handleClick={() => {
                              setKeyPoints((prev) =>
                                prev.filter((p) => p._id !== point._id)
                              );
                            }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        <div className="flex justify-start gap-3 lg:ml-[17.3rem]">
          <CustomButton
            className="purple-button mt-2 "
            handleClick={handleSubmit}
            disabled={isAdding}
          >
            {isAdding || isUpdating ? <LoadingSpinner /> : "Save"}
          </CustomButton>

          <CustomButton
            className="green-button mt-2 "
            handleClick={() => {
              if (keyPoints.length >= allowedKeyPoints) {
                toast.error(`You can add only ${allowedKeyPoints} key points`);
                return;
              }
              setOpen(true);
              setUpdateId("");
            }}
          >
            Add key point
          </CustomButton>
        </div>
      </div>

      <KeyPoint
        open={open}
        handleOpen={handleDialogOpen}
        keyPoints={keyPoints}
        setKeyPoints={setKeyPoints}
        updateId={updateId}
        setUpdateId={setUpdateId}
      />
    </>
  );
}

export default Carousal;
