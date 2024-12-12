const WorkInProgress = () => {
  return (
    <div className="flex items-center justify-center h-full bg-[hsl(var(--border))] text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-[var(--lightpurple)] border-opacity-75 mx-auto mb-6"></div>
        <h1 className="text-3xl font-bold mb-2">Work in Progress</h1>
        <p className="text-gray-400">
          We're crafting something amazing. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
};

export default WorkInProgress;
