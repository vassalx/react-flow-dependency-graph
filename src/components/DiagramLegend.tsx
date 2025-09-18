interface DiagramLegendProps {
  items: { [key: string]: string };
}

export default function DiagramLegend({ items }: DiagramLegendProps) {
  return (
    <div className="flex flex-col gap-2 p-4 ml-10 bg-white shadow-md rounded-xl border border-gray-200 max-w-xs max-h-48 overflow-auto">
      <h2 className="text-lg font-semibold text-gray-800">Legend</h2>
      <div className="flex items-center gap-2">
        <span className="w-4 h-4 rounded-full border-4 border-black" />
        <span className="text-sm text-gray-700">Current selected Account</span>
      </div>
      {Object.keys(items).map((key) => (
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full bg-yellow-400"
            style={{ backgroundColor: items[key] }}
          />
          <span className="text-sm text-gray-700">Credit Group №{key}</span>
        </div>
      ))}
    </div>
  );
}
