import { View, div, image, svg } from "gpui-kit";
import { h_flex, v_flex } from "gpui-base";
import { theme, run, props, window, shared, setShared, updates, layout } from "herdr";

function dotted(t, el, tint) {
  return div().size_full().relative().overflow_hidden().when(Boolean(tint), (d) => d.bg(tint))
    .child(svg("mods/my-chrome/dots.svg").absolute().top(0).left(0).w(480).h(1400).text_color(t.foreground + "1c"))
    .child(el);
}

function find(node, id) {
  if (node?.id === id) return node;
  for (const child of node?.children ?? []) {
    const found = find(child, id);
    if (found) return found;
  }
  return null;
}

// The sidebar's rail goes by its width, not a flag: dragging its edge narrows it too.
const narrow = () => (find(layout(), "sidebar")?.size?.px ?? Infinity) < 160;

// To the rail (on macOS wide enough for the traffic lights), or back to the width it had.
function toggleSidebar() {
  const width = find(layout(), "sidebar")?.size?.px;
  if (!narrow()) setShared("sidebar.width", width);
  // Mods edited before the rail went by width still read the flag.
  setShared("sidebar.collapsed", !narrow());
  const px = narrow() ? (shared("sidebar.width") ?? 200) : window()?.platform === "macos" ? 76 : 52;
  run("layout.resize", { id: "sidebar", px });
  run("layout.resize", { id: "sidebar-footer", px: px < 160 ? 76 : 44 });
}

export default class WorkspaceChrome extends View {
  button(id, label, action) {
    const t = theme();
    return div().id(id).size(26).flex_none().flex().items_center().justify_center().rounded(6).text_color(t.muted).hover(s => s.bg(t.hover).text_color(t.foreground))
      .on_mouse_down("left", (_e, cx) => cx.stop_propagation()).on_click(action).child(label);
  }
  render() {
    const t = theme();
    const collapsed = narrow();
    if (props()?.footer) {
      // Just the gear; machines are added from Settings > Machines or ctrl+shift+k.
      const ico = (id, label, action, ...icons) => h_flex().id(id).relative().h(28).min_w(28).px(6).gap(3).flex_none().items_center().justify_center().rounded(7)
        .text_color(t.muted).hover(s => s.bg(t.hover).text_color(t.foreground)).cursor_pointer().tooltip(label).on_click(action)
        .children(icons.map(i => svg(`mods/my-chrome/${i}.svg`).size(i === "plus" ? 12 : 15)));
      const ready = div().absolute().top(3).right(3).size(6).rounded_full().bg(t.accent);
      const settingsBtn = ico("settings", "Settings", () => run("app.settings"), "settings")
        .when(Boolean(updates().app.ready), el => el.child(ready));
      return dotted(t, (collapsed ? v_flex().items_center().justify_center().gap(4) : h_flex().items_center().gap(4).px(8))
        .size_full().border_t(1).border_color(t.border)
        .child(settingsBtn), "#ffffff0a");
    }
    const fold = this.button("fold", svg("mods/my-chrome/panel-left.svg").size(14), toggleSidebar);
    if (collapsed) return dotted(t, h_flex().size_full().justify_center().items_center().child(fold));
    return dotted(t, h_flex().size_full().pl(14).pr(10).gap(4).items_center().text_size(13.5)
      .when(window()?.platform === "macos" && !window()?.fullscreen, el => el.pl(76))
      .child(h_flex().flex_1().gap(8).items_center().child(image("frame/welcome/herdr.png").size(20).rounded(5)).child(div().font_semibold().text_color(t.foreground).child("Herdr")))
      .child(this.button("space-prev", svg("mods/my-chrome/chevron-left.svg").size(14), () => run("space.prev")))
      .child(this.button("space-next", svg("mods/my-chrome/chevron-right.svg").size(14), () => run("space.next")))
      .child(fold));
  }
}
