import * as React from "react";
import { StepTitleBar } from "./step_title_bar";
import { splice, remove } from "./index";
import { t } from "i18next";
import { StepInputBox } from "../inputs/step_input_box";
import { StepParams } from "../interfaces";
import { ToolTips } from "../../constants";
import { StepIconGroup } from "../step_icon_group";

export function TileMoveRelative({ dispatch, currentStep, index, currentSequence }: StepParams) {
  return <div>
    <div className="step-wrapper">
      <div className="row">
        <div className="col-sm-12">
          <div className="step-header move-relative-step">
            <StepTitleBar index={index}
              dispatch={dispatch}
              step={currentStep}
              sequence={currentSequence} />
            <StepIconGroup
              onClone={() => dispatch(splice({
                step: currentStep,
                index,
                sequence: currentSequence
              }))}
              onTrash={() => remove({ dispatch, index, sequence: currentSequence })}
              helpText={t(ToolTips.MOVE_RELATIVE)} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <div className="step-content move-relative-step">
            <div className="row">
              <div className="col-xs-6 col-md-3">
                <label>{t("X (mm)")}</label>
                <StepInputBox dispatch={dispatch}
                  step={currentStep}
                  sequence={currentSequence}
                  index={index}
                  field="x" />
              </div>
              <div className="col-xs-6 col-md-3">
                <label>{t("Y (mm)")}</label>
                <StepInputBox dispatch={dispatch}
                  step={currentStep}
                  sequence={currentSequence}
                  index={index}
                  field="y" />
              </div>
              <div className="col-xs-6 col-md-3">
                <label>{t("Z (mm)")}</label>
                <StepInputBox dispatch={dispatch}
                  step={currentStep}
                  sequence={currentSequence}
                  index={index}
                  field="z" />
              </div>
              {/*<div className="col-xs-6 col-md-3">
                <label>{t("Speed")}</label>
                <StepInputBox dispatch={dispatch}
                  step={currentStep}
                  sequence={currentSequence}
                  index={index}
                  field="speed" />
              </div>*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
}
