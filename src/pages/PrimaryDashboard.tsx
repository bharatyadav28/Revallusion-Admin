import ImageCarousal from "@/components/primary-dashboard/ImageCarousal";
import Sections from "@/components/primary-dashboard/Sections";

const PrimaryDashboard = () => {
  return (
    <div className="flex flex-col gap-5">
      <ImageCarousal />
      <Sections />
    </div>
  );
};

export default PrimaryDashboard;
