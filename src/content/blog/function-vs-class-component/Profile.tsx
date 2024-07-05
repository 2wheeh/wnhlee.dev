import { Component, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  user: string;
}

class CProfilePage extends Component<Props> {
  showMessage = () => {
    alert("Followed " + this.props.user);
  };

  handleClick = () => {
    setTimeout(this.showMessage, 3000);
  };

  render() {
    return (
      <button
        className="rounded-full border border-skin-accent px-2 py-1"
        onClick={this.handleClick}
      >
        <p className="m-0">Follow</p>
      </button>
    );
  }
}

function FProfilePage({ user }: Props) {
  const showMessage = () => {
    alert("Followed " + user);
  };

  const handleClick = () => {
    setTimeout(showMessage, 3000);
  };

  return (
    <button
      className="rounded-full border border-skin-accent px-2 py-1"
      onClick={handleClick}
    >
      <p className="m-0">Follow</p>
    </button>
  );
}

export function Profile() {
  const [user, setUser] = useState("won");

  return (
    <div className="space-y-2 rounded border border-skin-accent p-4">
      <label className="flex w-fit items-center space-x-2">
        <p className="m-0">프로필 선택: </p>
        <select
          value={user}
          onChange={e => setUser(e.target.value)}
          className="h-fit hover:cursor-pointer"
        >
          <option value="won">won</option>
          <option value="hee">hee</option>
          <option value="lee">lee</option>
        </select>
      </label>
      <div className="flex items-center space-x-2">
        <CProfilePage user={user} />
        <p>(class)</p>
      </div>
      <div className="flex items-center space-x-2">
        <FProfilePage user={user} />
        <p>(function)</p>
      </div>
    </div>
  );
}

class CProfilePageFixed extends Component<Props> {
  render() {
    const { user } = this.props;

    const showMessage = () => {
      alert("Followed " + user);
    };

    const handleClick = () => {
      setTimeout(showMessage, 3000);
    };

    return (
      <button
        className="rounded-full border border-skin-accent px-2 py-1"
        onClick={handleClick}
      >
        <p className="m-0">Follow</p>
      </button>
    );
  }
}

export function ProfileFixed() {
  const [user, setUser] = useState("won");

  return (
    <div className="space-y-2 rounded border border-skin-accent p-4">
      <label className="flex w-fit items-center space-x-2">
        <p className="m-0">프로필 선택: </p>
        <select
          value={user}
          onChange={e => setUser(e.target.value)}
          className="h-fit hover:cursor-pointer"
        >
          <option value="won">won</option>
          <option value="hee">hee</option>
          <option value="lee">lee</option>
        </select>
      </label>
      <div className="flex items-center space-x-2">
        <CProfilePageFixed user={user} />
        <p>(class)</p>
      </div>
      <div className="flex items-center space-x-2">
        <FProfilePage user={user} />
        <p>(function)</p>
      </div>
    </div>
  );
}
