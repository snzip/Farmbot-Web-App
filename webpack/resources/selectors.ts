import * as _ from "lodash";
import { error } from "farmbot-toastr";
import { ResourceIndex, SlotWithTool } from "./interfaces";
import { joinKindAndId } from "./reducer";
import {
  isTaggedFarmEvent,
  isTaggedPlantPointer,
  isTaggedGenericPointer,
  isTaggedRegimen,
  isTaggedResource,
  isTaggedSequence,
  isTaggedTool,
  isTaggedToolSlotPointer,
  ResourceName,
  sanityCheck,
  TaggedCrop,
  TaggedFarmEvent,
  TaggedGenericPointer,
  TaggedImage,
  TaggedLog,
  TaggedPeripheral,
  TaggedPlantPointer,
  TaggedRegimen,
  TaggedResource,
  TaggedSequence,
  TaggedTool,
  TaggedToolSlotPointer,
  TaggedUser,
  TaggedWebcamFeed
} from "./tagged_resources";
import { CowardlyDictionary, betterCompact, sortResourcesById } from "../util";
type StringMap = CowardlyDictionary<string>;

export let findId = (index: ResourceIndex, kind: ResourceName, id: number) => {

  const uuid = index.byKindAndId[joinKindAndId(kind, id)];
  assertUuid(kind, uuid);
  if (uuid) {
    return uuid;
  } else {
    throw new Error("UUID not found for id " + id);
  }
};

export function findResourceById(index: ResourceIndex, kind: ResourceName,
  id: number) {
  return findId(index, kind, id);
}

export let isKind = (name: ResourceName) => (tr: TaggedResource) => tr.kind === name;

function findAll(index: ResourceIndex, name: ResourceName) {
  const results: TaggedResource[] = [];

  index.byKind[name].map(function (uuid) {
    const item = index.references[uuid];
    (item && isTaggedResource(item) && results.push(item));
  });
  return sortResourcesById(results);
}

export function selectAllFarmEvents(index: ResourceIndex) {
  return findAll(index, "farm_events") as TaggedFarmEvent[];
}

export function selectAllPoints(index: ResourceIndex) {
  return findAll(index, "points") as
    (TaggedGenericPointer | TaggedPlantPointer | TaggedToolSlotPointer)[];
}

export function groupPointsByType(index: ResourceIndex) {
  return _(selectAllPoints(index))
    // If this fiails to compile....
    .tap(x => x[0].body.pointer_type)
    // ... this line must be updated:
    .groupBy("body.pointer_type")
    .value();
}

export function findPointerByTypeAndId(index: ResourceIndex,
  type_: string,
  id: number) {
  const p = selectAllPoints(index)
    .filter(({ body }) => (body.id === id) && (body.pointer_type === type_))[0];
  if (p) {
    return p;
  } else {
    // We might have a sequence dependency leak if this exception is ever
    // thrown.
    throw new Error(`Tried to fetch bad point ${type_} ${id}`);
  }
}

export function selectAllGenericPointers(index: ResourceIndex):
  TaggedGenericPointer[] {
  const genericPointers = selectAllPoints(index)
    .map(p => (isTaggedGenericPointer(p)) ? p : undefined);
  return betterCompact(genericPointers);
}

export function selectAllPlantPointers(index: ResourceIndex): TaggedPlantPointer[] {
  const genericPointers = selectAllPoints(index)
    .map(p => (isTaggedPlantPointer(p)) ? p : undefined);
  return betterCompact(genericPointers);
}

export function selectAllToolSlotPointers(index: ResourceIndex):
  TaggedToolSlotPointer[] {
  const genericPointers = selectAllPoints(index)
    .map(p => (isTaggedToolSlotPointer(p)) ? p : undefined);
  return betterCompact(genericPointers);
}

export function selectAllTools(index: ResourceIndex) {
  return findAll(index, "tools") as TaggedTool[];
}

export function selectAllPeripherals(index: ResourceIndex) {
  return findAll(index, "peripherals") as TaggedPeripheral[];
}

export function selectAllLogs(index: ResourceIndex) {
  return findAll(index, "logs") as TaggedLog[];
}

interface Finder<T> {
  (i: ResourceIndex, u: string): T;
}
/** Generalized way to stamp out "finder" functions.
 * Pass in a `ResourceName` and it will add all the relevant checks.
 * WARNING: WILL THROW ERRORS IF RESOURCE NOT FOUND!
 */
