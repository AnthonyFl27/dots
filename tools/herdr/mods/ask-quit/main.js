// Launcher: bound to a key (mod.open) or opened by a × button with props { pane | tab }.
import { View, div } from "gpui-kit";
import { props, closeOverlay } from "herdr";
import { askClose } from "./ask.js";

export default class Launcher extends View {
  init() {
    const p = props();
    if (p?.overlay) closeOverlay(p.overlay);
    askClose("quit", p ?? {});
  }
  render() { return div(); }
}
