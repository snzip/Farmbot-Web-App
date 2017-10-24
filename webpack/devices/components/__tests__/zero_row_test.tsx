const mockDevice = {
  setZero: jest.fn()
};
jest.mock("../../../device", () => ({
  getDevice: () => (mockDevice)
}));
import * as React from "react";
import { mount } from "enzyme";
import { ZeroRow } from "../zero_row";
import { getDevice } from "../../../device";

describe("<HomingRow />", () => {
  beforeEach(function () {
    jest.clearAllMocks();
  });
  it("calls device", () => {
    const { mock } = getDevice().setZero as jest.Mock<{}>;
    const result = mount(<ZeroRow />);
    result.find("ZeroButton").at(0).simulate("click");
    result.find("ZeroButton").at(1).simulate("click");
    result.find("ZeroButton").at(2).simulate("click");
    expect(mock.calls.length).toEqual(3);
    expect(mock.calls[0][0]).toEqual("x");
    expect(mock.calls[1][0]).toEqual("y");
    expect(mock.calls[2][0]).toEqual("z");
  });
});