const find = (r: ResourceName) =>
  function findResource(i: ResourceIndex, u: string) {
    assertUuid(r, u);
    const result = i.references[u];
    if (result && isTaggedResource(result) && sanityCheck(result)) {
      return result as TaggedResource;
    } else {
      error("Resource error");
      throw new Error(`Tagged resource ${r} was not found or malformed: ` +
        JSON.stringify(result));
    }
  };

export function findToolSlot(i: ResourceIndex, uuid: string): TaggedToolSlotPointer {
  const ts = selectAllToolSlotPointers(i).filter(x => x.uuid === uuid)[0];
  if (ts) {
    return ts;
  } else {
    throw new Error("ToolSlotPointer not found: " + uuid);
  }
}
export let findTool = find("tools") as Finder<TaggedTool>;
export let findSequence = find("sequences") as Finder<TaggedSequence>;
export let findRegimen = find("regimens") as Finder<TaggedRegimen>;
export let findFarmEvent = find("farm_events") as Finder<TaggedFarmEvent>;
export let findPoints = find("points") as Finder<TaggedPlantPointer>;

export function findPlant(i: ResourceIndex, uuid: string):
  TaggedPlantPointer {
  const point = findPoints(i, uuid);
  if (point && sanityCheck(point) && point.body.pointer_type === "Plant") {
    return point;
  } else {
    throw new Error("That is not a true plant pointer");
  }
}
export function selectCurrentToolSlot(index: ResourceIndex, uuid: string) {
  const x = index.references[uuid];
  if (x && isTaggedToolSlotPointer(x)) {
    return x;
  } else {
    throw new Error("selectCurrentToolSlot: Not a tool slot: ");
  }
}

export function selectAllImages(index: ResourceIndex) {
  return findAll(index, "images") as TaggedImage[];
}

export function selectAllRegimens(index: ResourceIndex) {
  return findAll(index, "regimens") as TaggedRegimen[];
}

export function selectAllCrops(index: ResourceIndex) {
  return findAll(index, "crops") as TaggedCrop[];
}

export function getRegimenByUUID(index: ResourceIndex, uuid: string) {
  assertUuid("regimens", uuid);
  return index.references[uuid];
}

export function getSequenceByUUID(index: ResourceIndex,
  uuid: string): TaggedSequence {
  assertUuid("sequences", uuid);
  const result = index.references[uuid];
  if (result && isTaggedSequence(result)) {
    return result;
  } else {
    throw new Error("BAD Sequence UUID;");
  }
}

export function selectAllSequences(index: ResourceIndex) {
  return findAll(index, "sequences") as TaggedSequence[];
}

export function indexSequenceById(index: ResourceIndex) {
  const output: CowardlyDictionary<TaggedSequence> = {};
  const uuids = index.byKind.sequences;
  uuids.map(uuid => {
    assertUuid("sequences", uuid);
    const sequence = index.references[uuid];
    if (sequence && isTaggedSequence(sequence) && sequence.body.id) {
      output[sequence.body.id] = sequence;
    }
  });
  return output;
}

export function indexRegimenById(index: ResourceIndex) {
  const output: CowardlyDictionary<TaggedRegimen> = {};

  const uuids = index.byKind.regimens;
  uuids.map(uuid => {
    assertUuid("regimens", uuid);
    const regimen = index.references[uuid];
    if (regimen && isTaggedRegimen(regimen) && regimen.body.id) {
      output[regimen.body.id] = regimen;
    }
  });
  return output;
}

export function indexFarmEventById(index: ResourceIndex) {
  const output: CowardlyDictionary<TaggedFarmEvent> = {};

  const uuids = index.byKind.farm_events;
  uuids.map(uuid => {
    assertUuid("farm_events", uuid);
    const farmEvent = index.references[uuid];
    if (farmEvent && isTaggedFarmEvent(farmEvent) && farmEvent.body.id) {
      output[farmEvent.body.id] = farmEvent;
    }
  });
  return output;
}

export function indexByToolId(index: ResourceIndex) {
  const output: CowardlyDictionary<TaggedTool> = {};

  const uuids = index.byKind.tools;
  uuids.map(uuid => {
    assertUuid("tools", uuid);
    const Tool = index.references[uuid];
    if (Tool && isTaggedTool(Tool) && Tool.body.id) {
      output[Tool.body.id] = Tool;
    }
  });
  return output;
}

