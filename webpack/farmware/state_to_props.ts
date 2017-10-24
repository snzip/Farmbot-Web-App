import { Everything } from "../interfaces";
import { selectAllImages } from "../resources/selectors";
import { FarmwareProps } from "../devices/interfaces";
import { prepopulateEnv } from "./weed_detector/remote_env/selectors";
import * as _ from "lodash";

export function mapStateToProps(props: Everything): FarmwareProps {
  const images = _(selectAllImages(props.resources.index))
    .sortBy(x => x.body.id)
    .reverse()
    .value();

  const firstImage = images[0];
  const currentImage = images
    .filter(i => i.uuid === props.resources.consumers.farmware.currentImage)[0]
    || firstImage;
  const { farmwares } = props.bot.hardware.process_info;
  const syncStatus = props
    .bot
    .hardware
    .informational_settings
    .sync_status || "unknown";
  return {
    farmwares,
    syncStatus,
    env: prepopulateEnv(props.bot.hardware.user_env),
    user_env: props.bot.hardware.user_env,
    dispatch: props.dispatch,
    currentImage,
    images
  };
}
