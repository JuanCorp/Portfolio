import React from "react";
import Predict_Form from "./predict_form";
import Prediction_History from "./predict_history";
import AppBar from "material-ui/AppBar";
import Tabs, { Tab } from "material-ui/Tabs";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import { red500 } from "material-ui/colors";
import Grid from "material-ui/Grid";
import qs from "querystring";
import axios from "axios";
import Prediction_Scores from "./prediction_scores";

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing.unit * 3
  },
  appbar: {
    colorSecondary: theme.spacing.primary,
    marginBottom: theme.spacing.unit * 1
  }
});

const background_app = {
  backgroundColor: red500
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      predict_data: undefined,
      prediction_history: undefined,
      prediction_scores: undefined
    };
  }
  handleChange(event, value) {
    this.setState({ currentTab: value });
  }

  componentDidMount() {
    this.getPredHistory();
    this.getPredScores();
  }

  getPredHistory() {
    const filters = {
      tipo_request: "historial_predicciones"
    };
    let submit_url = "/api?" + qs.stringify(filters);
    axios.get(submit_url).then(res => {
      console.log(res);
      this.setState({
        prediction_history: res.data.cambios
      });
    });
  }

  getPredScores() {
    const filters = {
      tipo_request: "historial_scores"
    };
    let submit_url = "/api?" + qs.stringify(filters);
    axios.get(submit_url).then(res => {
      console.log(res);
      this.setState({
        prediction_scores: res.data.scores
      });
    });
  }

  render() {
    const { classes } = this.props;
    const { currentTab } = this.state;
    return (
      <div className={classes.root}>
        <AppBar className={classes.appbar} color="primary" position="static">
          <Tabs value={currentTab} onChange={this.handleChange.bind(this)}>
            <Tab label="Price Estimator" />
            <Tab label="Predictions over Time" />
            <Tab label="Performance Over Time" />
          </Tabs>
        </AppBar>
        {currentTab === 0 && (
          <Predict_Form
            {...this.props.gmapsProps}
            predict_data={this.state.predict_data}
          />
        )}
        {currentTab === 1 && (
          <Prediction_History
            prediction_history={this.state.prediction_history}
          />
        )}
        {currentTab === 2 && (
          <Prediction_Scores prediction_scores={this.state.prediction_scores} />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Main);