export function indexBySlotId(index: ResourceIndex) {
  const output: CowardlyDictionary<TaggedToolSlotPointer> = {};

  const uuids = index.byKind.points;
  uuids.map(uuid => {
    assertUuid("points", uuid);
    const tool_slot = index.references[uuid];
    if (tool_slot && isTaggedToolSlotPointer(tool_slot) && tool_slot.body.id) {
      output[tool_slot.body.id] = tool_slot;
    }
  });
  return output;
}

export function assertUuid(expected: ResourceName, actual: string | undefined) {
  if (actual && !actual.startsWith(expected)) {
    console.warn(`
    BAD NEWS!!! You thought this was a ${expected} UUID, but here's what it
    actually was:
      ${actual}
    `);
    return false;
  } else {
    return true;
  }
}

export function toArray(index: ResourceIndex) {
  return index.all.map(function (uuid) {
    const tr = index.references[uuid];
    if (tr) {
      return tr;
    } else {
      throw new Error("Fund bad index UUID: " + uuid);
    }
  });
}

/** GIVEN: a slot UUID.
 *  FINDS: Tool in that slot (if any) */
export let currentToolInSlot = (index: ResourceIndex) =>
  (toolSlotUUID: string): TaggedTool | undefined => {
    const currentSlot = selectCurrentToolSlot(index, toolSlotUUID);
    if (currentSlot
      && currentSlot.kind === "points") {
      const toolUUID = index
        .byKindAndId[joinKindAndId("tools", currentSlot.body.tool_id)];
      const tool = index.references[toolUUID || "NOPE!"];
      if (tool && isTaggedTool(tool)) {
        return tool;
      }
    }
  };

/** FINDS: all tagged resources with particular ID */
export function findAllById(i: ResourceIndex, ids: number[], k: ResourceName) {
  const output: TaggedResource[] = [];
  findAll(i, k).map(x => x.kind === k ? output.push(x) : "");
  return output;
}

/** FINDS: All tools that are in use. */
export function toolsInUse(index: ResourceIndex): TaggedTool[] {
  const ids = betterCompact(selectAllToolSlotPointers(index).map(ts => ts.body.tool_id));
  return findAllById(index, ids, "tools") as TaggedTool[];
}

export let byId = <T extends TaggedResource>(name: ResourceName) =>
  (index: ResourceIndex, id: number): T | undefined => {
    const tools = findAll(index, name);
    const f = (x: TaggedResource) => (x.kind === name) && (x.body.id === id);
    // Maybe we should add a throw here?
    return tools.filter(f)[0] as T | undefined;
  };

export function hasId(ri: ResourceIndex, k: ResourceName, id: number): boolean {
  return !!ri.byKindAndId[joinKindAndId(k, id)];
}

export let findFarmEventById = (ri: ResourceIndex, fe_id: number) => {
  const fe = byId("farm_events")(ri, fe_id);
  if (fe && isTaggedFarmEvent(fe) && sanityCheck(fe)) {
    return fe;
  } else {
    const e = new Error(`Bad farm_event id: ${fe_id}`);
    throw e;
  }
};

export let maybeFindToolById = (ri: ResourceIndex, tool_id?: number):
  TaggedTool | undefined => {
  const tool = tool_id && byId("tools")(ri, tool_id);
  if (tool && isTaggedTool(tool) && sanityCheck(tool)) {
    return tool;
  } else {
    return undefined;
  }
};

export let findToolById = (ri: ResourceIndex, tool_id: number) => {
  const tool = maybeFindToolById(ri, tool_id);
  if (tool) {
    return tool;
  } else {
    throw new Error("Bad tool id: " + tool_id);
  }
};

export let findSequenceById = (ri: ResourceIndex, sequence_id: number) => {
  const sequence = byId("sequences")(ri, sequence_id);
  if (sequence && isTaggedSequence(sequence) && sanityCheck(sequence)) {
    return sequence;
  } else {
    throw new Error("Bad sequence id: " + sequence_id);
  }
};

export let findRegimenById = (ri: ResourceIndex, regimen_id: number) => {
  const regimen = byId("regimens")(ri, regimen_id);
  if (regimen && isTaggedRegimen(regimen) && sanityCheck(regimen)) {
    return regimen;
  } else {
    throw new Error("Bad regimen id: " + regimen_id);
  }
};

