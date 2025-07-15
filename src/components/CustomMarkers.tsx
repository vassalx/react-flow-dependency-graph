const CustomMarkers = () => {
  return (
    <svg style={{ position: "absolute", top: 0, left: 0 }}>
      <defs>
        <marker
          id="dot"
          viewBox="0 0 10 10"
          refX="5"
          refY="10"
          markerWidth="10"
          markerHeight="10"
        >
          <circle cx="5" cy="5" r="5" />
        </marker>
      </defs>
    </svg>
  );
};

export default CustomMarkers;
