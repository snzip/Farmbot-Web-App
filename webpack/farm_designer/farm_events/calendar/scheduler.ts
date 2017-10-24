import * as moment from "moment";
import { Moment, unitOfTime } from "moment";
import { times, last } from "lodash";
import { TimeUnit } from "../../interfaces";
import { NEVER } from "../edit_fe_form";

interface SchedulerProps {
  originTime: Moment;
  intervalSeconds: number;
  lowerBound: Moment;
  upperBound?: Moment;
}

const nextYear = () => moment(moment().add(1, "year"));

export function scheduler({ originTime,
  intervalSeconds,
  lowerBound,
  upperBound }: SchedulerProps): Moment[] {
  if (!intervalSeconds) { // 0, NaN and friends
    return [originTime];
  }
  upperBound = upperBound || nextYear();
  // # How many items must we skip to get to the first occurence?
  const skip_intervals =
    Math.ceil((lowerBound.unix() - originTime.unix()) / intervalSeconds);
  // # At what time does the first event occur?
  const first_item = originTime
    .clone()
    .add((skip_intervals * intervalSeconds), "seconds");
  const list = [first_item];

  times(60, () => {
    const x = last(list);
    if (x) {
      const item = x.clone().add(intervalSeconds, "seconds");
      if (item.isBefore(upperBound)) {
        list.push(item);
      }
    }
  });
  return list;
}

/** Translate farmbot interval names to momentjs interval names */
const LOOKUP: Record<TimeUnit, unitOfTime.Base> = {
  "never": "ms",
  "minutely": "minutes",
  "hourly": "hours",
  "daily": "days",
  "weekly": "weeks",
  "monthly": "months",
  "yearly": "years",
};

/** GIVEN: A time unit (hourly, weekly, etc) and a repeat (number)
 *  RETURNS: Number of seconds for interval.
 *  EXAMPLE: f(2, "minutely") => 120;
 */
export function farmEventIntervalSeconds(repeat: number, unit: TimeUnit) {
  const momentUnit = LOOKUP[unit];
  if ((unit === NEVER) || !(momentUnit)) {
    return 0;
  } else {
    return moment.duration(repeat, momentUnit).asSeconds();
  }
}

/** Intentionally mimics structure of FarmEvent,
 * but only the time/vector parts. */
export interface TimeLine {
  repeat?: number | undefined;
  time_unit: TimeUnit;
  /** ISO string */
  start_time: string;
  /** ISO string */
  end_time?: string | undefined;
}
/** Takes a subset of FarmEvent<Sequence> data and generates a list of dates. */
export function scheduleForFarmEvent({ start_time, end_time, repeat, time_unit }:
  TimeLine): Moment[] {
  const i = repeat && farmEventIntervalSeconds(repeat, time_unit);
  if (i && (time_unit !== NEVER)) {
    const hmm = scheduler({
      originTime: moment(start_time),
      lowerBound: moment(start_time),
      upperBound: end_time ? moment(end_time) : nextYear(),
      intervalSeconds: i
    });
    return hmm;
  } else {
    return [moment(start_time)];
  }
}
