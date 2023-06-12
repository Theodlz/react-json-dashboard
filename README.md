# react-json-dashboard

Generate dashboards from JSON files.

## Add to your project

Inside of your project directory, run:
`yarn add react-json-dashboard` or `npm install --save react-json-dashboard`

## Usage

Using JSONs/Object that follow this structure:
```js
{
    "Category": {
        "Metric": [
            value(s), // (can be just one value, or a list of values)
            status_type, // any string of your choosing, can be customized by passinga `statusTypes`
            // object to the Dashboard component. Supports "info", :"warning", and "error" by default.
        ]
    }
    ...
}
```

you can easily generate a dashboard with the following code:
```js
import React from 'react';
import JsonDashboard from 'react-json-dashboard';

const data = { // example data
    "Sensors:": {
        "Temperature": [
            [65, 67],
            "info"
        ],
        "Humidity": [
            80,
            "warning"
        ],
        "Pressure": [
            -1,
            "danger"
        ],
    },
    "Status": {
        "Motor 1": [
            "OK",
            "info"
        ],
        "Motor 2": [
            "LOW BATTERY",
            "warning"
        ],
    },
    "Connectivity": {
        "Wifi": [
            "OK",
            "info"
        ],
        "Bluetooth": [
            "OK",
            "info"
        ],
    },
};

const App = () => (
    <JsonDashboard title={"Dashboard Test"} data={data} showTitle />
);

export default App;
```

Which will look like this:

![Dashboard Example](https://github.com/Theodlz/react-json-dashboard/blob/main/assets/example.png)

## Props

| Prop | Type | Description | Default |
| ---- | ---- | ----------- | ------- |
| title | string | Title/Header of the dashboard | null |
| data | object | Object containing the data to be displayed | {} |
| statusTypes | object | Object describing the backgroundColor, color, and color priority for each status_types | { info: { backgroundColor: "#52A450", color: "white", priority: 0 }, warning: { backgroundColor: "#FF7900", color: "white", priority: 1 }, error: { backgroundColor: "#CB4449", color: "white", priority: 2 } } |
| showTitle | boolean | Whether or not to show the title | false |
| lastUpdated | string or Date | The last time the data was updated. | null |

The color priority will be used to determine the background color of the Category that contains the metrics. Example: if a Category has a metric with status_type "error", the background color of the Category will be "#CB4449" (the backgroundColor of the "error" status_type), because it's priority is the highest. Each metric will still display its own color based on its status.