export let findSlotById = byId<TaggedToolSlotPointer>("points");
/** Find a Tool's corresponding Slot. */
export let findSlotByToolId = (index: ResourceIndex, tool_id: number) => {
  const tool = findToolById(index, tool_id);
  const query: any = { body: { tool_id: tool.body.id } };
  const every = Object
    .keys(index.references)
    .map(x => index.references[x]);
  const tts = _.find(every, query);
  if (tts && isTaggedToolSlotPointer(tts) && sanityCheck(tts)) {
    return tts;
  } else {
    return undefined;
  }
};

export function maybeGetSequence(index: ResourceIndex,
  uuid: string | undefined): TaggedSequence | undefined {
  if (uuid) {
    return getSequenceByUUID(index, uuid);
  } else {
    return undefined;
  }
}

export function maybeGetRegimen(index: ResourceIndex,
  uuid: string | undefined): TaggedRegimen | undefined {
  const tr = uuid && getRegimenByUUID(index, uuid);
  if (tr && isTaggedRegimen(tr)) { return tr; }
}

/** Unlike other findById methods, this one allows undefined (missed) values */
export function maybeFindPlantById(index: ResourceIndex, id: number) {
  const uuid = index.byKindAndId[joinKindAndId("points", id)];
  const resource = index.references[uuid || "nope"];
  if (resource && isTaggedPlantPointer(resource)) { return resource; }
}

export function getDeviceAccountSettings(index: ResourceIndex) {
  const list = index.byKind.device;
  const uuid = list[0];
  const device = index.references[uuid || -1];
  if ((list.length === 1) && device && device.kind === "device") {
    sanityCheck(device);
    return device;
  } else {
    throw new Error(`
    PROBLEM: Expected getDeviceAccountSettings() to return exactly 1 device.
    We got some other number back, indicating a hazardous condition.`);
  }
}

export function getFeeds(index: ResourceIndex): TaggedWebcamFeed[] {
  const list = index.byKind.webcam_feed;
  const output: TaggedWebcamFeed[] = [];
  list.forEach(y => {
    const x = index.references[y];
    if (x && x.kind === "webcam_feed") {
      sanityCheck(x);
      output.push(x);
    }
  });
  return output;
}

export function maybeFetchUser(index: ResourceIndex):
  TaggedUser | undefined {
  const list = index.byKind.users;
  const uuid = list[0];
  const user = index.references[uuid || -1];

  if (user && sanityCheck(user) && list.length > 1) {
    throw new Error("Index is broke. Expected exactly 1 user.");
  }
  if ((list.length === 1) && user && user.kind === "users") {
    return user;
  } else {
    return undefined;
  }
}
export function getUserAccountSettings(index: ResourceIndex): TaggedUser {
  const user = maybeFetchUser(index);
  if (user) {
    return user;
  } else {
    throw new Error(`PROBLEM: Expected getUserAccountSettings() to return
    exactly 1 user. We got some other number back, indicating a hazardous
    condition.`);
  }
}

export function all(index: ResourceIndex) {
  return betterCompact(index.all.map(uuid => index.references[uuid]));
}

/** For those times that you need to ref a tool and slot together. */
export function joinToolsAndSlot(index: ResourceIndex): SlotWithTool[] {
  return selectAllToolSlotPointers(index)
    .map(function (toolSlot) {
      return {
        toolSlot,
        tool: maybeFindToolById(index, toolSlot.body.tool_id)
      };
    });
}

export function mapToolIdToName(input: ResourceIndex) {
  return selectAllTools(input)
    .map(x => ({ key: "" + x.body.id, val: x.body.name }))
    .reduce((x, y) => ({ ...{ [y.key]: y.val, ...x } }), {} as StringMap);
}
/** I dislike this method. */
export function findToolBySlotId(input: ResourceIndex, tool_slot_id: number):
  TaggedTool | undefined {
  const wow = input
    .byKind
    .points
    .map(x => input.references[x])
    .map((x) => {
      if (x
        && (x.kind === "points")
        && x.body.pointer_type === "ToolSlot"
        && x.body.tool_id) {
        return maybeFindToolById(input, x.body.tool_id);
      } else {
        return undefined;
      }
    })
    .filter(x => x)[0];
  if (wow && wow.kind === "tools") {
    return wow;
  } else {
    return undefined;
  }
}
