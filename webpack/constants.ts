/**
 * Seems like a better idea to keep content and tooltips centralized. If we have
 * the ability to keep the app safer from possible accidental breakages by
 * avoiding going into components for copy changes, why not right? ¯\_(ツ)_/¯
 */

export namespace ToolTips {

  // Controls
  export const MOVE =
    `Use these manual control buttons to move FarmBot in realtime. Press the
    arrows for relative movements or type in new coordinates and press GO for an
    absolute movement. Tip: Press the Home button when you are done so FarmBot
    is ready to get back to work.`;

  export const WEBCAM =
    `If you have a webcam, you can view the video stream in this widget.
    Press the edit button to update and save your webcam URL.`;

  export const PERIPHERALS =
    `Use these toggle switches to control FarmBot's peripherals in realtime. To
    edit and create new peripherals, press the EDIT button. Make sure to turn
    things off when you're done!`;

  // Device
  export const OS_SETTINGS =
    `View and change device settings.`;

  export const HW_SETTINGS =
    `Change settings of your FarmBot hardware with the fields below. Caution:
    Changing these settings to extreme values can cause hardware malfunction.
    Make sure to test any new settings before letting your FarmBot use them
    unsupervised. Tip: Recalibrate FarmBot after changing settings and test a
    few sequences to verify that everything works as expected. Note: Currently
    not all settings can be changed.`;

  // Hardware Settings: Homing and Calibration
  export const HOMING =
    `(Alpha) If encoders or end-stops are enabled, home axis (find zero).`;

  export const CALIBRATION =
    `(Alpha) If encoders or end-stops are enabled, home axis and determine
    maximum.`;

  export const SET_ZERO_POSITION =
    `Set the current location as zero.`;

  export const FIND_HOME_ON_BOOT =
    `If encoders or end-stops are enabled, find the home position when the
    device powers on. Warning! This will perform homing on all axes when the
    device powers on. Encoders or endstops must be enabled. It is recommended
    to make sure homing works properly before enabling this feature.`;

  export const STOP_AT_HOME =
    `Stop at the home location of the axis.`;

  export const STOP_AT_MAX =
    `Don't allow movement past the maximum value provided in AXIS LENGTH.`;

  export const NEGATIVE_COORDINATES_ONLY =
    `Restrict travel to negative coordinate locations. Overridden by disabling
    STOP AT HOME.`;

  export const LENGTH =
    `Set the length of each axis to provide software limits. Used only if
    STOP AT MAX is enabled.`;

  export const TIMEOUT_AFTER =
    `Amount of time to wait for a command to execute before stopping.`;

  // Hardware Settings: Motors
  export const MAX_MOVEMENT_RETRIES =
    `Number of times to retry a movement before stopping.`;

  export const E_STOP_ON_MOV_ERR =
    `Emergency stop if movement is not complete after the maximum number of
    retries.`;

  export const MAX_SPEED =
    `Maximum travel speed after acceleration in motor steps per second.`;

  export const HOME_SPEED =
    `Homing and calibration travel speed in motor steps per second.`;

  export const MIN_SPEED =
    `Minimum movement speed in motor steps per second. Also used for homing
     and calibration.`;

  export const ACCELERATE_FOR =
    `Number of steps used for acceleration and deceleration.`;

  export const STEPS_PER_MM =
    `The number of motor steps required to move the axis one millimeter.`;

  export const ALWAYS_POWER_MOTORS =
    `Keep power applied to motors. Prevents slipping from gravity in certain
    situations.`;

  export const INVERT_MOTORS =
    `Invert direction of motor during calibration.`;

  export const ENABLE_X2_MOTOR =
    `Enable use of a second x-axis motor. Connects to E0 on RAMPS.`;

  // Hardware Settings: Encoders and Endstops
  export const ENABLE_ENCODERS =
    `(Alpha) Enable use of rotary encoders during calibration and homing.`;

  export const ENCODER_POSITIONING =
    `[EXPERIMENTAL] Use encoders for positioning.`;

  export const INVERT_ENCODERS =
    `(Alpha) Reverse the direction of encoder position reading.`;

  export const MAX_MISSED_STEPS =
    `(Alpha) Number of steps missed (determined by encoder) before motor is
    considered to have stalled.`;

  export const ENCODER_MISSED_STEP_DECAY =
    `(Alpha) Reduction to missed step total for every good step.`;

  export const ENCODER_SCALING =
    `(Alpha) encoder scaling factor = 100 * (motor resolution * microsteps) /
    (encoder resolution).`;

  export const ENABLE_ENDSTOPS =
    `Enable use of electronic end-stops during calibration and homing.`;

