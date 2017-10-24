import {
  TaggedResource,
  ResourceName,
  isTaggedResource,
  TaggedSequence,
  SpecialStatus,
} from "../resources/tagged_resources";
import { GetState, ReduxAction } from "../redux/interfaces";
import { API } from "./index";
import axios from "axios";
import { updateOK, updateNO, destroyOK, destroyNO, GeneralizedError } from "../resources/actions";
import { UnsafeError } from "../interfaces";
import { findByUuid } from "../resources/reducer";
import { generateUuid } from "../resources/util";
import { defensiveClone, HttpData } from "../util";
import { EditResourceParams } from "./interfaces";
import { ResourceIndex } from "../resources/interfaces";
import { SequenceBodyItem } from "farmbot/dist";
import * as _ from "lodash";
import { Actions } from "../constants";

export function edit(tr: TaggedResource, changes: Partial<typeof tr.body>):
  ReduxAction<EditResourceParams> {
  return {
    type: Actions.EDIT_RESOURCE,
    payload: { uuid: tr.uuid, update: changes }
  };
}

/** Rather than update (patch) a TaggedResource, this method will overwrite
 * everything within the `.body` property. */
export function overwrite(tr: TaggedResource,
  changeset: typeof tr.body):
  ReduxAction<EditResourceParams> {

  return {
    type: Actions.OVERWRITE_RESOURCE,
    payload: { uuid: tr.uuid, update: changeset }
  };
}

interface EditStepProps {
  step: Readonly<SequenceBodyItem>;
  sequence: Readonly<TaggedSequence>;
  index: number;
  /** Callback provides a fresh, defensively cloned copy of the
   * original step. Perform modifications to the resource within this
   * callback */
  executor(stepCopy: SequenceBodyItem): void;
}

/** Editing sequence steps is a tedious process. Use this function in place
 * of `edit()` or `overwrite`. */
export function editStep({ step, sequence, index, executor }: EditStepProps) {
  // https://en.wikipedia.org/wiki/NeXTSTEP
  const nextStep = defensiveClone(step);
  const nextSeq = defensiveClone(sequence);
  // Let the developer safely perform mutations here:
  executor(nextStep);
  nextSeq.body.body = nextSeq.body.body || [];
  nextSeq.body.body[index] = nextStep;
  return overwrite(sequence, nextSeq.body);
}

/** Initialize (but don't save) an indexed / tagged resource. */
export function init(resource: TaggedResource): ReduxAction<TaggedResource> {
  resource.body.id = 0;
  resource.specialStatus = SpecialStatus.DIRTY;
  /** Technically, this happens in the reducer, but I like to be extra safe. */
  resource.uuid = generateUuid(resource.body.id, resource.kind);
  return { type: Actions.INIT_RESOURCE, payload: resource };
}

export function initSave(resource: TaggedResource) {
  return function (dispatch: Function, getState: GetState) {
    const action = init(resource);
    if (resource.body.id === 0) { delete resource.body.id; }
    dispatch(action);
    const nextState = getState().resources.index;
    const tr = findByUuid(nextState, action.payload.uuid);
    return dispatch(save(tr.uuid));
  };
}

export function save(uuid: string) {
  return function (dispatch: Function, getState: GetState) {
    const resource = findByUuid(getState().resources.index, uuid);
    dispatch({ type: Actions.SAVE_RESOURCE_START, payload: resource });
    return dispatch(update(uuid));
  };
}

export function refresh(resource: TaggedResource, urlNeedsId = false) {
  return function (dispatch: Function) {
    dispatch(refreshStart(resource.uuid));
    const endPart = "" + urlNeedsId ? resource.body.id : "";
    axios
      .get(urlFor(resource.kind) + endPart)
      .then((resp: HttpData<typeof resource.body>) => {
        const r1 = defensiveClone(resource);
        const r2 = { body: defensiveClone(resp.data) };
        const newTR = _.assign({}, r1, r2);
        if (isTaggedResource(newTR)) {
          dispatch(refreshOK(newTR));
        } else {
          const action = refreshNO({ err: { message: "Unable to refresh" }, uuid: resource.uuid });
          dispatch(action);
        }
      });
  };
}

