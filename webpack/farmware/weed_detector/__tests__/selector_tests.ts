import { prepopulateEnv, envGet } from "../remote_env/selectors";
import { DEFAULTS } from "../remote_env/constants";
import { WD_ENV } from "../remote_env/interfaces";

describe("populateEnv()", () => {
  it("sets values", () => {
    const env = { CAMERA_CALIBRATION_calibration_object_separation: "12" };
    const result = prepopulateEnv(env);
    expect(result.CAMERA_CALIBRATION_calibration_object_separation).toEqual(12);
  });

  it("Falls back on defaults", () => {
    const result = prepopulateEnv({});
    const actual = result.CAMERA_CALIBRATION_calibration_object_separation;
    const expected = DEFAULTS.CAMERA_CALIBRATION_calibration_object_separation;
    expect(actual).toEqual(expected);
  });
});

describe("envGet()", () => {
  const myEnv: Partial<WD_ENV> = {
    "CAMERA_CALIBRATION_H_LO": 30,
    "CAMERA_CALIBRATION_S_LO": 50,
    "CAMERA_CALIBRATION_V_LO": 50,
    "CAMERA_CALIBRATION_H_HI": 90,
    "CAMERA_CALIBRATION_S_HI": 255,
    "CAMERA_CALIBRATION_V_HI": 255,
    "CAMERA_CALIBRATION_blur": 15,
    "CAMERA_CALIBRATION_morph": 6,
    "CAMERA_CALIBRATION_iteration": 4,
    "CAMERA_CALIBRATION_camera_offset_x": 0,
    "CAMERA_CALIBRATION_camera_offset_y": 0,
    "CAMERA_CALIBRATION_coord_scale": 0,
    "CAMERA_CALIBRATION_calibration_object_separation": 29,
    "CAMERA_CALIBRATION_total_rotation_angle": 0,
    "CAMERA_CALIBRATION_invert_hue_selection": 0,
    "CAMERA_CALIBRATION_calibration_along_axis": 6,
    "CAMERA_CALIBRATION_image_bot_origin_location": 4
  };

  it("grabs current value", () => {
    const result = envGet("CAMERA_CALIBRATION_calibration_object_separation",
      myEnv);
    expect(result).toEqual(29);
  });
});