  export const INVERT_ENDPOINTS =
    `Swap axis end-stops during calibration.`;

  // Farmware
  export const FARMWARE =
    `Manage Farmware (plugins).`;

  export const PHOTOS =
    `Take and view photos with your FarmBot's camera.`;

  export const WEED_DETECTOR =
    `Detect weeds using FarmBot's camera and display them on the Farm Designer
    map.`;

  export const CAMERA_CALIBRATION =
    `Calibrate FarmBot's camera for use in the weed detection software.`;

  // Sequences
  export const SEQUENCE_COMMANDS =
    `These are the most basic commands FarmBot can execute. Drag and drop them
    to create sequences for watering, planting seeds, measuring soil properties,
    and more.`;

  export const SEQUENCE_EDITOR =
    `Drag and drop commands here to create sequences for watering, planting
    seeds, measuring soil properties, and more. Press the Test button to
    immediately try your sequence with FarmBot. You can also edit, copy, and
    delete existing sequences; assign a color; and give your commands custom
    names.`;

  export const SEQUENCE_LIST =
    `Here is the list of all of your sequences. Click one to edit.`;

  export const MOVE_ABSOLUTE =
    `The Move Absolute step instructs FarmBot to move to the specified
    coordinate regardless of the current position. For example, if FarmBot is
    currently at X=1000, Y=1000 and it receives a Move Absolute where X=0 and
    Y=3000, then FarmBot will move to X=0, Y=3000. If FarmBot must move in
    multiple directions, it will move diagonally. If you require straight
    movements along one axis at a time, use multiple Move Absolute steps.
    Offsets allow you to more easily instruct FarmBot to move to a location,
    but offset from it by the specified amount. For example moving to just
    above where a peripheral is located. Using offsets lets FarmBot do the
    math for you.`;

  export const MOVE_RELATIVE =
    `The Move Relative step instructs FarmBot to move the specified distance
    from its current location. For example, if FarmBot is currently at X=1000,
    Y=1000 and it receives a Move Relative where X=0 and Y=3000, then FarmBot
    will move to X=1000, Y=4000. If FarmBot must move in multiple directions,
    it will move diagonally. If you require straight movements along one axis
    at a time, use  multiple Move Relative steps. Move Relative steps should be
    preceded by a Move Absolute step to ensure you are starting from a known
    location.`;

  export const WRITE_PIN =
    `The Write Pin step instructs FarmBot to set the specified pin on the
    Arduino to the specified mode and value. Use the digital pin mode for
    on (1) and off (0) control, and analog pin mode for PWM (pulse width
    modulation) (0-255).`;

  export const READ_PIN =
    `The Read Pin step instructs FarmBot to read the current value of the
    specified pin. Pin Mode: Use digital for a 0 (LOW) or 1 (HIGH) response,
    and analog for a voltage reading (0-1023 for 0-5V).`;

  export const WAIT =
    `The Wait step instructs FarmBot to wait for the specified amount of time.
    Use it in combination with the Pin Write step to water for a length of
    time.`;

  export const SEND_MESSAGE =
    `The Send Message step instructs FarmBot to send a custom message to the
    logs (and toast message and/or email, if selected). This can help you with
    debugging your sequences.`;

  export const FIND_HOME =
    `The Find Home step instructs the device to perform a homing command to
    find and set zero for the chosen axis or axes.`;

  export const IF =
    `Execute a sequence if a condition is satisfied. If the condition is not
    satisfied, chose to do nothing or execute a different sequence.`;

  export const EXECUTE_SCRIPT =
    `The Run Farmware step runs a Farmware package. The weed detection script
    is the only script supported at the moment, but user definable script
    support is coming soon!`;

  export const TAKE_PHOTO =
    `Snaps a photo using the device camera. Select the camera type on the
    Device page.`;

  // Regimens
  export const BULK_SCHEDULER =
    `Add sequences to your regimen by selecting a sequence from the drop down,
    specifying a time, choosing which days it should run on, and then clicking
    the + button. For example: a Seeding sequence might be scheduled for Day 1,
    while a Watering sequence would be scheduled to run every other day.`;

  export const REGIMEN_EDITOR =
    `Regimens allow FarmBot to take care of a plant throughout its entire life.
    A regimen consists of many sequences that are scheduled to run based on the
    age of the plant. Regimens are applied to plants from the farm designer
    (coming soon) and can be re-used on many plants growing at the same or
    different times. Multiple regimens can be applied to any one plant.`;

  export const REGIMEN_LIST =
    `This is a list of all of your regimens. Click one to begin editing it.`;

