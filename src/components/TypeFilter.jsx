import { KNOWN_TYPES, getTypeColor } from "../utils.js";

function TypeFilter({ activeType, onTypeSelect }) {
  return (
    <div className="type-filter-container">
      <div className="type-filter-scroll">
        <button
          className={`type-filter-btn ${activeType === "all" ? "active" : ""}`}
          onClick={() => onTypeSelect("all")}
          style={activeType === "all" ? { backgroundColor: "var(--color-primary)", color: "white" } : {}}
        >
          All
        </button>
        {KNOWN_TYPES.map((type) => {
          const isActive = activeType === type;
          const typeColor = getTypeColor(type);
          
          return (
            <button
              key={type}
              className={`type-filter-btn ${isActive ? "active" : ""}`}
              onClick={() => onTypeSelect(type)}
              style={
                isActive 
                  ? { backgroundColor: typeColor, color: "white", borderColor: typeColor }
                  : { color: typeColor, borderColor: typeColor }
              }
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TypeFilter;
