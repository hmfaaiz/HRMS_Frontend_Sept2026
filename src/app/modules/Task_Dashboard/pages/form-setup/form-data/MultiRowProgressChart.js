import React, { useMemo, useRef, useState } from "react";

const colorPalette = [
  "#3ec9a7",
  "#2d2e83",
  "#6c3fa7",
  "#f45c2c",
  "#3db6e9",
  "#f0ad4e",
  "#d9534f",
  "#5bc0de",
  "#5cb85c",
  "#428bca",
  "#ff7f50",
  "#9b59b6",
  "#e67e22",
  "#1abc9c",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#34495e",
  "#16a085",
  "#27ae60",
  "#2980b9",
  "#8e44ad",
  "#2c3e50",
  "#f39c12",
  "#d35400",
  "#c0392b",
  "#7f8c8d",
  "#95a5a6",
  "#bdc3c7",
  "#7f8c8d",
  "#95a5a6",
  "#bdc3c7",
  "#1abc9c",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#34495e",
  "#16a085",
  "#27ae60",
  "#2980b9",
  "#8e44ad",
  "#2c3e50",
];

const hashToIndex = (str, mod) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % mod;
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const MultiRowProgressChart = ({ data = [], heading = "" }) => {
  const wrapRef = useRef(null);

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    text: "",
    color: "#000",
  });

  const computed = useMemo(() => {
    const safe = Array.isArray(data) ? data : [];
    const total = safe.reduce((sum, it) => sum + Number(it?.value || 0), 0);

    const rows = safe.map((it, i) => {
      const label = String(it?.label ?? "");
      const value = Number(it?.value || 0);
      const percent = total ? (value / total) * 100 : 0;
      const color = label
        ? colorPalette[hashToIndex(label, colorPalette.length)]
        : colorPalette[0];

      return { ...it, label, value, percent, color };
    });

    return { total, rows };
  }, [data]);

  const showTooltip = (e, row) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const percent = computed.total ? row.percent.toFixed(1) : "0.0";

    // mouse position relative to wrapper
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    // tooltip size approx (avoid overflow). If you want exact, we can measure via ref.
    const TIP_W = 220;
    const TIP_H = 28;

    const x = clamp(rawX + 10, 8, rect.width - TIP_W - 8);
    const y = clamp(rawY + 10, 8, rect.height - TIP_H - 8);

    setTooltip({
      visible: true,
      x,
      y,
      color: row.color,
      text: `${row.label}: ${Number(row.value).toLocaleString()} (${percent}%)`,
    });
  };

  const hideTooltip = () => setTooltip((t) => ({ ...t, visible: false }));

  const hasData = computed.rows.length > 0;

  return (
    // ✅ IMPORTANT: position relative so tooltip stays inside component
    <div
      className="bg-white rounded-lg px-3 py-2 relative max-h-80 scrollbar-fancy overflow-auto"
      ref={wrapRef}
    >
      {heading ? (
        <div className="flex justify-between items-start">
          <h6 className="font-bold mb-0 text-primary">{heading}</h6>
        </div>
      ) : null}

      {!hasData ? (
        <div className="py-6 text-center text-sm text-gray-500">
          No Record Available
        </div>
      ) : (
        <div className="mt-2 space-y-2" onMouseLeave={hideTooltip}>
          {computed.rows.map((row, idx) => {
            const w = Math.max(0, Math.min(100, row.percent));
            return (
              <div key={`${row.label}-${idx}`} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium truncate" title={row.label}>
                    {row.label}
                  </span>
                  <span className="font-bold">
                    {Number(row.value || 0).toLocaleString()}
                  </span>
                </div>

                <div
                  className="relative w-full rounded-md overflow-hidden"
                  style={{ height: 24, background: "#E5E7EB" }}
                  onMouseMove={(e) => showTooltip(e, row)}
                >
                  <div
                    style={{
                      width: `${w}%`,
                      height: "100%",
                      background: row.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tooltip.visible ? (
        <div
          style={{
            position: "absolute",
            left: tooltip.x,
            top: tooltip.y,
            background: "#E6F8FF",
            color: "#0093DD",
            fontSize: "10.4px",
            fontWeight: 500,
            padding: "4px 8px",
            borderRadius: 6,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 9999,
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
            borderLeft: `3px solid ${tooltip.color}`,
          }}
        >
          {tooltip.text}
        </div>
      ) : null}
    </div>
  );
};

export default MultiRowProgressChart;
