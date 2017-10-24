import * as React from "react";
import * as _ from "lodash";
import { t } from "i18next";
import { Link } from "react-router";
import { FormattedPlantInfo } from "./map_state_to_props";
import { round } from "../map/util";
import { history } from "../../history";

interface PlantPanelProps {
  info: FormattedPlantInfo;
  onDestroy?(uuid: string): void;
}

export function PlantPanel({ info, onDestroy }: PlantPanelProps) {
  const { name, slug, plantedAt, daysOld, uuid } = info;
  let { x, y } = info;
  if (onDestroy) { x = round(x); y = round(y); }
  const destroy = () => onDestroy && onDestroy(uuid);
  return <div className="panel-content">
    <label>
      {t("Plant Info")}
    </label>
    <ul>
      <li>
        <b>
          {t("Full Name")}:&nbsp;
        </b>
        <span>
          {_.startCase(name)}
        </span>
      </li>
      <li>
        <b>
          {t("Plant Type")}:&nbsp;
        </b>
        <span>
          <Link
            to={`/app/designer/plants/crop_search/` + slug}>
            {_.startCase(slug)}
          </Link>
        </span>
      </li>
      <li>
        <b>
          {t("Started")}:&nbsp;
        </b>
        <span>
          {plantedAt}
        </span>
      </li>
      <li>
        <b>
          {t("Age")}:&nbsp;
        </b>
        <span>
          {daysOld} {t("days old")}
        </span>
      </li>
      <li>
        <b>
          {t("Location")}:&nbsp;
        </b>
        <span>
          ({x}, {y})
        </span>
      </li>
    </ul>
    <div>
      <label hidden={!onDestroy}>
        {t("Delete this plant")}
      </label>
    </div>
    <button
      className="fb-button red"
      hidden={!onDestroy}
      onClick={destroy} >
      {t("Delete")}
    </button>
    <button
      className="fb-button gray"
      style={{ marginRight: "10px" }}
      hidden={!onDestroy}
      onClick={() => history.push("/app/designer/plants/select")} >
      {t("Delete multiple")}
    </button>
  </div>;
}