  // Tools
  export const TOOL_LIST =
    `This is a list of all your FarmBot Tools. Click the Edit button to add,
    edit, or delete tools.`;

  export const TOOLBAY_LIST =
    `Toolbays are where you store your FarmBot Tools. Each Toolbay has Slots
    that you can put your Tools in, which should be reflective of your real
    FarmBot hardware configuration.`;

}

export namespace Content {

  // Account
  export const ACCOUNT_DELETE_WARNING =
    `WARNING! Deleting your account will permanently delete all of your
    Sequences , Regimens, Events, and Farm Designer data.Upon deleting your
    account, FarmBot will cease to function and become inaccessible until it is
    paired with another web app account. To do this, you will need to reboot
    your FarmBot so that is goes back into configuration mode for pairing with
    another user account. When this happens, all of the data on your FarmBot
    will be overwritten with the new account's data. If the account is brand
    new, then FarmBot will become a blank slate.`.replace(/\s+/g, " ");

  export const TYPE_PASSWORD_TO_DELETE =
    `If you are sure you want to delete your account, type in
    your password below to continue.`.replace(/\s+/g, " ");

  // Device
  export const FACTORY_RESET_WARNING =
    `Factory resetting your FarmBot will destroy all data on the device,
    revoking your FarmBot's abilily to connect to your web app account and your
    home wifi. Upon factory resetting, your device will restart into
    Configurator mode. Factory resetting your FarmBot will not affect any data
    or settings from your web app account, allowing you to do a complete restore
    to your device once it is back online and paired with your web app
    account.`.replace(/\s+/g, " ");

  export const FACTORY_RESET_ALERT =
    `Warning: This will erase all data stored on your FarmBot's SD card,
    requiring you to reconfigure FarmBot so that it can reconnect to your
    WiFi network and a web app account. Factory resetting the device will
    not delete data stored in your web app account. Are you sure you wish
    to continue?`.replace(/\s+/g, " ");

  export const TIMEZONE_GUESS_BROWSER =
    `This account did not have a timezone set. Farmbot requires a timezone to
    operate. We have updated your timezone settings based on your browser.
    Please verify these settings in the device settings panel. Device sync is
    recommended.`.replace(/\s+/g, " ");

  export const TIMEZONE_GUESS_UTC =
    `Warning: Farmbot could not guess your timezone. We have defaulted your
    timezone to UTC, which is less than ideal for most users. Please select
    your timezone from the dropdown. Device sync is recommended.`.replace(/\s+/g, " ");

  export const DIFFERENT_TZ_WARNING =
    `Note: The selected timezone for your FarmBot is different than
    your local browser time.`.replace(/\s+/g, " ");

  export const RESTART_FARMBOT =
    `This will restart FarmBot's Raspberry Pi and controller
    software.`.replace(/\s+/g, " ");

  export const SHUTDOWN_FARMBOT =
    `This will shutdown FarmBot's Raspberry Pi. To turn it
    back on, unplug FarmBot and plug it back in.`.replace(/\s+/g, " ");

  // Hardware Settings
  export const RESTORE_DEFAULT_HARDWARE_SETTINGS =
    `Restoring hardware parameter defaults will destroy the
    current settings, resetting them to default values.`.replace(/\s+/g, " ");

  // App
  export const APP_LOAD_TIMEOUT_MESSAGE =
    `App could not be fully loaded, we recommend you try
    refreshing the page.`.replace(/\s+/g, " ");

  export const MQTT_DISCONNECTED =
    `Your web browser is unable to connect to the message broker.
    You might be behind a firewall or disconnected from the Internet. Check
    your network settings.
    View Device > Connectivity for more details.`.replace(/\s+/g, " ");

  export const MALFORMED_MESSAGE_REC_UPGRADE =
    `FarmBot sent a malformed message. You may need to upgrade
    FarmBot OS. Please upgrade FarmBot OS and log back in.`.replace(/\s+/g, " ");

  export const EXPERIMENTAL_WARNING =
    `Warning! This is an EXPERIMENTAL feature. This feature may be broken and may
    break or otherwise hinder your usage of the rest of the app. This feature may
    disappear or break at any time.`.replace(/\s+/g, " ");

  // Front Page
  export const TOS_UPDATE =
    `The terms of service have recently changed. You must accept the new
    terms of service to continue using the site.`.replace(/\s+/g, " ");

  // Sequences
  export const NO_SEQUENCE_SELECTED =
    `No Sequence selected. Click one in the Sequences panel to edit, or
    click "+" to create a new one.`.replace(/\s+/g, " ");

