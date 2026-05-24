import { useState } from "react";

function Tooltip({ children, text, position = "top" }) {
  const [show, setShow] = useState(false);

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-3",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-3",
    left: "right-full top-1/2 -translate-y-1/2 mr-3",
    right: "left-full top-1/2 -translate-y-1/2 ml-3",
  };

  const tipPositions = {
    top: "top-full left-1/2 -translate-x-1/2 -mt-[6px]",
    bottom: "bottom-full left-1/2 -translate-x-1/2 mt-[6px]",
    left: "left-full top-1/2 -translate-y-1/2 -ml-[6px]",
    right: "right-full top-1/2 -translate-y-1/2 ml-[6px]",
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      {show && (
        <div
          className={`absolute z-50 ${positions[position]} max-w-55`}
        >
          {/* Tooltip */}
          <div className="relative rounded-xl bg-[#38a0f5] px-3 py-2 text-sm font-semibold text-white shadow-xl whitespace-normal wrap-break-words">
            {text}

            {/* Tip */}
            <div
              className={`absolute h-3 w-3 rotate-45 rounded-xs bg-[#38a0f5] ${tipPositions[position]}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Tooltip;