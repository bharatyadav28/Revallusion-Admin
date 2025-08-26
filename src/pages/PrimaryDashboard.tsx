import ImageCarousal from "@/components/primary-dashboard/ImageCarousal";
import Sections from "@/components/primary-dashboard/Sections";
import SideImages from "@/components/primary-dashboard/SideImages";

const PrimaryDashboard = () => {
  return (
    <div className="flex flex-col gap-5">
      <ImageCarousal />
      <SideImages />
      <Sections />
    </div>
  );
};

export default PrimaryDashboard;
