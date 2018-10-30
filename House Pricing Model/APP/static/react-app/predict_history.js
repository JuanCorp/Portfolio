import React from "react";
import Typography from "material-ui/Typography";
import { VictoryChart, VictoryTheme, VictoryLine, VictoryAxis } from "victory";

class Prediction_History extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      prediction_history: props.prediction_history
    };
  }

  render() {
    return (
      <div>
        <Typography type="title">Predictions over Time</Typography>
        <VictoryChart
          theme={VictoryTheme.material}
          style={{
            parent: { maxWidth: "100%", maxHeight: "85%" }
          }}
        >
          <VictoryAxis
            label="Difference"
            style={{
              axis: { stroke: "#E0F2F1" },
              axisLabel: { fontSize: 16, fill: "#E0F2F1", padding: 40 },
              ticks: { stroke: "#ccc" },
              tickLabels: { fontSize: 14, fill: "#E0F2F1", fontWeight: "bold" },
              grid: { stroke: "#B3E5FC", strokeWidth: 0.25 }
            }}
            dependentAxis
          />
          <VictoryAxis
            label="Date"
            style={{
              axis: { stroke: "#E0F2F1" },
              axisLabel: { fontSize: 12, padding: 40 },
              ticks: { stroke: "#ccc" },
              tickLabels: {
                fontSize: 10,
                fill: "#E0F2F1",
                fontWeight: "bold",
                angle: -45,
                textAnchor: "end"
              }
            }}
          />
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" }
            }}
            data={this.state.prediction_history}
            x="Fecha"
            y="Diferencia"
          />
        </VictoryChart>
      </div>
    );
  }
}

export default Prediction_History;
