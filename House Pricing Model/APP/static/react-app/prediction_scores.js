import React from "react";
import Typography from "material-ui/Typography";
import { VictoryChart, VictoryTheme, VictoryLine, VictoryAxis } from "victory";
import Input, { InputLabel } from "material-ui/Input";
import Grid from "material-ui/Grid";
import Select from "material-ui/Select";
import { MenuItem } from "material-ui/Menu";
import { withStyles } from "material-ui/styles";
import { FormControl, FormHelperText } from "material-ui/Form";
const metricas = ["mse", "Score"];
const metricas_labels = {
  mse: "MSE",
  Score: "R2"
};

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 100
  }
});

class Prediction_Scores extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      prediction_scores: props.prediction_scores,
      metrica: "mse"
    };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  createMenuItems(elem) {
    return (
      <MenuItem key={elem} value={elem}>
        {elem}
      </MenuItem>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography type="title">Performance Over Time</Typography>
        <Grid container spacing={24}>
          <Grid item xs={10} sm={5}>
            <Typography type="subheading" align="center">
              Apartments
            </Typography>
            <VictoryChart
              theme={VictoryTheme.material}
              style={{
                parent: { maxWidth: "100%", maxHeight: "75%" }
              }}
            >
              <VictoryAxis
                label={metricas_labels[this.state.metrica]}
                style={{
                  axis: { stroke: "#E0F2F1" },
                  axisLabel: { fontSize: 16, fill: "#E0F2F1", padding: 40 },
                  ticks: { stroke: "#ccc" },
                  tickLabels: {
                    fontSize: 14,
                    fill: "#E0F2F1",
                    fontWeight: "bold"
                  },
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
                data={this.state.prediction_scores.apartamentos}
                x="Fecha"
                y={this.state.metrica}
              />
            </VictoryChart>
          </Grid>
          <Grid item xs={6} sm={2}>
            <FormControl className={classes.formControl} style={{ width: 150 }}>
              <InputLabel htmlFor="metrica">Metrica</InputLabel>
              <Select
                value={this.state.metrica}
                onChange={this.handleChange.bind(this)}
                input={<Input name="metrica" id="metrica" />}
              >
                {metricas.map(this.createMenuItems)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={10} sm={5}>
            <Typography type="subheading" align="center">
              Houses
            </Typography>
            <VictoryChart
              theme={VictoryTheme.material}
              style={{
                parent: { maxWidth: "100%", maxHeight: "75%" }
              }}
            >
              <VictoryAxis
                label={metricas_labels[this.state.metrica]}
                style={{
                  axis: { stroke: "#E0F2F1" },
                  axisLabel: { fontSize: 16, fill: "#E0F2F1", padding: 40 },
                  ticks: { stroke: "#ccc" },
                  tickLabels: {
                    fontSize: 14,
                    fill: "#E0F2F1",
                    fontWeight: "bold"
                  },
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
                data={this.state.prediction_scores.casas}
                x="Fecha"
                y={this.state.metrica}
              />
            </VictoryChart>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Prediction_Scores);
