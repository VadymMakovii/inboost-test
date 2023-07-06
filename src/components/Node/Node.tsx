import React, { memo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Handle,
  Position,
  NodeProps,
  MarkerType,
  Node,
  Edge,
  useReactFlow,
} from 'reactflow';
import {
  Container,
  Display,
  Text,
  DropdownWrapper,
  DropdownBtn,
  DropdownList,
  DropdownItem,
  Option,
} from './Node.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faSquare,
  faSquareCheck,
} from '@fortawesome/free-solid-svg-icons';
import { selectNodes } from 'redux/Nodes/nodesSelectors';

type NodeData = {
  id: string;
  parentNode: string;
  parentOption: string;
  option: string;
  childrenNodeId: string;
};

const Nodes: React.MemoExoticComponent<
  (T: NodeProps<NodeData>) => React.JSX.Element
> = memo(({ id, data }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const [value, setValue] = useState<null | string>(data.option || null);

  const savedNodes: Node[] = useSelector(selectNodes);

  const { setNodes, setEdges } = useReactFlow();

  const currentOption = data.parentOption
    ? `${data.parentOption}-${value ? value : '?'}`
    : value
    ? `${value}`
    : '';

  useEffect(() => {
    const node = savedNodes.find(node => node.id === id);

    if (!node) {
      return;
    }

    if (!node?.selected && isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  }, [id, isDropdownOpen, savedNodes]);

  useEffect(() => {
    if (!value) {
      return;
    }
    if (data.childrenNodeId) {
      const updateNode = (val: string) => {
        setNodes((nds: Node[]) =>
          nds.map(node => {
            const updNode = { ...node };
            if (updNode.id === id) {
              updNode.data = { ...updNode.data, option: val };
            }
            if (updNode.parentNode === id) {
              updNode.data = { ...updNode.data, parentOption: currentOption };
            }
            return updNode;
          })
        );
      };
      updateNode(value);
      setIsDropdownOpen(false);
      return;
    }

    const addNewNode = () => {
      const newNode = {
        id: `${+id + 1}`,
        type: 'customNode',
        position: { x: 250, y: 200 },
        data: { parentOption: currentOption },
        parentNode: id,
      };
      const newEdge = {
        id: `e${id}a`,
        source: id,
        target: `${+id + 1}`,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.Arrow,
        },
      };
      setNodes((nds: Node[]) => {
        nds.map(node => {
          if (node.id === id) {
            node.data = { ...node.data, childrenNodeId: `${+id + 1}` };
          }
          return node;
        });
        return nds.concat(newNode);
      });
      setEdges((eds: Edge[]) => eds.concat(newEdge));
    };
    addNewNode();
    setIsDropdownOpen(false);
  }, [currentOption, data.childrenNodeId, id, setEdges, setNodes, value]);

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleKeyDown: React.KeyboardEventHandler = (
    e: React.KeyboardEvent
  ) => {
    if (!isDropdownOpen) {
      return;
    }
    if (e.code === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  const renderDropdownOptions = () => {
    const options = [];
    for (let i = 1; i <= 6; i++) {
      options.push(
        <DropdownItem key={i}>
          <Option
            type="button"
            $isSelected={i.toString() === value}
            onClick={() => setValue(i.toString())}
          >
            {i.toString() === value ? (
              <FontAwesomeIcon
                icon={faSquareCheck}
                style={{ color: '#95BEFC' }}
                size="lg"
              />
            ) : (
              <FontAwesomeIcon
                icon={faSquare}
                style={{
                  color: '#FFFFFF',
                  borderColor: '#95BEFC',
                  borderRadius: 2,
                }}
                size="2xs"
                border
              />
            )}
            Варіант {i}
          </Option>
        </DropdownItem>
      );
    }
    return options;
  };

  return (
    <Container onKeyDown={handleKeyDown}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ visibility: 'hidden' }}
      />
      <Display>
        <Text>{currentOption}</Text>
      </Display>
      <DropdownWrapper className={isDropdownOpen ? 'nodrag' : ''}>
        <DropdownBtn
          $isOpen={isDropdownOpen}
          type="button"
          onClick={handleDropdownClick}
        >
          {isDropdownOpen
            ? 'Виберіть значення'
            : data.option
            ? `Варіант ${data.option}`
            : 'Вибрати значення'}
          {
            <FontAwesomeIcon
              icon={isDropdownOpen ? faChevronUp : faChevronDown}
              style={{ color: '#2C7DFA' }}
              size="sm"
            />
          }
        </DropdownBtn>
        {isDropdownOpen && (
          <DropdownList>{renderDropdownOptions()}</DropdownList>
        )}
      </DropdownWrapper>
      <Handle
        type="source"
        position={data.parentOption ? Position.Right : Position.Bottom}
        style={{
          backgroundColor: '#ADB5BD',
          translate: data.parentOption ? '-5px 45px' : '0px -6px',
          width: 6,
          height: 6,
          border: 'none',
          visibility: !value || isDropdownOpen ? 'hidden' : 'visible',
        }}
      />
    </Container>
  );
});

export default Nodes;
