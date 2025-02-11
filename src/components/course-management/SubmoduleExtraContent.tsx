import CustomSheet from "../common/CustomSheet";

import AssignmentList from "./assignments/AssignmentsList";
import ResoursesList from "./resources/ResoursesList";

interface Props {
  open: boolean;
  handleOpen: () => void;
  submodule: string;
  courseId: string;
  moduleId: string;
}

function ExtraContent({
  open,
  handleOpen,
  submodule,
  courseId,
  moduleId,
}: Props) {
  return (
    <CustomSheet open={open} handleOpen={handleOpen}>
      <div className="flex flex-col gap-10">
        <AssignmentList
          submodule={submodule}
          courseId={courseId}
          moduleId={moduleId}
        />

        <ResoursesList submodule={submodule} />
      </div>
    </CustomSheet>
  );
}

export default ExtraContent;
