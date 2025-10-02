interface DiagramLegendProps {
  items: { [key: string]: string };
}

export default function DiagramLegend({ items }: DiagramLegendProps) {
  return (
    <div className="flex flex-col gap-2 p-4 ml-10 bg-white shadow-md rounded-xl border border-gray-200 max-w-xs max-h-48 overflow-auto">
      <h2 className="text-lg font-semibold text-gray-800">Legend</h2>
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-full border-4 border-black" />
        <span className="text-gray-700">Current selected Account</span>
      </div>
      {Object.keys(items).map((key) => (
        <div
          className="p-2 rounded-xl border border-dashed bg-gray-100 flex-auto"
          style={{
            borderColor: items[key],
            color: items[key],
          }}
        >
          Credit Group №{key}
        </div>
      ))}
    </div>
  );
}
