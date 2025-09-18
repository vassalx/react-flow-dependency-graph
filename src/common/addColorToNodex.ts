import { CustomNodeProps } from "./types";

const addColorsToNodes = (
  nodes: CustomNodeProps[],
  creditGroups: { [key: string]: string }
) => {
  console.log(nodes, creditGroups);
  const result = nodes.map((node) => {
    if (node.data.group && creditGroups[node.data.group] && !node.data.color) {
      node.data.color = creditGroups[node.data.group];
    }
    return node;
  });
  console.log("addColorsToNodes: ", result);
  return result;
};
export default addColorsToNodes;
