import { CustomNodeProps } from "./types";

const addColorsToNodes = (
  nodes: CustomNodeProps[],
  creditGroups: { [key: string]: string }
) => {
  const result = nodes.map((node) => {
    if (node.data.group && creditGroups[node.data.group] && !node.data.color) {
      node.data.color = creditGroups[node.data.group];
    }
    return node;
  });
  return result;
};
export default addColorsToNodes;
