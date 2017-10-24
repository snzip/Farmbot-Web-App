import * as React from "react";
import { t } from "i18next";
import { DangerZoneProps } from "../interfaces";
import { Row, Col } from "../../../ui/index";
import { Header } from "./header";
import { Collapse } from "@blueprintjs/core";
import { Content } from "../../../constants";

export function DangerZone(props: DangerZoneProps) {

  const { dispatch, bot, onReset } = props;
  const { danger_zone } = bot.controlPanelState;

  return <section>
    <Header
      bool={danger_zone}
      title={"Danger Zone"}
      name={"danger_zone"}
      dispatch={dispatch} />
    <Collapse isOpen={!!danger_zone}>
      <Row>
        <Col xs={4}>
          <label>
            {t("Reset hardware parameter defaults")}
          </label>
        </Col>
        <Col xs={6}>
          <p>
            {t(Content.RESTORE_DEFAULT_HARDWARE_SETTINGS)}
            <br />
            <b>
              {t("Will reboot device.")}
            </b>
          </p>
        </Col>
        <Col xs={2}>
          <button
            className="fb-button red"
            onClick={onReset}>
            {t("RESET")}
          </button>
        </Col>
      </Row>
    </Collapse>
  </section>;
}
