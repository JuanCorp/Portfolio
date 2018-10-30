import React from "react";
import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import { FormControl, FormHelperText } from "material-ui/Form";
import Select from "material-ui/Select";
import "./index.css";
import TextField from "material-ui/TextField";
import AdditiveForceVisualizer from "./AdditiveForceVisualizer.js";
import qs from "querystring";
import axios from "axios";
import { StandaloneSearchBox } from "react-google-maps/lib/components/places/StandaloneSearchBox";
import Explicacion_Text from "./explicacion_text";
import { RingLoader } from "react-spinners";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import Button from "material-ui/Button";
import colors from "./color-set";

const plot_colors = Object.keys(colors.colors);

const tipos_vivienda = ["House", "Apartment"];

const municipios = [
  "Santo Domingo Este",
  "Santo Domingo Oeste",
  "Santo Domingo Norte",
  "Distrito Nacional"
];

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  button: {
    margin: theme.spacing.unit
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 450
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 450
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});

export class Predict_Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tipo: "",
      numero_hab: "",
      numero_ban: "",
      area_cons: "",
      area_solar: "",
      predict_data: props.predict_data,
      prediction_loading: false,
      plot_cmap: "CyPU"
    };
  }

  componentWillMount() {
    const refs = {};
    this.setState({
      places: [],
      onSearchBoxMounted: ref => {
        refs.searchBox = ref;
      },
      onPlacesChanged: () => {
        const places = refs.searchBox.getPlaces();
        this.setState({
          places
        });
      }
    });
  }

  createExplicacionText(exp) {
    return (
      <Explicacion_Text
        sign={exp.sign}
        col={exp.col}
        colors={colors.colors[this.state.plot_cmap]}
      />
    );
  }

  isValidchange(event) {
    if (event.target.value === "") return true;
    if (
      (event.target.name === "numero_ban" ||
        event.target.name === "numero_hab") &&
      (event.target.value > 6 || event.target.value < 1)
    )
      return false;

    if (
      event.target.name === "area_cons" &&
      event.target.value > 999 &&
      this.state.tipo === "Apartamento"
    )
      return false;
    if (
      event.target.name === "area_cons" &&
      event.target.value > 9999 &&
      this.state.tipo === "Casa"
    )
      return false;
    return true;
  }

  getPrediction(data) {
    let submit_url = "/api?" + qs.stringify(data);
    axios.get(submit_url).then(res => {
      this.setState({
        predict_data: res.data,
        prediction_loading: false
      });
    });
  }

  handleChange(event) {
    if (event.target.name === "tipo" && event.target.value === "Apartamento")
      this.setState({ area_solar: "" });
    if (this.isValidchange(event))
      this.setState({ [event.target.name]: event.target.value });
  }

  createMenuItems(elem) {
    return (
      <MenuItem key={elem} value={elem}>
        {elem}
      </MenuItem>
    );
  }

  handleEnter(e) {
    if (e.key === "Enter") {
      this.handleSubmit(e);
    }
  }

  handleSubmit(event) {
    let data = this.prepareData();
    this.setState({ prediction_loading: true });
    this.getPrediction(data);
    event.preventDefault();
  }

  prepareData() {
    let result = Object.assign({}, this.state);
    result.area_solar = result.area_solar == "" ? 0 : result.area_solar;
    delete result["onPlacesChanged"];
    delete result["onSearchBoxMounted"];
    delete result.places;
    delete result.precio;
    let place = this.state.places[0];

    result["sector"] = place.name;
    for (let i = 0; i < place.address_components.length; i++) {
      let component = place.address_components[i];
      if (municipios.includes(component.short_name))
        result["municipio"] = component.short_name;
    }

    result["lat"] = place.geometry.location.lat();
    result["lng"] = place.geometry.location.lng();
    result["tipo_request"] = "price";
    return result;
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography type="title">
          Real Estate Pricing Estimator (Santo Domingo Only)
        </Typography>
        <form
          className={classes.container}
          onSubmit={this.handleSubmit.bind(this)}
        >
          <Grid container spacing={12}>
            <Grid item xs={6} sm={6}>
              <Grid item xs={12} sm={12}>
                <FormControl
                  className={classes.formControl}
                  style={{ width: 450 }}
                >
                  <InputLabel htmlFor="tipo-vivienda">Type</InputLabel>
                  <Select
                    value={this.state.tipo}
                    onChange={this.handleChange.bind(this)}
                    input={<Input name="tipo" id="tipo-vivienda" />}
                  >
                    {tipos_vivienda.map(this.createMenuItems)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2} sm={2}>
                <FormControl className={classes.formControl}>
                  <TextField
                    label="Number of Rooms"
                    name="numero_hab"
                    id="num-hab"
                    type="number"
                    value={this.state.numero_hab}
                    inputProps={{ min: 1, max: 6 }}
                    onChange={this.handleChange.bind(this)}
                    onKeyPress={this.handleEnter.bind(this)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={10} sm={10}>
                <FormControl className={classes.formControl}>
                  <TextField
                    label="Number of Bathrooms"
                    name="numero_ban"
                    id="num-ban"
                    type="number"
                    value={this.state.numero_ban}
                    inputProps={{ min: 1, max: 6 }}
                    onChange={this.handleChange.bind(this)}
                    onKeyPress={this.handleEnter.bind(this)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={2} sm={2}>
                <FormControl className={classes.formControl}>
                  <TextField
                    disabled={this.state.tipo === ""}
                    label="Living Area (m2)"
                    name="area_cons"
                    id="area-cons"
                    type="number"
                    value={this.state.area_cons}
                    onChange={this.handleChange.bind(this)}
                    onKeyPress={this.handleEnter.bind(this)}
                    inputProps={{ min: 1, max: 300 }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={10} sm={10}>
                <FormControl className={classes.formControl}>
                  <TextField
                    disabled={this.state.tipo !== "Casa"}
                    label="Full Area (m2)"
                    name="area_solar"
                    id="area-solar"
                    type="number"
                    value={this.state.area_solar}
                    onChange={this.handleChange.bind(this)}
                    inputProps={{ min: 1, max: 300 }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <StandaloneSearchBox
                  ref={this.state.onSearchBoxMounted}
                  bounds={this.props.bounds}
                  onPlacesChanged={this.state.onPlacesChanged}
                >
                  <FormControl className={classes.textField}>
                    <InputLabel htmlFor="sector">City Block</InputLabel>
                    <Input
                      name="sector"
                      id="sector_field"
                      type="text"
                      placeholder="Type the City Block eg: Gascue"
                      style={{ width: 450 }}
                    />
                  </FormControl>
                </StandaloneSearchBox>
              </Grid>
              <Grid item xs={12}>
                <Button
                  className={classes.button}
                  raised
                  color="primary"
                  onClick={this.handleSubmit.bind(this)}
                >
                  Submit
                </Button>
              </Grid>
              <Grid item xs={12}>
                {this.state.prediction_loading ? (
                  <RingLoader
                    loading={this.state.prediction_loading}
                    color="#1565C0"
                    style={{ textAlign: "center" }}
                  />
                ) : (
                  <div>
                    <div>
                      {!!this.state.predict_data ? (
                        <Typography type="title">
                          {"The selling price is between " +
                            this.state.predict_data.precio_low +
                            " and " +
                            this.state.predict_data.precio_high +
                            " RD$"}
                        </Typography>
                      ) : (
                        <div />
                      )}
                    </div>
                    <div>
                      {!!this.state.predict_data ? (
                        <Typography type="title">
                          {"The rent price is between " +
                            this.state.predict_data.alquiler_low +
                            " and " +
                            this.state.predict_data.alquiler_high +
                            " RD$"}
                        </Typography>
                      ) : (
                        <div />
                      )}
                    </div>
                  </div>
                )}
              </Grid>
            </Grid>
            <Grid item xs={6} sm={6}>
              {this.state.prediction_loading ? (
                <RingLoader
                  loading={this.state.prediction_loading}
                  color="#1565C0"
                  style={{ textAlign: "center" }}
                />
              ) : (
                <div>
                  {!!this.state.predict_data ? (
                    <div>
                      <Select
                        value={this.state.plot_cmap}
                        onChange={this.handleChange.bind(this)}
                        input={<Input name="plot_cmap" id="plot_cmap" />}
                      >
                        {plot_colors.map(this.createMenuItems)}
                      </Select>
                      <AdditiveForceVisualizer
                        {...this.state.predict_data.explicacion_data}
                        plot_cmap={this.state.plot_cmap}
                        style={{ color: "white" }}
                      />
                      {this.state.predict_data.explicacion_text.map(
                        this.createExplicacionText.bind(this)
                      )}
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              )}
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(withScriptjs(Predict_Form));
