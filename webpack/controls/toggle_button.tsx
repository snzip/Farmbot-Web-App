import * as React from "react";
import { t } from "i18next";
import { ToggleButtonProps } from "./interfaces";
import { isUndefined } from "util";

export class ToggleButton extends React.Component<ToggleButtonProps, {}> {
  caption() {
    const useNoYes = isUndefined(this.props.noYes) ? true : this.props.noYes;
    const noOff = useNoYes ? t("no") : t("off");
    const yesOn = useNoYes ? t("yes") : t("on");
    const captions: { [s: string]: string | undefined } = {
      "0": noOff,
      "false": noOff,
      "off": noOff,
      "1": yesOn,
      "true": yesOn,
      "on": yesOn,
      "undefined": "🚫",
      "-1": "🚫"
    };
    const togval = String(this.props.toggleValue);
    return captions[togval] || "---";
  }

  css() {
    const css = "fb-toggle-button fb-button";
    if (this.props.disabled) { return css + " gray"; }
    const redCSS = css + " red";
    const greenCSS = css + " green";
    const yellowCSS = css + " yellow";

    const cssClasses: { [s: string]: string | undefined } = {
      "0": redCSS,
      "false": redCSS,
      "off": redCSS,
      "1": greenCSS,
      "true": greenCSS,
      "on": greenCSS,
      "undefined": yellowCSS
    };

    return cssClasses[String(this.props.toggleValue)] || yellowCSS;
  }

  render() {
    const cb = () => !this.props.disabled && this.props.toggleAction();
    return (
      <button
        disabled={!!this.props.disabled}
        className={this.css()}
        onClick={cb}>
        {this.caption()}
      </button>
    );
  }
}
