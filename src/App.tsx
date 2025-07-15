import { ReactFlowProvider } from "@xyflow/react";
import LayoutFlow from "./components/LayoutFlow";
import CustomMarkers from "./components/CustomMarkers";

const App = () => {
  return (
    <ReactFlowProvider>
      <CustomMarkers />
      <LayoutFlow />
    </ReactFlowProvider>
  );
};

export default App;
