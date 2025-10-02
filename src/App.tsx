import { ReactFlowProvider } from "@xyflow/react";
import LayoutFlow from "./components/LayoutFlow";
import CustomMarkers from "./components/CustomMarkers";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <ReactFlowProvider>
      <CustomMarkers />
      <LayoutFlow />
      <Toaster />
    </ReactFlowProvider>
  );
};

export default App;
