import { Component, useEffect, useState } from "react";

interface Props {
  name: string;
}

interface State {
  count: number;
}

export class MyClassComponent extends Component<Props, State> {
  state = { count: 0 };

  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  };

  componentDidMount() {
    console.log("Component did mount");
  }

  componentWillUnmount() {
    console.log("Component will unmount");
  }

  render() {
    const { name } = this.props;
    const { count } = this.state;

    return (
      <div className="flex flex-col items-center justify-center rounded border border-skin-accent p-2">
        <p>props.name: {name}</p>
        <p>state.count: {count}</p>
        <button
          className="rounded-full border border-skin-accent px-2 py-1"
          onClick={this.handleClick}
        >
          <p className="m-0">Increase</p>
        </button>
      </div>
    );
  }
}

export function MyFunctionComponent({ name }: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Component did mount");
    return () => {
      console.log("Component will unmount");
    };
  }, []);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center rounded border border-skin-accent p-2">
      <p>props.name: {name}</p>
      <p>state.count: {count}</p>
      <button
        className="rounded-full border border-skin-accent px-2 py-1"
        onClick={handleClick}
      >
        <p className="m-0">Increase</p>
      </button>
    </div>
  );
}
