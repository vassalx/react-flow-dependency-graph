# React Flow chart
 
This project is used to test the React Flow library capabilities.
Functionality:
- upload JSON to generate diagram
- view diagram
- download as image

### Run and Install
Execute this commend to install
```npm install```
Execute this command to run
```npm run dev```

### JSON Structure

### Nodes
Each node in the diagram must contain the following properties:

- `id` (string): A unique identifier for the node.
- `data` (object): Contains additional information about the node.
  - `label` (string | ReactNode): The displayed name of the node.
  - `color` (string | string[], optional): The color of the node. Can be a single color string or an array of strings for gradients.
  - `textColor` (string, optional): The color of the text inside the node.
  - `type` (string, optional): Defines the type of the node. If the type is "person", the node will be displayed in the first row.

#### Example Node
```json
{
  "id": "1",
  "data": {
    "label": "John Doe",
    "color": "blue",
    "textColor": "white",
    "type": "person"
  }
}
```

### Edges
Each edge represents a connection between two nodes and must contain the following properties:

- `id` (string): A unique identifier for the edge.
- `source` (string): The `id` of the starting node.
- `target` (string): The `id` of the ending node.
- `data` (object, optional): Contains additional information about the edge.
  - `sourceLabel` (string, optional): Label displayed near the source node.
  - `targetLabel` (string, optional): Label displayed near the target node.
  - `markerStart` (string, optional): Type of marker near the source node.
  - `markerEnd` (string, optional): Type of marker near the target node.
      - `dot`
      - `arrow`
      - `arrowclosed`
  - `label` (string, optional): Label displayed in the middle of the edge.
  - `lineType` (string, optional): Defines the style of the edge line. Can be one of:
    - `dotted`
    - `dashed`
    - `solid`
    - `solid-dotted`

#### Example Edge
```json
{
  "id": "e1",
  "source": "1",
  "target": "2",
  "data": {
    "label": "Connected",
    "lineType": "dashed"
  }
}
```

## Full Example JSON
```json
{
  "nodes": [
    {
      "id": "1",
      "data": {
        "label": "John Doe",
        "color": "blue",
        "textColor": "white",
        "type": "person"
      }
    },
    {
      "id": "2",
      "data": {
        "label": "Company",
        "color": ["red", "orange"],
        "textColor": "black"
      }
    }
  ],
  "edges": [
    {
      "id": "e1",
      "source": "1",
      "target": "2",
      "data": {
        "label": "Works at",
        "lineType": "dashed"
      }
    }
  ]
}
```

### Notes
- Ensure that `id` values are unique across nodes and edges.
- If a node has `type: "person"`, it will be displayed in the first row.
- Colors should be valid CSS color values.
- Edge `lineType` should be one of the predefined styles (`dotted`, `dashed`, `solid`, `solid-dotted`).

This format ensures that diagrams are structured correctly and display as expected in the application.

