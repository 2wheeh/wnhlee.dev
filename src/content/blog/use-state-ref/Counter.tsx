import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="border border-b border-white p-10">
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
