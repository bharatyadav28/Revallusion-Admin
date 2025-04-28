import { useState } from "react";

import { BiNetworkChart as GatewayIcon } from "react-icons/bi";

import GatewayForm from "./GatewayForm";

function GatewayButton() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen((prev) => !prev);

  return (
    <div>
      <button className="!p-0 m-0 flex gap-1 items-center" onClick={handleOpen}>
        <div>
          <div className="lg:block hidden">Gateway</div>
        </div>
        <GatewayIcon size={15} color="#c8c4c2" />
      </button>
      <GatewayForm open={open} handleOpen={handleOpen} />
    </div>
  );
}

export default GatewayButton;
