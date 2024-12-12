import { MdConstruction } from "react-icons/md";

const WorkInProgress = () => {
  return (
    <div className="flex items-center justify-center h-full bg-[hsl(var(--border))] text-white">
      <div className="text-center">
        <div className="flex items-center justify-center">
          <MdConstruction
            style={{ fontSize: "50px", color: "var(--lightpurple)" }}
          />
        </div>

        <h1 className="text-3xl font-bold mb-2">Work in Progress</h1>
        <p className="text-gray-400">
          We're crafting something amazing. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
};

export default WorkInProgress;
