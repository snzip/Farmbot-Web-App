import { buildResourceIndex } from "../../__test_support__/resource_index_builder";
import { findSlotByToolId, getFeeds } from "../selectors";
import { resourceReducer, emptyState } from "../reducer";
import { TaggedTool, TaggedToolSlotPointer } from "../tagged_resources";
import { createOK } from "../actions";
import { generateUuid } from "../util";
import { fakeWebcamFeed } from "../../__test_support__/fake_state/resources";
import { Actions } from "../../constants";

const TOOL_ID = 99;
const SLOT_ID = 100;
const fakeTool: TaggedTool = {
  kind: "tools",
  specialStatus: undefined,
  uuid: generateUuid(TOOL_ID, "tools"),
  body: {
    name: "yadda yadda",
    id: TOOL_ID
  }
};
const fakeSlot: TaggedToolSlotPointer = {
  kind: "points",
  specialStatus: undefined,
  uuid: generateUuid(SLOT_ID, "points"),
  body: {
    tool_id: TOOL_ID,
    pointer_type: "ToolSlot",
    radius: 0,
    x: 0,
    y: 0,
    z: 0,
    name: "wow",
    pointer_id: SLOT_ID,
    meta: {}
  }
};

describe("findSlotByToolId", () => {
  it("returns undefined when not found", () => {
    const state = resourceReducer(buildResourceIndex(), createOK(fakeTool));
    expect(state.index.byKindAndId["tools." + fakeTool.body.id]);
    const result = findSlotByToolId(state.index, TOOL_ID);
    expect(result).toBeFalsy();
  });

  it("returns something when there is a match", () => {
    const initialState = buildResourceIndex();
    const state = [createOK(fakeTool), createOK(fakeSlot)]
      .reduce(resourceReducer, initialState);
    const result = findSlotByToolId(state.index, TOOL_ID);
    expect(result).toBeTruthy();
    if (result) { expect(result.kind).toBe("points"); }
  });
});

describe("getFeeds", () => {
  it("returns empty array", () => {
    expect(getFeeds(emptyState().index).length).toBe(0);
  });

  it("finds the only WebcamFeed", () => {
    const feed = fakeWebcamFeed();
    const state = [{
      type: Actions.RESOURCE_READY,
      payload: {
        name: "webcam_feed",
        data: feed
      }
    }].reduce(resourceReducer, emptyState());
    expect(getFeeds(state.index)[0].body).toEqual(feed);
  });
});
