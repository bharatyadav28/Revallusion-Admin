import { useState } from "react";

import GatewayForm from "./GatewayForm";

function GatewayButton() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen((prev) => !prev);

  return (
    <div>
      <button className="!p-0 m-0" onClick={handleOpen}>
        Gateway
      </button>
      <GatewayForm open={open} handleOpen={handleOpen} />
    </div>
  );
}

export default GatewayButton;
