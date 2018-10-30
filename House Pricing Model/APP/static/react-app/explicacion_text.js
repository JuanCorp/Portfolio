import React from "react";
import Typography from "material-ui/Typography";
import SvgIcon from "material-ui/SvgIcon";
import { withStyles } from "material-ui/styles";
import { Add, Remove } from "material-ui-icons-next";
import Grid from "material-ui/Grid";

const styles = theme => ({
  icon_primary: {
    margin: theme.spacing.unit,
    color: "primary"
  },
  icon_error: {
    margin: theme.spacing.unit,
    color: "error"
  }
});

class Explicacion_Text extends React.Component {
  render() {
    const { classes, colors } = this.props;
    return (
      <div style={{ textAlign: "center" }}>
        {this.props.sign ? (
          <div>
            <SvgIcon
              style={{
                display: "inline-block",
                color: colors[0]
              }}
            >
              <Add />
            </SvgIcon>
            <Typography
              type="title"
              style={{
                display: "inline-block",
                color: colors[0]
              }}
            >
              {this.props.col}
            </Typography>
          </div>
        ) : (
          <div>
            <SvgIcon
              style={{
                display: "inline-block",
                color: colors[0]
              }}
            >
              <Remove />
            </SvgIcon>
            <Typography
              type="title"
              style={{
                display: "inline-block",
                color: colors[1]
              }}
            >
              {this.props.col}
            </Typography>
          </div>
        )}
      </div>
    );
  }
}
export default withStyles(styles)(Explicacion_Text);
