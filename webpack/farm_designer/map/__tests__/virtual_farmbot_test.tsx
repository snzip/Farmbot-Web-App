const mockStorj: Dictionary<boolean> = {};

jest.mock("../../../session", () => {
  return {
    Session: {
      getBool: (k: string) => {
        mockStorj[k] = !!mockStorj[k];
        return mockStorj[k];
      },
    }
  };
});

import * as React from "react";
import { VirtualFarmBot } from "../virtual_farmbot";
import { shallow } from "enzyme";
import { VirtualFarmBotProps } from "../interfaces";
import { BotOriginQuadrant } from "../../interfaces";
import { Dictionary } from "farmbot";

describe("<VirtualFarmBot/>", () => {
  function fakeProps(): VirtualFarmBotProps {
    return {
      botLocationData: {
        position: { x: 0, y: 0, z: 0 },
        scaled_encoders: { x: undefined, y: undefined, z: undefined },
        raw_encoders: { x: undefined, y: undefined, z: undefined },
      },
      mapTransformProps: {
        quadrant: 1, gridSize: { x: 3000, y: 1500 }
      },
      plantAreaOffset: { x: 100, y: 100 }
    };
  }

  function checkPositionForQuadrant(
    quadrant: BotOriginQuadrant,
    expected: { x: number, y: number }) {
    it(`shows in correct location for quadrant ${quadrant}`, () => {
      const p = fakeProps();
      p.mapTransformProps.quadrant = quadrant;
      const result = shallow(<VirtualFarmBot {...p } />);

      const expectedGantryProps = {
        id: "gantry",
        x: expected.x - 10,
        y: -100,
        width: 20,
        height: 1700,
        fill: "#434343",
        fillOpacity: 0.75
      };
      const gantryProps = result.find("rect").props();
      expect(gantryProps).toEqual(expectedGantryProps);

      const expectedUTMProps = {
        id: "UTM",
        cx: expected.x,
        cy: expected.y,
        r: 35,
        fill: "#434343",
        fillOpacity: 0.75
      };
      const UTMProps = result.find("circle").props();
      expect(UTMProps).toEqual(expectedUTMProps);
    });
  }

  checkPositionForQuadrant(1, { x: 3000, y: 0 });
  checkPositionForQuadrant(2, { x: 0, y: 0 });
  checkPositionForQuadrant(3, { x: 0, y: 1500 });
  checkPositionForQuadrant(4, { x: 3000, y: 1500 });

  it("changes location", () => {
    const p = fakeProps();
    p.mapTransformProps.quadrant = 2;
    p.botLocationData.position = { x: 100, y: 200, z: 0 };
    const result = shallow(<VirtualFarmBot {...p } />);
    const gantry = result.find("#gantry");
    expect(gantry.length).toEqual(1);
    expect(gantry.props().x).toEqual(90);
    const UTM = result.find("circle").props();
    expect(UTM.cx).toEqual(100);
    expect(UTM.cy).toEqual(200);
  });

  it("shows trail", () => {
    mockStorj["displayTrail"] = true;
    sessionStorage["virtualTrail"] = JSON.stringify([
      { x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }, { x: 4, y: 4 }]);
    const p = fakeProps();
    p.mapTransformProps.quadrant = 2;
    const wrapper = shallow(<VirtualFarmBot {...p } />);
    const lines = wrapper.find("#trail").find("line");
    expect(lines.length).toEqual(4);
    expect(lines.first().props()).toEqual({
      id: "trail-line-1",
      stroke: "red",
      strokeOpacity: 0.25,
      strokeWidth: 0.5,
      x1: 2, x2: 1, y1: 2, y2: 1
    });
    expect(lines.last().props()).toEqual({
      id: "trail-line-4",
      stroke: "red",
      strokeOpacity: 1,
      strokeWidth: 2,
      x1: 0, x2: 4, y1: 0, y2: 4
    });
  });

  it("shows encoder position", () => {
    mockStorj["encoderFigure"] = true;
    const p = fakeProps();
    p.mapTransformProps.quadrant = 2;
    p.botLocationData.position = { x: 100, y: 200, z: 0 };
    p.botLocationData.scaled_encoders = { x: 300, y: 400, z: 0 };
    const wrapper = shallow(<VirtualFarmBot {...p } />);
    expect(wrapper.find("#gantry").first().props().x).toEqual(90);
    expect(wrapper.find("#gantry").last().props().x).toEqual(290);
    const motorsUTM = wrapper.find("circle").first().props();
    expect(motorsUTM.cx).toEqual(100);
    expect(motorsUTM.cy).toEqual(200);
    expect(motorsUTM.fillOpacity).toEqual(0.75);
    const encodersUTM = wrapper.find("circle").last().props();
    expect(encodersUTM.cx).toEqual(300);
    expect(encodersUTM.cy).toEqual(400);
    expect(encodersUTM.fillOpacity).toEqual(0.25);
  });
});
