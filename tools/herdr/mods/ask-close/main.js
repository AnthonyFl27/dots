// Paradise-styled confirm dialog. Props: { title, detail, command, danger, label, overlay }.
// Enter confirms, Esc cancels.
import { View, div } from "gpui-kit";
import { v_flex, h_flex } from "gpui-base";
import { run, props, closeOverlay, theme } from "herdr";

export default class AskClose extends View {
  init(_p, cx) {
    this.handle = cx.focus_handle();
    this.handle.focus();
  }

  yes() {
    const p = props();
    closeOverlay(p.overlay);
    run(p.command.name, p.command.args ?? {});
  }

  render() {
    const t = theme();
    const p = props() ?? {};
    const tone = p.danger ? t.ansi1 : t.accent;
    const btn = (id, label, primary, onClick) =>
      div().id(id).h(28).px(12).flex().items_center().rounded(7).text_size(12.5).cursor_pointer()
        .border(1).border_color(primary ? tone : t.border)
        .bg(primary ? tone + "22" : t.chrome)
        .text_color(primary ? tone : t.muted)
        .hover((s) => s.bg(primary ? tone + "38" : t.hover).text_color(primary ? tone : t.foreground))
        .on_click(onClick).child(label);
    return v_flex().id("ask-close").track_focus(this.handle)
      .on_key_down((e, cx) => {
        if (e.key === "enter") this.yes();
        else if (e.key === "escape") closeOverlay(props().overlay);
        else return;
        cx.stop_propagation();
      })
      .size_full().min_h(0).p(16).gap(10).rounded(10)
      .bg(t.chrome).border(1).border_color(t.border).text_size(13)
      .child(div().text_size(14).font_semibold().text_color(t.foreground).child(p.title ?? "¿Seguro?"))
      .child(div().flex_1().min_h(0).truncate().text_color(t.dim).child(p.detail ?? ""))
      .child(h_flex().items_center().gap(8)
        .child(div().flex_1().text_size(11).text_color(t.dim).child("↵ confirmar · esc cancelar"))
        .child(btn("no", "Cancel", false, () => closeOverlay(props().overlay)))
        .child(btn("yes", p.label ?? "Confirm", true, () => this.yes())));
  }
}
