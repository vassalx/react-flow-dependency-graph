export default function DiagramLegend() {
  return (
    <div className="flex flex-col gap-2 p-4 ml-10 bg-white shadow-md rounded-xl border border-gray-200 max-w-xs">
      <h2 className="text-lg font-semibold text-gray-800">Legend</h2>
      <div className="flex items-center gap-2">
        <span className="w-4 h-4 rounded-full bg-green-500" />
        <span className="text-sm text-gray-700">
          Number of related Accounts
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-4 h-4 rounded-full bg-yellow-400" />
        <span className="text-sm text-gray-700">
          Current selected Account
        </span>
      </div>
    </div>
  );
}
