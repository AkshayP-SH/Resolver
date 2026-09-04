export default function LoadingSpinner({ text = "Loading data..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-base-300 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-xs text-base-content/50 uppercase tracking-widest font-semibold animate-pulse">
        {text}
      </p>
    </div>
  );
}