import React, { useCallback, useEffect, useState, useRef } from "react";
import ReactFlow, { addEdge, Background, useNodesState, useEdgesState, ReactFlowProvider } from "reactflow";

// Components
import Sidebar from "./SideBar.js";
import Node from "./MessageNode.js";

// Utils
import { isAllNodeisConnected } from "./HelperFunctions.js";
import { nodes as initialNodes, edges as initialEdges } from "./InitialElements.js";

// Styles
import "reactflow/dist/style.css";
import { toast } from "react-toastify";

const nodeTypes = { node: Node }; // Register the MessageNode component as a node type

const OverviewFlow = () => {
  const reactFlowWrapper = useRef(null); // Ref for the ReactFlow wrapper element
  const textRef = useRef(null); // Ref for the text input

  // State for ReactFlow instance, nodes, edges, selectedNode, and isSelected
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSelected, setIsSelected] = useState(false);

  const onInit = (reactFlowInstance) => setReactFlowInstance(reactFlowInstance); // Initialize ReactFlow instance
  // drag over function 
  const onDragOver = useCallback((event) => { // Handle drag over event
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((event) => { // Handle drop event to add a new node
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData("application/reactflow");
    const label = event.dataTransfer.getData("content");
    const position = reactFlowInstance.project({ x: event.clientX - reactFlowBounds.left, y: event.clientY - reactFlowBounds.top });
    const newNode = { id: getId(), type, position, data: { heading: "Send Message", content: label } };
    setNodes((es) => es.concat(newNode));
    setSelectedNode(newNode.id);
  }, [reactFlowInstance, setNodes, setSelectedNode]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, markerEnd: { type: "arrowclosed" } }, eds)), [setEdges]);

  const [nodeName, setNodeName] = useState("Node 1"); // State for the selected node's name

  // Update selectedNode and isSelected based on the nodes state
  useEffect(() => {
    const node = nodes.find((node) => node.selected);
    setSelectedNode(node || null);
    setIsSelected(!!node);
  }, [nodes]);

  // Update nodeName with the selected node's content
  useEffect(() => {
    setNodeName(selectedNode?.data?.content || "");
  }, [selectedNode]);


  // Update the selected node's content with the new nodeName
  useEffect(() => {
    setNodes(nodes.map(node => node.id === selectedNode?.id ? { ...node, data: { ...node.data, content: nodeName || ' ' } } : node));
  }, [nodeName, nodes, selectedNode, setNodes]);

  const saveHandler = () => { // Handle save button click
    if (isAllNodeisConnected(nodes, edges)) toast.success("Congrats its correct");
    else toast.error("Please connect source nodes (Cannot Save Flow)");
  };

  return (
    <>
      <div className="header">
        <div className="logo">
          <h2>Gaurav Saraf</h2>
          <img onClick={(e)=>{window.open("https://www.linkedin.com/in/gaurav-saraf-39aa811a0/")}} height={20} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeDdBNTUzMrUDhaPy8isZc1fS4Iz6oKQGIeuYneW2-7A&s" />
        </div>
           <button className="saveBtn" onClick={saveHandler}>Save Changes</button>

      </div>
      <div className="dndflow">
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={onInit}
              onDrop={onDrop}
              onDragOver={onDragOver}
              attributionPosition="top-right"
            >
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          </div>
          <Sidebar isSelected={isSelected} textRef={textRef} nodeName={nodeName} setNodeName={setNodeName} />
        </ReactFlowProvider>
      </div>
    </>
  );
};

let id = 0; // Counter for generating unique node IDs
const getId = () => `dndnode_${id++}`; // Function to generate unique node IDs

export default OverviewFlow;