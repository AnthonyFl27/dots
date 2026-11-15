// Explorer-style sidebar: machines are folders, their spaces hang under them,
// and each space's agents hang under it. Click to select, right-click for the
// space menu, chevron to fold, + to start a space on that machine.

import { View, div, svg, image } from "gpui-kit";
import { v_flex, h_flex } from "gpui-base";
import { spaces, agents, machines, run, openOverlay, setAgentOrder, setShared, shared, theme, props, terminals, layout, panes } from "herdr";

const ICON = "mods/my-chrome/";
const key = (m) => m ?? "";
function find(node, id) {
  if (node?.id === id) return node;
  for (const c of node?.children ?? []) { const f = find(c, id); if (f) return f; }
  return null;
}
// The rail goes by the sidebar's width, as in my-chrome: dragging its edge narrows it too.
const narrow = () => (find(layout(), "sidebar")?.size?.px ?? Infinity) < 160;

// A sub-agent without a pane isn't in agents(): its raw word, error counting as
// blocked; it never says "done" (its parent's done is the news).
const kidStatus = (k, listed) => {
  const s = listed.get(k.address) ?? k.status;
  return s === "error" ? "blocked" : s === "done" ? "idle" : s;
};
// Live sub-agents of `addr`, depth first, with their depth.
function kids(all, addr, depth = 1) {
  return all.filter((k) => k.parent === addr && k.state === "live")
    .flatMap((k) => [{ k, depth }, ...kids(all, k.address, depth + 1)]);
}

function mark(p, size, color) {
  if (!p?.icon) return null;
  return p.tint ? svg(p.icon).size(size).flex_none().text_color(color) : image(p.icon).w(size).h(size).flex_none();
}

