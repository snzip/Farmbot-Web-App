import * as React from "react";
import { mount } from "enzyme";
import { ToggleButton } from "../toggle_button";

describe("<ToggleButton/>", function () {
  beforeEach(function () {
    jest.clearAllMocks();
  });

  it("calls toggle action", () => {
    const toggle = jest.fn();
    const toggleButton = mount(<ToggleButton
      toggleValue={0}
      toggleAction={() => toggle()} />);
    toggleButton.simulate("click");
    expect(toggle.mock.calls.length).toEqual(1);
  });

  it("displays no", () => {
    const toggleButton = mount(<ToggleButton
      toggleValue={0}
      toggleAction={jest.fn()} />);
    expect(toggleButton.text()).toBe("no");
  });

  it("displays yes", () => {
    const toggleButton = mount(<ToggleButton
      toggleValue={1}
      toggleAction={jest.fn()} />);
    expect(toggleButton.text()).toBe("yes");
  });

  it("displays off", () => {
    const toggleButton = mount(<ToggleButton
      toggleValue={0}
      toggleAction={jest.fn()}
      noYes={false} />);
    expect(toggleButton.text()).toEqual("off");
  });

  it("displays on", () => {
    const toggleButton = mount(<ToggleButton
      toggleValue={1}
      toggleAction={jest.fn()}
      noYes={false} />);
    expect(toggleButton.text()).toEqual("on");
  });

  it("displays 🚫", () => {
    const toggleButton = mount(<ToggleButton
      toggleValue={undefined}
      toggleAction={jest.fn()}
      noYes={false} />);
    expect(toggleButton.text()).toEqual("🚫");
  });
});
