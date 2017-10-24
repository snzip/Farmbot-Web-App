import { BotState, HardwareState, Xyz, ControlPanelState } from "./interfaces";
import { generateReducer } from "../redux/generate_reducer";
import { SyncStatus } from "farmbot/dist";
import { Actions } from "../constants";
import { EncoderDisplay } from "../controls/interfaces";
import { EXPECTED_MAJOR, EXPECTED_MINOR } from "./actions";
import { Session } from "../session";
import { BooleanSetting } from "../session_keys";

/**
 * TODO: Refactor this method to use semverCompare() now that it is a thing.
 * - RC 16 Jun 2017.
 */
export function versionOK(stringyVersion = "0.0.0",
  _EXPECTED_MAJOR = EXPECTED_MAJOR,
  _EXPECTED_MINOR = EXPECTED_MINOR) {
  const [actual_major, actual_minor] = stringyVersion
    .split(".")
    .map(x => parseInt(x, 10));
  if (actual_major > _EXPECTED_MAJOR) {
    return true;
  } else {
    const majorOK = (actual_major == _EXPECTED_MAJOR);
    const minorOK = (actual_minor >= _EXPECTED_MINOR);
    return (majorOK && minorOK);
  }
}
export let initialState: BotState = {
  stepSize: 100,
  controlPanelState: {
    homing_and_calibration: false,
    motors: false,
    encoders_and_endstops: false,
    danger_zone: false
  },
  hardware: {
    mcu_params: {},
    jobs: {},
    location_data: {
      "position": {
        x: undefined,
        y: undefined,
        z: undefined
      },
      "scaled_encoders": {
        x: undefined,
        y: undefined,
        z: undefined
      },
      "raw_encoders": {
        x: undefined,
        y: undefined,
        z: undefined
      },
    },
    pins: {},
    configuration: {},
    informational_settings: {
      busy: false,
      locked: false
    },
    user_env: {},
    process_info: {
      farmwares: {},
    }
  },
  dirty: false,
  currentOSVersion: undefined,
  currentFWVersion: undefined,
  axis_inversion: {
    x: !!Session.getBool(BooleanSetting.xAxisInverted),
    y: !!Session.getBool(BooleanSetting.yAxisInverted),
    z: !!Session.getBool(BooleanSetting.zAxisInverted),
  },
  encoder_visibility: {
    raw_encoders: !!Session.getBool(BooleanSetting.rawEncoders),
    scaled_encoders: !!Session.getBool(BooleanSetting.scaledEncoders),
  }
};

/** Translate X/Y/Z to the name that is used in `localStorage` */
export const INVERSION_MAPPING: Record<Xyz, BooleanSetting> = {
  x: BooleanSetting.xAxisInverted,
  y: BooleanSetting.yAxisInverted,
  z: BooleanSetting.zAxisInverted,
};

/** Translate `encode_visibility` key name to the name that is
 * used in `localStorage` */
export const ENCODER_MAPPING: Record<EncoderDisplay, BooleanSetting> = {
  raw_encoders: BooleanSetting.rawEncoders,
  scaled_encoders: BooleanSetting.scaledEncoders,
};

export let botReducer = generateReducer<BotState>(initialState)
  .add<void>(Actions.SETTING_UPDATE_START, (s, a) => {
    s.isUpdating = true;
    return s;
  })
  .add<void>(Actions.SETTING_UPDATE_END, (s, a) => {
    s.isUpdating = false;
    return s;
  })
  .add<number>(Actions.CHANGE_STEP_SIZE, (s, a) => {
    return Object.assign({}, s, {
      stepSize: a.payload
    });
  })
  .add<keyof ControlPanelState>(Actions.TOGGLE_CONTROL_PANEL_OPTION, (s, a) => {
    s.controlPanelState[a.payload] = !s.controlPanelState[a.payload];
    return s;
  })
  .add<boolean>(Actions.BULK_TOGGLE_CONTROL_PANEL, (s, a) => {
    s.controlPanelState.homing_and_calibration = a.payload;
    s.controlPanelState.motors = a.payload;
    s.controlPanelState.encoders_and_endstops = a.payload;
    s.controlPanelState.danger_zone = a.payload;
    return s;
  })
  .add<string>(Actions.FETCH_OS_UPDATE_INFO_OK, (s, { payload }) => {
    s.currentOSVersion = payload;
    return s;
  })
  .add<HardwareState>(Actions.BOT_CHANGE, (s, { payload }) => {
    const nextState = payload;
    s.hardware = nextState;
    versionOK(nextState.informational_settings.controller_version);
    return s;
  })
  .add<string>(Actions.FETCH_FW_UPDATE_INFO_OK, (s, { payload }) => {
    s.currentFWVersion = payload;
    return s;
  })
  .add<SyncStatus>(Actions.SET_SYNC_STATUS, (s, { payload }) => {
    s.hardware.informational_settings.sync_status = payload;
    return s;
  })
  .add<Xyz>(Actions.INVERT_JOG_BUTTON, (s, { payload }) => {
    s.axis_inversion[payload] = !s.axis_inversion[payload];
    return s;
  })
  .add<EncoderDisplay>(Actions.DISPLAY_ENCODER_DATA, (s, { payload }) => {
    s.encoder_visibility[payload] = !s.encoder_visibility[payload];
    return s;
  });
