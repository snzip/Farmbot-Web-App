import * as React from "react";
import { JSXChildren } from "../util";

interface RowProps extends React.HTMLProps<HTMLDivElement> {
  children?: JSXChildren;
  className?: string;
}

export function Row(props: RowProps) {
  const className = props.className ? props.className += " row" : "row";
  return <div className={className}>
    {props.children}
  </div>;
}
