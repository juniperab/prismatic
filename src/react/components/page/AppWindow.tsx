import { ReactElement, ReactNode } from "react";
import { AppWindowInner, AppWindowOuter } from "./appWindowStyle";

export function AppWindow(props: {children: ReactNode}): ReactElement {
  return <AppWindowOuter><AppWindowInner>{props.children}</AppWindowInner></AppWindowOuter>
}
