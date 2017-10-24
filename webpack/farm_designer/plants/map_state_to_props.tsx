import * as moment from "moment";
import { Everything } from "../../interfaces";
import { EditPlantInfoProps } from "../interfaces";
import { maybeFindPlantById } from "../../resources/selectors";
import { history } from "../../history";
import { TaggedPlantPointer } from "../../resources/tagged_resources";
import * as _ from "lodash";

export function mapStateToProps(props: Everything): EditPlantInfoProps {
  const findPlant = (id: string | undefined) => {
    const num = parseInt(id || "NOPE", 10);
    if (_.isNumber(num) && !_.isNaN(num)) {
      return maybeFindPlantById(props.resources.index, num);
    }
  };

  return {
    findPlant,
    push: history.push,
    dispatch: props.dispatch,
  };
}

/**
 * All of the info a user would need to know about a plant, formatted and ready
 * to use by the UI.
 */
export interface FormattedPlantInfo {
  x: number;
  y: number;
  id: number | undefined;
  name: string;
  uuid: string;
  daysOld: number;
  plantedAt: string;
  slug: string;
}

export function formatPlantInfo(rsrc: TaggedPlantPointer): FormattedPlantInfo {
  const p = rsrc.body;
  const t = p.created_at ? moment(p.created_at) : moment();
  const currentDay = moment();
  const plantedAt = p.created_at || moment();
  const daysOld = currentDay.diff(moment(plantedAt), "days") + 1;
  return {
    slug: p.openfarm_slug,
    id: p.id,
    name: p.name,
    daysOld,
    x: p.x,
    y: p.y,
    uuid: rsrc.uuid,
    plantedAt: moment(t).format("MMMM Do YYYY, h:mma")
  };
}
