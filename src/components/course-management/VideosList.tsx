import {
  Table,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table";
import { courseVideoType } from "@/lib/interfaces-types";
import { UpdateButton } from "../common/Inputs";

interface Props {
  data: courseVideoType[];
  isSubTable?: boolean;
  handleOpenDialog: () => void;
  setDialogData: (data: any) => void;
  courseId: string;
  moduleId?: string;
  submoduleId?: string;
}
function VideosList({
  data,
  isSubTable,
  handleOpenDialog,
  setDialogData,
  courseId,
  moduleId,
  submoduleId,
}: Props) {
  // Sort data by sequence
  const sortedData = [...data]?.sort((a, b) => a.sequence - b.sequence);

  const MainTable = (
    <Table className="custom-table bg-[#1B1B1B] w-full">
      <TableCaption>A list of videos</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[6rem]">Video name</TableHead>
          <TableHead className="min-w-[6rem]">Video Description</TableHead>
          <TableHead>Sequence</TableHead>
          <TableHead className="">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {sortedData?.map((video) => (
          <TableRow
            className="!hover:bg-blue-500 dfdf  s"
            key={video?.videoId?._id}
          >
            <TableCell className="font-medium">
              {video?.videoId?.title}
            </TableCell>
            <TableCell className="font-medium">
              {video?.videoId?.description}
            </TableCell>
            <TableCell className="font-medium">{video?.sequence}</TableCell>

            {/* Action buttons */}
            <TableCell className="font-medium">
              <div className="flex gap-2 items-center">
                <UpdateButton
                  handleClick={() => {
                    handleOpenDialog();
                    setDialogData({
                      type: "video",
                      isEdit: true,
                      item: {
                        _id: video?.videoId?._id,
                        courseId,
                        moduleId,
                        submoduleId,
                        sequence: video?.sequence,
                      },
                    });
                  }}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // Is subtable
  const MainContent = !isSubTable ? (
    MainTable
  ) : (
    <TableRow>
      <TableCell colSpan={4}>{MainTable}</TableCell>
    </TableRow>
  );

  return <>{MainContent}</>;
}

export default VideosList;
