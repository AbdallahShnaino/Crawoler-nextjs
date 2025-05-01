export default function Loading() {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-gray-800 gap-6">
      <div className="w-16 h-16 border-4 border-[#60B5FF] border-t-[#FF9149] rounded-full animate-spin"></div>
      <p className="text-xl font-semibold text-[#60B5FF] animate-pulse">
        Loading, please wait...
      </p>
    </div>
  );
}