export default class Tree extends View {
  init(_props, cx) {
    this.since = new Map();
    this.hover = null;
    this.pressed = null;
    cx.timer.every(30000, (cx) => cx.notify());
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem("tree.folded") ?? "[]"); } catch {}
    this.folded = new Set(saved);
  }

  toggle(id, cx) {
    this.folded.has(id) ? this.folded.delete(id) : this.folded.add(id);
    try { localStorage.setItem("tree.folded", JSON.stringify([...this.folded])); } catch {}
    cx.notify();
  }

  // How long an agent has been in its current status ("<1m", "5m", "2h").
  age(a) {
    const now = Date.now();
    const prev = this.since.get(a.address);
    if (!prev || prev.status !== a.status) this.since.set(a.address, { status: a.status, at: now });
    const m = Math.floor((now - this.since.get(a.address).at) / 60000);
    return m < 1 ? "<1m" : m < 60 ? `${m}m` : `${Math.floor(m / 60)}h`;
  }

  // Two lines like a notification: the name, then what it wants from you.
  card(t, a, name, { id, pl = 8, h = 44, onClick }) {
    const meta = {
      blocked: { label: "needs you", color: t.ansi1 },
      working: { label: "working", color: t.ansi3 },
      done: { label: "done", color: t.ansi2 },
      idle: { label: "idle", color: t.dim },
    }[a.status] ?? { label: a.status, color: t.dim };
    const mark_ = a.status === "blocked"
      ? div().size(18).flex_none().flex().items_center().justify_center().rounded(5).bg(t.ansi1 + "33").text_color(t.ansi1).text_size(11).font_semibold().child("!")
      : a.status === "working"
        ? svg("mods/workspace-chrome/spinner.svg").size(14).flex_none().text_color(t.ansi3).spin(900)
        : a.status === "done"
          ? div().size(8).flex_none().rounded_full().bg(t.ansi2)
          : div().size(8).flex_none().rounded_full().border(1).border_color(t.dim);
    return h_flex().id(id).h(h).pl(pl).pr(8).gap(8).items_center().rounded(6)
      .hover((el) => el.bg(t.hover)).cursor_pointer().on_click(onClick)
      .child(mark(a.program, 16, t.muted) ?? div().size(16).flex_none())
      .child(v_flex().flex_1().min_w(0).gap(1)
        .child(div().truncate().text_size(12.5).text_color(a.status === "idle" ? t.muted : t.foreground).child(name))
        .child(div().truncate().text_size(11).text_color(meta.color).child(meta.label)))
      .child(div().flex_none().text_size(11).text_color(t.dim).child(this.age(a)))
      .child(mark_);
  }

  dot(t, status, size = 7) {
    const c = { working: t.working, blocked: t.blocked, done: t.done, idle: t.idle }[status];
    if (status === "working")
      return svg("mods/workspace-chrome/spinner.svg").size(size + 4).flex_none().text_color(c).spin(900);
    return div().size(size).flex_none().rounded_full().when(Boolean(c), (el) => el.bg(c)).when(!c, (el) => el.border(1).border_color(t.dim));
  }

  machineRow(t, m, list) {
    const id = `m:${key(m.name)}`;
    const open = !this.folded.has(id);
    const up = m.layout === "ready";
    const state = m.layout === "unavailable" ? t.ansi1 : up ? t.ansi2 : t.dim;
    return h_flex().id(id).h(28).px(8).gap(6).items_center().rounded(6).mt(6)
      .text_color(t.muted).hover((s) => s.bg(t.hover)).cursor_pointer()
      .on_click((_e, cx) => this.toggle(id, cx))
      .child(svg(`${ICON}${open ? "chevron-down" : "chevron-right"}.svg`).size(12).flex_none().text_color(t.dim))
      .child(svg(`${ICON}${m.name ? "server" : "monitor"}.svg`).size(14).flex_none())
      .child(div().flex_1().truncate().font_medium().text_size(12.5).child(m.name ?? "This computer"))
      .child(div().size(6).flex_none().rounded_full().bg(state))
      .child(div().text_size(11).text_color(t.dim).child(String(list.length)))
      .child(div().id(`new:${id}`).size(20).flex_none().flex().items_center().justify_center().rounded(5)
        .text_color(t.dim).hover((s) => s.bg(t.raised).text_color(t.foreground))
        .on_click((_e, cx) => { cx.stop_propagation(); run("space.new", { machine: m.name ?? "" }); })
        .child(svg(`${ICON}plus.svg`).size(12)));
  }

  spaceRow(t, s, subs, idx) {
    const id = `s:${s.id}`;
    const lit = s.active;
    return v_flex()
      .child(h_flex().id(id).h(28).pl(16).pr(8).gap(6).items_center().rounded(6)
        .text_size(13).text_color(s.active ? t.foreground : t.muted)
        .when(lit, (el) => el.bg(t.selected))
        .hover((el) => el.bg(lit ? t.selected : t.hover)).cursor_pointer()
        .on_click(() => run("space.select", { id: s.id }))
        .on_mouse_down("right", () => openOverlay({ mod: "menu", kind: "popup", width: 200, height: 260, props: { tab: "space", target: { id: s.id } } }))
        .child(div().size(14).flex_none())
        .child(svg(`${ICON}folder.svg`).size(14).flex_none().text_color(s.active ? t.ansi3 : t.dim))
        .child(div().flex_1().truncate().child(s.name))
        .when(Boolean(s.branch) && s.branch !== "main", (el) => el.child(div().max_w(80).truncate().text_size(11).text_color(t.dim).child(s.branch)))
        .when(Boolean(s.status), (el) => el.child(this.dot(t, s.status))));
  }

  // A tab of a space, as it was in the bar above: name, agent status, close on hover.
  tabRow(t, sp, c) {
    const ps = panes();
    const program = ps.find((p) => p.tab === c.id && p.program?.agent)?.program ?? ps.find((p) => p.tab === c.id)?.program;
    const name = /^tb\d+$/.test(c.name) ? program?.name ?? "Terminal" : c.name;
    const hot = this.hover === c.id;
    return h_flex().id(`t:${c.id}`).h(26).pl(36).pr(8).gap(7).items_center().rounded(6).text_size(12.5)
      .text_color(c.active && sp.active ? t.foreground : hot ? t.foreground : t.dim)
      .when(c.active && sp.active, (el) => el.bg(t.selected)).hover((el) => el.bg(c.active && sp.active ? t.selected : t.hover)).cursor_pointer()
      .on_hover((over, cx) => { this.hover = over ? c.id : (this.hover === c.id ? null : this.hover); cx.notify(); })
      .on_click((e) => {
        run("space.select", { id: sp.id });
        run("tab.select", { id: c.id });
      })
      .on_mouse_down("left", (e) => { if (e.click_count === 2) run("tab.rename", { id: c.id }); })
      .on_mouse_down("right", () => openOverlay({ mod: "menu", kind: "popup", width: 200, props: { tab: "tab", target: { id: c.id, space: sp.id } } }))
      .child(mark(program, 13, t.dim) ?? div().size(13).flex_none())
      .child(div().flex_1().truncate().child(c.zoomed ? `${name} Z` : name))
      .when(c.status, (el) => el.child(this.dot(t, c.status, 6)))
      .when(hot, (el) => el.child(div().id(`x:${c.id}`).flex_none().text_color(t.dim).hover((x) => x.text_color(t.foreground))
        .on_mouse_down("left", (_e, cx) => cx.stop_propagation())
        .on_click((_e, cx) => { cx.stop_propagation(); openOverlay({ mod: "ask-close-tab", kind: "dialog", width: 1, height: 1, props: { tab: c.id } }); })
        .child(svg("mods/pane/close.svg").size(12))));
  }

  // The flat list, as before: every agent, in the order agent.next walks.
  agentsPanel(t) {
    const listed = agents();
    const all = terminals();
    const status = new Map(listed.map((a) => [a.address, a.status]));
    // A kept sub-agent (with a pane) is in agents() too: it shows under its parent only.
    const nested = new Set(listed.flatMap((a) => kids(all, a.address).map((x) => x.k.address)));
    const sort = shared("agents.sort") === "grouped" ? "grouped" : "priority";
    const RANK = { blocked: 4, done: 3, working: 2, idle: 1 };
    const sp = spaces();
    const names = Object.fromEntries(sp.map((s) => [s.id, s.name]));
    let ags = listed.filter((a) => !nested.has(a.address));
    if (sort === "priority") ags = ags.sort((a, b) => (RANK[b.status] ?? 0) - (RANK[a.status] ?? 0) || b.seq - a.seq);
    else ags = ags.sort((a, b) => sp.findIndex((s) => s.id === a.space) - sp.findIndex((s) => s.id === b.space) || b.seq - a.seq);
    setAgentOrder(ags.map((a) => a.address));
    const hot = ags.filter((a) => a.status === "blocked").length;
    const card = (a) => {
      const name = a.tab_name && a.tab_name !== String(a.tab_index) ? a.tab_name : a.program?.name || a.title || "agent";
      const main = this.card(t, a, name, { id: `al:${a.address}`, onClick: () => run("agent.focus", { terminal: a.address }) });
      const subs = kids(all, a.address).map(({ k, depth }) =>
        h_flex().id(`sl:${k.address}`).h(26).pr(8).pl(8 + depth * 16).gap(7).items_center().rounded(6).text_size(12)
          .text_color(t.muted).hover((el) => el.bg(t.hover).text_color(t.foreground)).cursor_pointer()
          .on_click(() => run("terminal.peek", { terminal: k.address }))
          .child(div().text_color(t.dim).text_size(11).child("└"))
          .child(mark(k.program, 13, t.dim) ?? div().size(13).flex_none())
          .child(div().flex_1().truncate().child(k.program?.name || k.name || "sub-agent"))
          .child(this.dot(t, kidStatus(k, status), 6)));
      return [main, ...subs];
    };
    let rows;
    if (sort === "grouped") {
      rows = [];
      let last = null;
      for (const a of ags) {
        if (a.space !== last) {
          last = a.space;
          rows.push(div().id(`ag:${a.space}`).px(8).pt(8).pb(2).text_size(11.5).font_medium().text_color(t.muted).truncate().child(names[a.space] ?? ""));
        }
        rows.push(...card(a));
      }
    } else rows = ags.flatMap(card);
    return v_flex().id("agents-panel").size_full().bg(t.chrome).border_t(1).border_color(t.border).px(8).pt(8).pb(8).overflow_y_scrollbar()
      .child(h_flex().h(24).px(8).gap(6).items_center().text_size(10.5).font_semibold().text_color(t.dim)
        .child(div().flex_1().child(`AGENTS · ${ags.length}`))
        .when(hot > 0, (el) => el.child(div().text_color(t.ansi1).child(`${hot} needs you`)))
        // The same button and popup as before: Sort agents > Priority / Grouped by space.
        .child(div().id("sort-agents").size(24).flex_none().flex().items_center().justify_center().rounded(6)
          .text_color(t.muted).hover((el) => el.bg(t.hover).text_color(t.foreground)).cursor_pointer()
          .on_click(() => openOverlay({ mod: "agents", kind: "popup", width: 200, height: 140, props: { sortMenu: true } }))
          .child(svg("mods/workspace-chrome/layers.svg").size(14))))
      .when(!ags.length, (el) => el.child(div().px(8).py(6).text_size(12).text_color(t.dim).child("No agents running")))
      .children(rows);
  }

  // The folded sidebar (44 px): one icon per space, or per agent with its status dot.
  rail(t) {
    const item = (id, tip, on, click, icon, status, space) =>
      div().id(id).size(32).flex_none().flex().items_center().justify_center().relative().rounded(7)
        .when(on, (el) => el.bg(t.selected)).hover((el) => el.bg(on ? t.selected : t.hover)).cursor_pointer()
        .on_click(click).child(icon)
        .tooltip(tip)
        .when(Boolean(status), (el) => el.child(div().absolute().right(4).top(4).child(this.dot(t, status, 6))));
    const items = props()?.part === "agents"
      ? agents().map((a) => item(`ra:${a.address}`, `${a.app ?? "agent"} · ${a.status}`, a.focused,
          () => run("agent.focus", { terminal: a.address }),
          mark(a.program, 15, t.muted) ?? svg(`${ICON}terminal.svg`).size(15).text_color(t.muted), a.status))
      : spaces().map((s) => {
          const tabs = (s.tabs ?? []).filter((c) => !c.settled).map((c) => (/^tb\d+$/.test(c.name) ? "Terminal" : c.name));
          const label = div().text_size(12).font_semibold().text_color(s.active ? t.foreground : t.muted)
            .child(s.name.replace(/[^\p{L}\p{N}]/gu, "").slice(0, 2).toUpperCase() || "?");
          return item(`rs:${s.id}`, [s.name, ...tabs.map((n) => `· ${n}`)].join("\n"), s.active,
            () => run("space.select", { id: s.id }), label, s.status, s);
        });
    return v_flex().id("rail").size_full().bg(t.chrome).items_center().pt(6).gap(2).overflow_y_scrollbar().children(items);
  }

  render() {
    const t = theme();
    if (narrow()) return this.rail(t);
    if (props()?.part === "agents") return this.agentsPanel(t);
    const all = spaces();
    const listed = agents();
    const all_t = terminals();
    // Sub-agents never show in the tree, not even a kept one that has a pane.
    const nested = new Set(listed.flatMap((a) => kids(all_t, a.address).map((x) => x.k.address)));
    const ags = listed.filter((a) => !nested.has(a.address));
    const ms = machines().filter((m) => !m.temporary);
    const order = [];
    const groups = ms.map((m) => {
      const list = all.filter((s) => (s.machine ?? null) === (m.name ?? null));
      const open = !this.folded.has(`m:${key(m.name)}`);
      const rows = open ? list.map((s) => {
        const subs = (s.tabs ?? []).filter((c) => !c.settled);
        if (!this.folded.has(`s:${s.id}`)) subs.forEach((a) => order.push(a.address));
        return this.spaceRow(t, s, subs, all.indexOf(s));
      }) : [];
      return v_flex().child(this.machineRow(t, m, list)).children(rows);
    });
    return v_flex().id("tree").size_full().bg(t.chrome).px(8).pt(2).pb(8).overflow_y_scrollbar().children(groups);
  }
}