export function refreshStart(uuid: string): ReduxAction<string> {
  return { type: Actions.REFRESH_RESOURCE_START, payload: uuid };
}

export function refreshOK(payload: TaggedResource): ReduxAction<TaggedResource> {
  return { type: Actions.REFRESH_RESOURCE_OK, payload };
}

export function refreshNO(payload: GeneralizedError): ReduxAction<GeneralizedError> {
  return { type: Actions.REFRESH_RESOURCE_NO, payload };
}

function update(uuid: string) {
  return function (dispatch: Function, getState: GetState) {
    return updateViaAjax(getState().resources.index, uuid, dispatch);
  };
}

export function destroy(uuid: string, force = false) {
  return function (dispatch: Function, getState: GetState) {
    const resource = findByUuid(getState().resources.index, uuid);
    const maybeProceed = confirmationChecker(resource, force);
    return maybeProceed(() => {
      if (resource.body.id) {
        return axios
          .delete(urlFor(resource.kind) + resource.body.id)
          .then(function (resp: HttpData<typeof resource.body>) {
            dispatch(destroyOK(resource));
          })
          .catch(function (err: UnsafeError) {
            dispatch(destroyNO({ err, uuid }));
            return Promise.reject(err);
          });
      } else {
        dispatch(destroyOK(resource));
        return Promise.resolve("");
      }
    }) || Promise.reject("User pressed cancel");
  };
}

export function saveAll(input: TaggedResource[],
  callback: () => void = _.noop,
  errBack: (err: UnsafeError) => void = _.noop) {
  return function (dispatch: Function, getState: GetState) {
    const p = input
      .filter(x => x.specialStatus === SpecialStatus.DIRTY)
      .map(tts => dispatch(save(tts.uuid)));
    Promise.all(p).then(callback, errBack);
  };
}

export function urlFor(tag: ResourceName) {
  const OPTIONS: Partial<Record<ResourceName, string>> = {
    sequences: API.current.sequencesPath,
    tools: API.current.toolsPath,
    farm_events: API.current.farmEventsPath,
    regimens: API.current.regimensPath,
    peripherals: API.current.peripheralsPath,
    points: API.current.pointsPath,
    users: API.current.usersPath,
    device: API.current.devicePath,
    images: API.current.imagesPath,
    logs: API.current.logsPath,
    webcam_feed: API.current.webcamFeedPath
  };
  const url = OPTIONS[tag];
  if (url) {
    return url;
  } else {
    throw new Error(`No resource/URL handler for ${tag} yet.
    Consider adding one to crud.ts`);
  }
}

/** Shared functionality in create() and update(). */
function updateViaAjax(index: ResourceIndex,
  uuid: string,
  dispatch: Function) {
  const resource = findByUuid(index, uuid);
  const { body, kind } = resource;
  let verb: "post" | "put";
  let url = urlFor(kind);
  if (body.id) {
    verb = "put";
    url += body.id;
  } else {
    verb = "post";
  }
  return axios[verb](url, body)
    .then(function (resp: HttpData<typeof resource.body>) {
      const r1 = defensiveClone(resource);
      const r2 = { body: defensiveClone(resp.data) };
      const newTR = _.assign({}, r1, r2);
      if (isTaggedResource(newTR)) {
        dispatch(updateOK(newTR));
      } else {
        throw new Error("Just saved a malformed TR.");
      }
    })
    .catch(function (err: UnsafeError) {
      dispatch(updateNO({ err, uuid }));
      return Promise.reject(err);
    });
}

const MUST_CONFIRM_LIST: ResourceName[] = [
  "farm_events",
  "points",
  "sequences",
  "regimens",
  "images"
];

const confirmationChecker = (resource: TaggedResource, force = false) =>
  <T>(proceed: () => T): T | undefined => {
    if (MUST_CONFIRM_LIST.includes(resource.kind)) {
      if (force || confirm("Are you sure you want to delete this item?")) {
        return proceed();
      } else {
        return undefined;
      }
    }
    return proceed();
  };
