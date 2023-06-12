import React from "react";
import PropTypes from "prop-types";

function getCategoryStyle(metrics, statusTypes) {
  // first we get the set of status_types for the category
  // each of them should have an importance level
  // we pick the color of the highest importance level
  let maxImportance = -1;
  let maxImportanceColor = null;
  let maxImportanceBackgroundColor = null;
  Object.values(metrics).forEach((metric) => {
    const statusType = metric[1] || "info";
    const importance = statusTypes[statusType]?.importance || 0;
    if (importance > maxImportance || maxImportance === -1) {
      maxImportance = importance;
      maxImportanceColor = statusTypes[statusType]?.color || "grey";
      maxImportanceBackgroundColor =
        statusTypes[statusType]?.backgroundColor || "white";
    }
  });
  return {
    marginBottom: 0,
    paddingBottom: 0,
    color: maxImportanceColor,
    backgroundColor: maxImportanceBackgroundColor,
    border: maxImportanceBackgroundColor
      ? `2px solid ${maxImportanceBackgroundColor}`
      : "2px solid grey",
  };
}

function displayValue(metric, statusTypes) {
  let value = metric[0];
  let val = value;
  let type = metric[1];
  if (Array.isArray(value) && value?.length > 0) {
    if (
      value.length === 2 &&
      value[0] &&
      value[1] &&
      new Date(`${value[0]} ${value[1]}`).getTime()
    ) {
      val = `${value[0]}T${value[1]} (UTC)`;
    } else {
      val = value.join(", ");
    }
  } else if ([null, undefined, []].includes(value)) {
    val = "N/A";
  } else if (typeof value === "object") {
    // if it has x and y as keys, we'll create an svg graph
    if (Array.isArray(value?.x) && Array.isArray(value?.y) && value.x.length === value.y.length) {
      const max_x = Math.max(...value.x);
      const max_y = Math.max(...value.y);
      const min_x = Math.min(...value.x);
      const min_y = Math.min(...value.y);
      val = (
          <svg viewBox="0 0 500 200">
            {value.x_unit && (
            <text x="190" y="195" fill="grey" fontSize="1rem">{value.x_unit}</text>
            )}
            {value.y_unit && (
            <text x="0" y="100" fill="grey" fontSize="1rem">{value.y_unit}</text>
            )}
            {/* show a grid with units */}
            <line x1="25" y1="25" x2="25" y2="175" stroke="grey" strokeWidth="1" />
            <line x1="25" y1="175" x2="475" y2="175" stroke="grey" strokeWidth="1" />
            <text x="25" y="25" fill="grey" fontSize="1rem" textAnchor="end">{max_y}</text>
            <text x="25" y="175" fill="grey" fontSize="1rem" textAnchor="end">{min_y}</text>
            <text x="25" y="195" fill="grey" fontSize="1rem" textAnchor="middle">{min_x}</text>
            <text x="475" y="195" fill="grey" fontSize="1rem" textAnchor="middle">{max_x}</text>
            <polyline
              fill="none"
              stroke="grey"
              strokeWidth="2"
              points={value.x
                .map((x, i) => `${((x - min_x)/ (max_x - min_x) * 450) + 25},${(200 - (value.y[i] - min_y) / (max_y - min_y) * 150) - 25}`)
                .join(" ")}
            />
            {/* show a marker at each of the points */}
            {value.x.map((x, i) => (
              <circle
                cx={((x - min_x)/ (max_x- min_x) * 450) + 25}
                cy={(200 - (value.y[i] - min_y) / (max_y - min_y) * 150) - 25}
                r="4"
                fill={statusTypes[value?.status[i]]?.backgroundColor || "blue"}
              />
            ))}
            {/* show a label like (x,y) for each of the points */}
            {value.x.map((x, i) => (
              <text
                x={((x - min_x)/ (max_x- min_x) * 450) + 25}
                y={(200 - (value.y[i] - min_y) / (max_y - min_y) * 150) - 35}
                fill="grey"
                fontSize="0.75rem"
                textAnchor="middle"
              >
                ({x},{value.y[i]})
              </text>
            ))}
          </svg>
      );
    } else {
      val = JSON.stringify(value);
    }
  } else {
    val = `${value}`
  }
  
  if (typeof val === "string") {
    val = (
      <h5
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: statusTypes[type]
            ?.backgroundColor
            ? statusTypes[type]
                .backgroundColor
            : null,
          color: statusTypes[type]?.color
            ? statusTypes[type].color
            : "black",
          paddingLeft: "0.75rem",
        }}
      >
        {val}
      </h5>
    )
  } else {
    val = (
      <div style={{ margin: 0, padding: 0, paddingLeft: "0.75rem" }}>
        {val}
      </div>
    )
  }       

  return val;
}

const JsonDashboard = ({ title, data, statusTypes, showTitle }) => {
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    return null;
  }
  return (
    <div style={{ width: "100%", height: "100%" }}>
      {showTitle && (
        <h1 style={{ margin: 0, padding: 0, fontSize: "2rem" }}>{title}</h1>
      )}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {Object.keys(data).map((category) => {
          if (
            data[category] !== null &&
            typeof data[category] === "object" &&
            Object.keys(data[category]).length > 0
          ) {
            const categoryStyle = getCategoryStyle(data[category], statusTypes);
            return (
              <div
                key={category}
                style={{
                  border: categoryStyle.border,
                  marginBottom: "0.75rem",
                  padding: 0,
                  borderRadius: "0.3rem",
                  overflow: "hidden",
                }}
              >
                <h2
                  style={{
                    backgroundColor: categoryStyle.backgroundColor,
                    color: categoryStyle.color,
                    margin: 0,
                    padding: 0,
                    paddingLeft: "0.25rem",
                  }}
                >
                  {category}
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    marginRight: "-2px",
                  }}
                >
                  {Object.keys(data[category]).map((key) => (
                    <div
                      key={key}
                      style={{
                        margin: 0,
                        padding: 0,
                        borderRight: "2px solid #ccc",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          padding: 0,
                          paddingLeft: "0.5rem",
                        }}
                      >
                        {key}
                      </h3>
                        {displayValue(data[category][key], statusTypes)}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

JsonDashboard.propTypes = {
  title: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.shape()),
  statusTypes: PropTypes.objectOf(PropTypes.shape()),
  showTitle: PropTypes.bool,
};

JsonDashboard.defaultProps = {
  title: "Instrument Dashboard",
  data: {},
  statusTypes: {
    ok: {
      backgroundColor: "#52A450",
      color: "white",
      importance: 0,
    },
    info: {
      backgroundColor: "#52A450",
      color: "white",
      importance: 0,
    },
    warning: {
      backgroundColor: "#FF7900",
      color: "white",
      importance: 1,
    },
    danger: {
      backgroundColor: "#CB4449",
      color: "white",
      importance: 2,
    },
    error: {
      backgroundColor: "#CB4449",
      color: "white",
      importance: 2,
    },
  },
  showTitle: false,
};

export default JsonDashboard;
