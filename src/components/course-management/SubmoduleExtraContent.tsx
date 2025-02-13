import CustomSheet from "../common/CustomSheet";

import AssignmentList from "./assignments/AssignmentsList";
import ResoursesList from "./resources/ResoursesList";

interface Props {
  open: boolean;
  handleOpen: () => void;
  submodule: string;
  courseId: string;
  moduleId: string;
  submoduleName?: string;
}

function ExtraContent({
  open,
  handleOpen,
  submodule,
  courseId,
  moduleId,
  submoduleName,
}: Props) {
  return (
    <CustomSheet open={open} handleOpen={handleOpen}>
      <div className="text-[1.2rem] uppercase mb-4">
        Topic - {submoduleName}
      </div>
      <div className="flex flex-col mt-8 gap-10">
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
