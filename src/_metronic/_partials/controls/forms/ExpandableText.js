// ExpandableText.jsx
import { useState, useRef, useEffect } from "react";

const ExpandableText = ({
  children,
  lines = 6,
  className = "",
  showMoreText = "more",
  showLessText = "less",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);
  const containerRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      const element = contentRef.current;
      const isOverflow = element.scrollHeight > element.clientHeight;
      setIsOverflowing(isOverflow);
      setIsInitialized(true);
    }
  }, [children]);

  useEffect(() => {
    const handleResize = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        setIsOverflowing(element.scrollHeight > element.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle click anywhere on the container
  const handleContainerClick = () => {
    if (isOverflowing && isInitialized) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative cursor-pointer"
      onClick={handleContainerClick}
    >
      <div
        ref={contentRef}
        className={`overflow-hidden transition-all duration-300 ${
          !isExpanded ? `line-clamp-${lines}` : ""
        } ${className}`}
        style={{
          display: !isExpanded ? "-webkit-box" : "block",
          WebkitBoxOrient: "vertical",
          ...(!isExpanded && {
            WebkitLineClamp: lines,
          }),
          ...(isExpanded && {
            WebkitLineClamp: "unset",
          }),
        }}
      >
        {children}
      </div>

      {isOverflowing && isInitialized && !isExpanded && (
        <span
          className="text-black hover:font-semibold font-bold text-sm inline-block underline cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // Prevent double triggering
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? `` : `...${showMoreText}`}
        </span>
      )}
    </div>
  );
};

export default ExpandableText;
