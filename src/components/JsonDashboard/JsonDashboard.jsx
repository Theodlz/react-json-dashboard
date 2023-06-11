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

function displayValue(value) {
  let val = value;
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
                      <h5
                        style={{
                          margin: 0,
                          padding: 0,
                          backgroundColor: statusTypes[data[category][key][1]]
                            ?.backgroundColor
                            ? statusTypes[data[category][key][1]]
                                .backgroundColor
                            : null,
                          color: statusTypes[data[category][key][1]]?.color
                            ? statusTypes[data[category][key][1]].color
                            : "black",
                          paddingLeft: "0.75rem",
                        }}
                      >
                        {displayValue(data[category][key][0])}
                      </h5>
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
