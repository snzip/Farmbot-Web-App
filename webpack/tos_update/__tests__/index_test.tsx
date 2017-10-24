jest.mock("../../util", function () {
  return {
    hardRefresh: () => { }
  };
});

jest.mock("../../i18n", () => {
  return {
    detectLanguage: () => Promise.resolve({})
  };
});

import * as React from "react";
import { Wow } from "../index";
import { shallow } from "enzyme";
describe("<Wow/>", () => {
  it("toggles server options", () => {
    const x = shallow(<Wow />);
    const wow = x.instance() as Wow;
    wow.toggleServerOpts();
    expect(wow.state.hideServerSettings).toBeFalsy();
    wow.toggleServerOpts();
    expect(wow.state.hideServerSettings).toBeTruthy();
  });
});
