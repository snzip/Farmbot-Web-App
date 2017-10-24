import * as React from "react";
import { SequenceEditorMiddleProps } from "./interfaces";
import { isTaggedSequence } from "../resources/tagged_resources";
import { SequenceEditorMiddleInactive } from "./sequence_editor_middle_inactive";
import { SequenceEditorMiddleActive } from "./sequence_editor_middle_active";

export class SequenceEditorMiddle
  extends React.Component<SequenceEditorMiddleProps, {}> {
  render() {
    const {
      dispatch,
      sequence,
      sequences,
      tools,
      slots,
      resources,
      syncStatus
    } = this.props;
    if (sequence && isTaggedSequence(sequence)) {
      return <SequenceEditorMiddleActive
        slots={slots}
        dispatch={dispatch}
        sequence={sequence}
        sequences={sequences}
        tools={tools}
        resources={resources}
        syncStatus={syncStatus} />;
    } else {
      return <SequenceEditorMiddleInactive />;
    }
  }
}