  // Regimens
  export const NO_REGIMEN_SELECTED =
    `No Regimen selected. Click one in the Regimens panel to edit, or
    click "+" in the Regimens panel to create a new one.`.replace(/\s+/g, " ");

  // Farm Events
  export const REGIMEN_TODAY_SKIPPED_ITEM_RISK =
    `You are scheduling a regimen to run today. Be aware that
    running a regimen too late in the day may result in skipped
    regimen tasks. Consider rescheduling this event to tomorrow if
    this is a concern.`.replace(/\s+/g, " ");

  export const INVALID_RUN_TIME =
    `This Farm Event does not appear to have a valid run time.
    Perhaps you entered bad dates?`.replace(/\s+/g, " ");

  export const FARM_EVENT_TZ_WARNING =
    `Note: Times displayed according to local browser time, which
    is currently different from your device timezone setting (on the
    Device page).`.replace(/\s+/g, " ");
}

export enum Actions {

  // Resources
  DESTROY_RESOURCE_OK = "DESTROY_RESOURCE_OK",
  INIT_RESOURCE = "INIT_RESOURCE",
  SAVE_SPECIAL_RESOURCE = "SAVE_SPECIAL_RESOURCE",
  SAVE_RESOURCE_OK = "SAVE_RESOURCE_OK",
  UPDATE_RESOURCE_OK = "UPDATE_RESOURCE_OK",
  EDIT_RESOURCE = "EDIT_RESOURCE",
  OVERWRITE_RESOURCE = "OVERWRITE_RESOURCE",
  SAVE_RESOURCE_START = "SAVE_RESOURCE_START",
  RESOURCE_READY = "RESOURCE_READY",
  _RESOURCE_NO = "*_RESOURCE_NO",
  REFRESH_RESOURCE_START = "REFRESH_RESOURCE_START",
  REFRESH_RESOURCE_OK = "REFRESH_RESOURCE_OK",
  REFRESH_RESOURCE_NO = "REFRESH_RESOURCE_NO",

  // Auth
  REPLACE_TOKEN = "LOGIN_OK",

  // Config
  CHANGE_API_PORT = "CHANGE_API_PORT",
  CHANGE_API_HOST = "CHANGE_API_HOST",
  LOGOUT = "LOGOUT",

  // Devices
  TOGGLE_CONTROL_PANEL_OPTION = "TOGGLE_CONTROL_PANEL_OPTION",
  BULK_TOGGLE_CONTROL_PANEL = "BULK_TOGGLE_CONTROL_PANEL",
  CHANGE_STEP_SIZE = "CHANGE_STEP_SIZE",
  SETTING_UPDATE_START = "SETTING_UPDATE_START",
  SETTING_UPDATE_END = "SETTING_UPDATE_END",
  BOT_CHANGE = "BOT_CHANGE",
  FETCH_OS_UPDATE_INFO_OK = "FETCH_OS_UPDATE_INFO_OK",
  FETCH_FW_UPDATE_INFO_OK = "FETCH_FW_UPDATE_INFO_OK",
  SET_SYNC_STATUS = "SET_SYNC_STATUS",
  INVERT_JOG_BUTTON = "INVERT_JOG_BUTTON",
  DISPLAY_ENCODER_DATA = "DISPLAY_ENCODER_DATA",

  // Draggable
  PUT_DATA_XFER = "PUT_DATA_XFER",
  DROP_DATA_XFER = "DROP_DATA_XFER",

  // Designer
  SEARCH_QUERY_CHANGE = "SEARCH_QUERY_CHANGE",
  SELECT_PLANT = "SELECT_PLANT",
  TOGGLE_HOVERED_PLANT = "TOGGLE_HOVERED_PLANT",
  OF_SEARCH_RESULTS_OK = "OF_SEARCH_RESULTS_OK",

  // Regimens
  PUSH_WEEK = "PUSH_WEEK",
  POP_WEEK = "POP_WEEK",
  DESELECT_ALL_DAYS = "DESELECT_ALL_DAYS",
  SELECT_ALL_DAYS = "SELECT_ALL_DAYS",
  TOGGLE_DAY = "TOGGLE_DAY",
  SELECT_REGIMEN = "SELECT_REGIMEN",
  SET_SEQUENCE = "SET_SEQUENCE",
  SET_TIME_OFFSET = "SET_TIME_OFFSET",

  // Sequences
  SELECT_SEQUENCE = "SELECT_SEQUENCE",

  // Farmware
  SELECT_IMAGE = "SELECT_IMAGE",

  // Network
  NETWORK_EDGE_CHANGE = "NETWORK_EDGE_CHANGE"
}
