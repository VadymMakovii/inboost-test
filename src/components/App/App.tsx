import React, { useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { addNodes, addEdges } from 'redux/Nodes/nodesSlice';
import { selectNodes, selectEdges } from 'redux/Nodes/nodesSelectors';

import { MainContainer } from './App.styled';
import CustomNodes from '../Node';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'customNode',
    data: {},
    position: { x: 0, y: 0 },
  },
];

const nodeTypes = {
  customNode: CustomNodes,
};

const App: React.FC = () => {
  const savedNodes: Node[] = useSelector(selectNodes);
  const savedEdges: Edge[] = useSelector(selectEdges);

  const dispatch = useDispatch();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const result = applyNodeChanges(changes, savedNodes);
      dispatch(addNodes(result));
      return;
    },

    [dispatch, savedNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const result = applyEdgeChanges(changes, savedEdges);
      dispatch(addEdges(result));
      return;
    },
    [dispatch, savedEdges]
  );

  return (
    <MainContainer>
      <ReactFlow
        nodes={savedNodes.length > 0 ? savedNodes : initialNodes}
        edges={savedEdges.length > 0 ? savedEdges : []}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        proOptions={{hideAttribution: true}}
        style={{ backgroundColor: '#F9FAFF' }}
      />
    </MainContainer>
  );
};

export default App;
