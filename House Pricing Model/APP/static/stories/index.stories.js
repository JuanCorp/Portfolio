import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import ADF from "../react-app/AdditiveForceVisualizer";
import { Button, Welcome } from "@storybook/react/demo";
import adfProps from "./adftestprops";
import colors from "../react-app/color-set";

const color_maps = Object.keys(colors.colors);

const createADFs = function(cmap) {
  return <ADF {...adfProps} key={cmap} plot_cmap={cmap} />;
};

storiesOf("Welcome", module).add("to Storybook", () => (
  <Welcome showApp={linkTo("Button")} />
));

storiesOf("Button", module)
  .add("with text", () => (
    <Button onClick={action("clicked")}>Hello Button</Button>
  ))
  .add("with some emoji", () => (
    <Button onClick={action("clicked")}>😀 😎 👍 💯</Button>
  ));

storiesOf("ADF", module).add("default", () => (
  <div>{color_maps.map(createADFs)}</div>
));
