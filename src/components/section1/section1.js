import React, { useRef } from 'react';
import "./section1.css"

function Example() {
  console.log("Rendering Example Component"); 
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <h1>Example Page</h1>
      <input 
        ref={inputRef} 
        type="text" 
        placeholder="Type something" 
      />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}
export default Example;