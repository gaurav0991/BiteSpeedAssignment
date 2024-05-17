import React, { memo, useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';

const TextNode = memo(({ data, isConnectable }) => {
  const [text, setText] = useState(data.label || '');

  const onChange = (event) => {
    setText(event.target.value);
    data.onChange(event.target.value);
  };

  return (
    <>
      <div>
        <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
        <input value={text} onChange={onChange} />
        <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      </div>
    </>
  );
});

export default TextNode;