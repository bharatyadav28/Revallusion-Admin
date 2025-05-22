import { useRef } from "react";
import ReactPlayer from "react-player";
import { CustomDialog } from "./common/CustomDialog";

interface Props {
  open: boolean;
  handleOpen: () => void;
  source: string;
}
const VideoPlayer = ({ open, handleOpen, source }: Props) => {
  const playerRef = useRef(null);

  return (
    <CustomDialog
      open={open}
      handleOpen={handleOpen}
      className="lg:w-[calc(100%-30vw)] w-full p-0"
    >
      <ReactPlayer
        ref={playerRef}
        // url="/videos/2d489a66-4504-46bb-80f6-281eabf5394c/1080p.m3u8"
        url={source}
        controls
        playing
        width="100%"
        height="auto"
        config={{
          file: {
            forceHLS: true,
            hlsOptions: {
              debug: false,
              enableWorker: true,
              lowLatencyMode: true,
            },
          },
        }}
      />
    </CustomDialog>
  );
};

export default VideoPlayer;
