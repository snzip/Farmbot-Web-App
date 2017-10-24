import * as React from "react";
import { t } from "i18next";
import * as _ from "lodash";
import { DATA_URI, DEFAULT_ICON, svgToUrl } from "../../open_farm/index";
import { CropInfoProps, DraggableEvent } from "../interfaces";
import { history } from "../../history";
import { connect } from "react-redux";
import { findBySlug } from "../search_selectors";
import { Everything } from "../../interfaces";
import { OpenFarm } from "../openfarm";
import { OFSearch } from "../util";

export function mapStateToProps(props: Everything): CropInfoProps {
  return {
    OFSearch,
    dispatch: Function,
    cropSearchResults: props
      .resources
      .consumers
      .farm_designer
      .cropSearchResults || []
  };
}

@connect(mapStateToProps)
export class CropInfo extends React.Component<CropInfoProps, {}> {

  componentDidMount() {
    const crop = history.getCurrentLocation().pathname.split("/")[5];
    OFSearch(crop)(this.props.dispatch);
  }

  handleDragStart = (e: DraggableEvent) => {
    const icon = e.currentTarget.getAttribute("data-icon-url");
    const img = document.createElement("img");
    icon ? img.src = DATA_URI + icon : DEFAULT_ICON;

    // TODO: Setting these doesn't work by default, needs a fix
    // https://www.w3.org/TR/2011/WD-html5-20110405/dnd.html#dom-datatransfer-setdragimage
    img.height = 50;
    img.width = 50;

    e.dataTransfer.setDragImage && e.dataTransfer.setDragImage(img, 50, 50);
  }

  render() {
    const crop = history.getCurrentLocation().pathname.split("/")[5];
    const result =
      findBySlug(this.props.cropSearchResults, crop || "PLANT_NOT_FOUND");

    const basePath = "/app/designer/plants/crop_search/";

    const backgroundURL = `linear-gradient(
      rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${result.image})`;

    return <div className="panel-container green-panel crop-info-panel">
      <div className="panel-header green-panel"
        style={{ background: backgroundURL }}>
        <p className="panel-title">
          <i className="fa fa-arrow-left plant-panel-back-arrow"
            onClick={() => history.push(basePath)} />
          {result.crop.name}
          <a
            className="right-button"
            onClick={() => history.push(basePath + crop + "/add")}>
            {t("Add to map")}
          </a>
        </p>
        <div className="panel-header-description">
          {result.crop.description}
        </div>
      </div>
      <div className="panel-content">
        <div className="crop-drag-info-tile">
          <img className="crop-drag-info-image"
            onDragStart={this.handleDragStart}
            draggable={true}
            src={result.image}
            data-icon-url={result.crop.svg_icon} />
          <div className="crop-info-overlay">
            {t("Drag and drop into map")}
          </div>
        </div>
        <span>
          {t("Edit on")}&nbsp;
        </span>
        <a
          href={OpenFarm.browsingCropUrl + result.crop.slug}
          target="_blank">
          OpenFarm
        </a>
        <div className="object-list">
          <label>
            {t("Crop Info")}
          </label>
          <ul>
            {
              _(result.crop)
                .omit([
                  "slug",
                  "processing_pictures",
                  "description",
                  "main_image_path",
                  "tags_array",
                  "guides_count"
                ])
                .toPairs()
                .map((pair: string, i: number) => {
                  const key = pair[0];
                  const value = pair[1];
                  switch (key) {
                    case "svg_icon":
                      /**
                      * If there's a value, give it an img element to render the
                      * actual graphic. If no value, return "Not Set".
                      */
                      return <li key={i}>
                        <strong>{t("SVG Icon")}: </strong>
                        {value ?
                          <div>
                            <img
                              src={svgToUrl(value)}
                              width={100}
                              height={100} />
                          </div>
                          :
                          <span>
                            {t("Not Set")}
                          </span>
                        }
                      </li>;
                    /**
                     * Need to convert the `cm` provided by OpenFarm to `mm`
                     * to match the Farm Designer units.
                     */
                    case "spread":
                    case "row_spacing":
                    case "height":
                      return <li key={i}>
                        <strong>
                          {_.startCase(key)}:&nbsp;
                        </strong>
                        <span>
                          {(parseInt(value) * 10) + t("mm") || t("Not Set")}
                        </span>
                      </li>;
                    /**
                     * Default behavior for all other properties.
                     */
                    default:
                      return <li key={i}>
                        <strong>
                          {_.startCase(key)}:&nbsp;
                        </strong>
                        <span>
                          {value || t("Not Set")}
                        </span>
                      </li>;
                  }
                }).value()
            }
          </ul>
        </div>
      </div>
    </div>;
  }
}
