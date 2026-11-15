// Builds the confirm dialog's content for a close action and opens it.
import { focused, panes, spaces, openOverlay } from "herdr";

export function askClose(kind, p = {}) {
  const f = focused();
  const cfg = build(kind, p, f);
  if (!cfg) return;
  openOverlay({ mod: "ask-close", kind: "dialog", frame: "none", width: 340, height: 132, props: cfg });
}

function build(kind, p, f) {
  const ps = panes();
  const sp = spaces();
  if (kind === "quit") {
    return { title: "Quit Herdr?", detail: `${sp.length} spaces, ${ps.filter((x) => x.terminal).length} terminals — they keep running`, command: { name: "app.quit", args: {} }, danger: false, label: "Quit" };
  }
  if (kind === "pane") {
    const id = p.pane ?? f?.pane;
    if (!id) return null;
    const pane = ps.find((x) => x.pane === id);
    const s = sp.find((x) => x.id === (pane?.space ?? f?.space));
    if (s && s.tabs.reduce((n, t) => n + t.panes, 0) === 1) return space(s, ps.filter((x) => x.space === s.id && x.terminal).length || 1);
    const name = ((pane?.program?.agent || pane?.program?.shell) && pane.program.name) || pane?.title || pane?.program?.name || "pane";
    const dir = pane?.cwd?.replace(/\/+$/, "").split("/").pop() || pane?.cwd;
    return { title: "Close pane?", detail: `${name}${dir ? ` — ${dir}` : ""}`, command: { name: "pane.close", args: { pane: id } }, danger: true, label: "Close" };
  }
  const id = p.tab ?? f?.tab;
  if (!id) return null;
  const s = sp.find((x) => x.tabs.some((t) => t.id === id));
  const tab = s?.tabs.find((t) => t.id === id);
  if (s?.tabs.length === 1) return space(s, ps.filter((x) => x.tab === id && x.terminal).length);
  return { title: "Close tab?", detail: `${tab?.name ?? "tab"} — ${tab?.panes ?? 1} panes`, command: { name: "tab.close", args: { id } }, danger: true, label: "Close" };
}

function space(s, n) {
  return { title: "Close space?", detail: `${s.name} — ${n} terminals`, command: { name: "space.close", args: { id: s.id, confirmed: true } }, danger: true, label: "Close" };
}
