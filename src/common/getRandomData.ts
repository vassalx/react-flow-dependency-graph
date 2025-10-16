import { CustomEdgeProps, CustomNodeProps } from "./types";
import normalizeEdges from "./normalizeEdges";
import normalizeNodes from "./normalizeNodes";

// Utility: random string generator
function randomWord(length = 6) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  return Array.from(
    { length },
    () => letters[Math.floor(Math.random() * letters.length)]
  ).join("");
}

// Utility: generate random readable company/dept/contact names
function randomCompanyName() {
  return (
    randomWord(3 + Math.floor(Math.random() * 4))[0].toUpperCase() +
    randomWord(3 + Math.floor(Math.random() * 4)).slice(1) +
    " " +
    randomWord(3 + Math.floor(Math.random() * 4))[0].toUpperCase() +
    randomWord(3 + Math.floor(Math.random() * 4)).slice(1)
  );
}

function randomDepartmentName() {
  return (
    randomWord(4 + Math.floor(Math.random() * 3))[0].toUpperCase() +
    randomWord(4 + Math.floor(Math.random() * 3)).slice(1)
  );
}

function randomPersonName() {
  const first =
    randomWord(3 + Math.floor(Math.random() * 4))[0].toUpperCase() +
    randomWord(3 + Math.floor(Math.random() * 4)).slice(1);
  const last =
    randomWord(3 + Math.floor(Math.random() * 4))[0].toUpperCase() +
    randomWord(3 + Math.floor(Math.random() * 4)).slice(1);
  return `${first} ${last}`;
}

const getRandomData = (nodeCount: number) => {
  const nodes: Partial<CustomNodeProps>[] = [];
  const edges: Partial<CustomEdgeProps>[] = [];

  const relationLabels = [
    "Leads",
    "CEO of",
    "Manages",
    "Oversees",
    "Collaborates with",
  ];

  // --- 1. Create root node
  const rootCompany = randomCompanyName();
  const rootId = "1";
  nodes.push({
    id: rootId,
    data: {
      label: `${rootCompany} Corporation`,
      group: "1",
    },
  });

  // --- 2. Create department + contact pairs
  for (let i = 2; i <= nodeCount; i++) {
    const depId = String(i);
    const contactId = depId + "a";

    const department = randomDepartmentName();
    const person = randomPersonName();

    // Department node
    nodes.push({
      id: depId,
      data: { label: department, group: "1" },
    });

    // Contact node
    nodes.push({
      id: contactId,
      data: { label: `${person} - Head of ${department}`, type: "Contact" },
    });

    // Contact → Department (dashed)
    edges.push({
      id: `e${edges.length + 1}`,
      source: contactId,
      target: depId,
      label: "Leads",
      data: { lineType: "dashed" },
    });

    // Department → Random other node (usually root or another department)
    const possibleTargets = nodes
      .map((n) => n.id)
      .filter((id) => id !== depId && !id?.endsWith("a"));
    const target =
      possibleTargets[Math.floor(Math.random() * possibleTargets.length)];

    edges.push({
      id: `e${edges.length + 1}`,
      source: depId,
      target,
      label: relationLabels[Math.floor(Math.random() * relationLabels.length)],
    });
  }

  return {
    edges: normalizeEdges(edges as CustomEdgeProps[]),
    nodes: normalizeNodes(nodes as CustomNodeProps[]),
    id: "1",
    legend: {
      "1": "blue",
    },
  };
};

export default getRandomData;