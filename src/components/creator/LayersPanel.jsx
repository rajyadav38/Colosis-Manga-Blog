function LayersPanel({ elements = [], selectedId }) {
  return (
    <div className="layers-panel">
      <h3>Layers</h3>

      {elements.length === 0 ? (
        <div className="text-muted" style={{ fontSize: "14px" }}>
          No layers yet
        </div>
      ) : (
        [...elements].reverse().map((element, index) => (
          <div
            key={element.id}
            className={`layer ${selectedId === element.id ? "active" : ""}`}
          >
            <span style={{ marginRight: 8 }}>
              {element.type === "bubble"
                ? "💬"
                : element.type === "text"
                  ? "📝"
                  : "📦"}
            </span>

            <span>
              {element.name ||
                element.text ||
                `${element.type} ${elements.length - index}`}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default LayersPanel;
