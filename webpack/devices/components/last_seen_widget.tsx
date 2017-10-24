import * as React from "react";
import { Row, Col } from "../../ui/index";
import { t } from "i18next";
import * as moment from "moment";
import { TaggedDevice } from "../../resources/tagged_resources";

interface LastSeenProps {
  onClick?(): void;
  device: TaggedDevice;
}

export class LastSeen extends React.Component<LastSeenProps, {}> {
  get lastSeen() { return this.props.device.body.last_saw_api; }
  show = (): string => {
    if (this.props.device.specialStatus) {
      return t("Loading...");
    }

    if (this.lastSeen) {
      const text = " FarmBot was last seen {{ lastSeen }}";
      const data = {
        lastSeen: moment(this.lastSeen).local().format("MMMM D, h:mma")
      };
      return t(text, data);
    } else {
      return t(" The device has never been seen. Most likely, " +
        "there is a network connectivity issue on the device's end.");
    }
  }

  render() {
    return <Row>
      <Col xs={2}>
        <label>
          {t("LAST SEEN")}
        </label>
      </Col>
      <Col xs={7}>
        <p>
          <i className="fa fa-refresh" onClick={this.props.onClick}></i>
          {this.show()}
        </p>
      </Col>
    </Row>;
  }
}
