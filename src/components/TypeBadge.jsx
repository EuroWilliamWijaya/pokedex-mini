import { getTypeColor } from "../utils.js";

function TypeBadge({ typeName }) {
  return (
    <span
      className="type-badge"
      style={{ backgroundColor: getTypeColor(typeName) }}
    >
      {typeName}
    </span>
  );
}

export default TypeBadge;
