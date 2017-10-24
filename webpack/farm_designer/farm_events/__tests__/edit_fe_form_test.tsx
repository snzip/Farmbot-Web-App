import * as React from "react";
import { fakeFarmEvent, fakeSequence } from "../../../__test_support__/fake_state/resources";
import { mount } from "enzyme";
import { EditFEForm, EditFEProps, FarmEventViewModel, recombine } from "../edit_fe_form";
import { isString } from "lodash";
import { repeatOptions } from "../map_state_to_props_add_edit";
import { SpecialStatus } from "../../../resources/tagged_resources";

describe("<FarmEventForm/>", () => {
  const props = (): EditFEForm["props"] => ({
    deviceTimezone: undefined,
    executableOptions: [],
    repeatOptions: [],
    farmEvent: fakeFarmEvent("Sequence", 12),
    dispatch: jest.fn(),
    findExecutable: jest.fn(() => fakeSequence()),
    title: "title"
  });

  function instance(p: EditFEProps) {
    return mount<EditFEProps>(<EditFEForm {...p } />).instance() as EditFEForm;
  }
  const context = { form: new EditFEForm(props()) };

  beforeEach(() => {
    context.form = new EditFEForm(props());
  });

  it("sets defaults", () => {
    expect(context.form.state.fe).toMatchObject({});
  });

  it("determines if it is a one time event", () => {
    const i = instance(props());
    expect(i.isOneTime).toBe(true);
    i.mergeState("timeUnit", "daily");
    i.forceUpdate();
    expect(i.isOneTime).toBe(false);
  });

  it("has a dispatch", () => {
    const p = props();
    const i = instance(p);
    expect(i.dispatch).toBe(p.dispatch);
    i.dispatch();
    expect((p.dispatch as jest.Mock<{}>).mock.calls.length).toBe(1);
  });

  it("has a view model", () => {
    const p = props();
    const i = instance(p);
    i.forceUpdate();
    const vm = i.viewModel;
    const KEYS: (keyof FarmEventViewModel)[] = [
      "startDate",
      "startTime",
      "endDate",
      "endTime",
      "repeat",
      "timeUnit",
      "executable_type",
      "executable_id",
    ];

    KEYS.map(key => expect(isString(vm[key])).toBe(true));
    expect(vm.repeat).toEqual("" + p.farmEvent.body.repeat);
  });

  it("has an executable", () => {
    const p = props();
    const i = instance(p);
    i.forceUpdate();
    expect(i.executableGet().value).toEqual(fakeSequence().body.id);
    expect(i.executableGet().label).toEqual(fakeSequence().body.name);
  });

  it("sets the executable", () => {
    const p = props();
    const i = instance(p);
    i.forceUpdate();
    i.executableSet({ value: "wow", label: "hey", headingId: "Sequence" });
    i.forceUpdate();
    expect(i.state.fe.executable_type).toEqual("Sequence");
    expect(i.state.fe.executable_id).toEqual("wow");
  });

  it("gets executable info", () => {
    const p = props();
    const i = instance(p);
    i.forceUpdate();
    const exe = i.executableGet();
    expect(exe.label).toBe("fake");
    expect(exe.value).toBe(12);
    expect(exe.headingId).toBe("Sequence");
  });

  it("sets a subfield of state.fe", () => {
    const p = props();
    const i = instance(p);
    i.forceUpdate();
    // tslint:disable-next-line:no-any
    i.fieldSet("repeat")(({ currentTarget: { value: "4" } } as any));
    i.forceUpdate();
    expect(i.state.fe.repeat).toEqual("4");
  });

  it("sets regimen repeat to `never` as needed", () => {
    const result = recombine({
      "startDate": "2017-08-01",
      "startTime": "08:35",
      "endDate": "2017-08-01",
      "endTime": "08:33",
      "repeat": "1",
      "timeUnit": "daily",
      "executable_type": "Regimen",
      "executable_id": "1"
    });
    expect(result.time_unit).toEqual("never");
    expect(result.time_unit).not.toEqual("daily");
  });

  it("Recombines local state back into a Partial<TaggedFarmEvent[\"body\"]>", () => {
    const result = recombine({
      "startDate": "2017-08-01",
      "startTime": "08:35",
      "endDate": "2017-08-01",
      "endTime": "08:33",
      "repeat": "1",
      "timeUnit": "never",
      "executable_type": "Regimen",
      "executable_id": "1"
    });
    expect(result.start_time).toContain("2017-08-01");
    expect(result.end_time).toContain("2017-08-01");
    expect(result.start_time).toContain(":35:00.000");
    expect(result.end_time).toContain(":33:00.000");
    expect(result.repeat).toBe(1);
    expect(result.time_unit).toBe("never");
    expect(result.executable_id).toBe(1);
    expect(result.executable_type).toBe("Regimen");
  });

  it("renders the correct save button text when adding", () => {
    const seq = fakeSequence();
    const fe = fakeFarmEvent("Sequence", seq.body.id || 0);
    fe.specialStatus = SpecialStatus.DIRTY;
    const el = mount(<EditFEForm
      farmEvent={fe}
      title=""
      deviceTimezone="America/Chicago"
      executableOptions={[
        {
          "label": "Sequence: Every Node",
          "value": 11,
          "headingId": "Sequence"
        }
      ]}
      findExecutable={jest.fn(() => seq)}
      dispatch={jest.fn()}
      repeatOptions={repeatOptions} />);
    el.update();
    const txt = el.text().replace(/\s+/g, " ");
    expect(txt).toContain("Save *");
  });
});
