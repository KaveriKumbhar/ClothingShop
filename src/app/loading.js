export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      <span className="ml-4 text-indigo-500 font-semibold">Loading...</span>
    </div>
  );
} 