// What the quiet mod draws: the board (quiet hours), the chip (work hours, at
// the bottom of the sidebar) and the chip's "quiet now" menu. Pure functions
// of what they're given; main.js owns state and actions. The settings dialog
// is settings.js.
//
// The board's rule: at night nothing on screen may read as a message or a
// call to action. Dim surfaces, no status colours, one slow pulse.

import { div, svg } from "gpui-kit";
import { h_flex, v_flex } from "gpui-base";
import { rowName } from "./names.mjs";

// The sidebar's dot grid, tiled over the whole board (512px tiles keep the grid continuous).
function dotField(t) {
  const tiles = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++)
    tiles.push(svg("mods/quiet-hours/dots-tile.svg").absolute().top(r * 512).left(c * 512).w(512).h(512).text_color(t.foreground + "1c"));
  return div().absolute().top(0).left(0).size_full().overflow_hidden().children(tiles);
}

// A tone between foreground and muted (#c9c9c9 in the curfew theme); the theme has no name for it.
// The tone of a head's label.
function secondary(t) {
  const ch = (c, i) => parseInt(c.slice(1 + 2 * i, 3 + 2 * i), 16);
  return "#" + [0, 1, 2].map((i) => Math.round(ch(t.foreground, i) * 0.55 + ch(t.muted, i) * 0.45).toString(16).padStart(2, "0")).join("");
}

// herdr's statuses as the board words them; blocked is "waiting", neutral.
const WORD = { working: "working", blocked: "waiting", done: "done", idle: "idle" };
const ORDER = ["working", "waiting", "done", "idle"];
const DAY = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const pad = (n) => String(n).padStart(2, "0");
export const hm = (ms) => {
  const d = new Date(ms);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();

// "2 working · 1 waiting · 3 done"; zero counts left out.
export function countLine(list) {
  const n = Object.fromEntries(ORDER.map((w) => [w, 0]));
  for (const a of list) n[WORD[a.status] ?? "idle"]++;
  const parts = ORDER.filter((w) => n[w]).map((w) => `${n[w]} ${w}`);
  return parts.length ? parts.join(" · ") : "nothing running";
}

// The morning's one line: the agents now, then the night's unlocks, bypasses
// and new hours applied tonight (the settings' "Yes, tonight").
export function summaryLine(list, s) {
  const parts = [countLine(list)];
  if (s.unlocks) parts.push(`unlocked ${s.unlocks}× (${s.unlockMinutes} min)`);
  if (s.bypasses) parts.push(`${s.bypasses} ${s.bypasses === 1 ? "bypass" : "bypasses"}`);
  if (s.appliedTonight) parts.push(`applied tonight ${s.appliedTonight > 1 ? `${s.appliedTonight}×, last ` : ""}at ${hm(s.appliedAt)}`);
  return parts.join(" · ");
}

export const unlockedNow = (state, now) => Boolean(state?.quiet && state.unlock && state.unlock.until > now);
const minutesLeft = (state, now) => Math.max(1, Math.ceil((state.unlock.until - now) / 60_000));

// ---- the board ---------------------------------------------------------------

export function board({ t, mono, state, now, agents, sort, onSort, error, onUnlock, onEnd }) {
  const quiet = Boolean(state?.quiet);
  const unlocked = unlockedNow(state, now);
  // A quiet now (a meeting) can be ended; the scheduled night can't.
  const manual = state?.kind === "manual";
  const clock = !state
    ? hm(now)
    : quiet
      ? state.kind === "manual"
        ? `until ${hm(state.windowEnd)}`
        : `until ${hm(state.windowEnd)} · ${hm(now)}`
      : state.nextStart
        ? `next ${hm(state.nextStart)} · ${hm(now)}`
        : hm(now);
  const faint = (text) => div().font_family(mono).text_size(14).text_color(t.dim).child(text);

  // An agent: its dot, its name (names.mjs: its Claude Code session's, else its tab's or
  // program's), its project faint (main.js: the git repository it works in), its status.
  const row = (a) => {
    const working = a.status === "working";
    return h_flex()
      .id(`quiet-row-${a.address}`)
      .h(32)
      .flex_none()
      .gap(10)
      .items_center()
      .when(a.kid, (el) => el.pl(14 * (a.depth ?? 1)))
      .child(
        working
          ? div().w(10).flex_none().font_family(mono).text_size(15).text_color(t.muted)
              .frames(["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"], 90)
          : div().w(10).flex_none().flex().items_center().child(div().size(6).rounded_full().bg(t.dim)),
      )
      .child(div().flex_none().max_w(300).truncate().text_size(15).text_color(t.muted).child(a.label ?? rowName(a)))
      .child(div().flex_1().min_w(0).truncate().text_size(14.5).text_color(t.dim).child(a.project ?? ""))
      .child(div().flex_none().font_family(mono).text_size(13.5).text_color(t.dim).child(WORD[a.status] ?? a.status));
  };

  const ghost = (id, text, action) =>
    div()
      .id(id)
      .h(34)
      .px(14)
      .flex()
      .items_center()
      .rounded(6)
      .border(1)
      .border_color(t.border)
      .text_size(14.5)
      .text_color(t.muted)
      .cursor_pointer()
      .hover((s) => s.border_color(t.input))
      .on_mouse_down("left", (_e, cx) => cx.stop_propagation())
      .on_click(action)
      .child(text);

  return v_flex()
    .id("quiet-board")
    .size_full()
    .relative()
    .bg(t.chrome)
    .child(dotField(t))
    .pt(56)
    .pb(28)
    .px(40)
    .child(
      v_flex()
        .w_full()
        .max_w(640)
        .mx_auto()
        .flex_1()
        .min_h(0)
        .gap(18)
        .child(
          h_flex()
            .flex_none()
            .justify_between()
            .items_center()
            .child(div().font_family(mono).text_size(14).text_color(secondary(t)).child("QUIET"))
            .child(faint(clock)),
        )
        .child(
          h_flex().flex_none().items_center().justify_between()
            .child(faint(countLine(agents.filter((a) => !a.kid))))
            .when(Boolean(onSort), (el) => el.child(
              div().id("quiet-sort").flex_none().h(24).px(8).flex().items_center().gap(6).rounded(6).cursor_pointer()
                .text_size(13.5).text_color(t.dim).hover((s) => s.bg(t.hover).text_color(t.muted))
                .tooltip("Sort agents").on_mouse_down("left", (_e, cx) => cx.stop_propagation()).on_click(onSort)
                .child(svg(`mods/workspace-chrome/${sort === "grouped" ? "layers" : "clock"}.svg`).size(13))
                .child(sort === "grouped" ? "By space" : "Priority"))),
        )
        .child(v_flex().id("quiet-rows").flex_1().min_h(0).overflow_y_scroll().children(
          agents.flatMap((a, i) => {
            const head = a.group && a.group !== agents[i - 1]?.group
              ? [div().flex_none().h(26).mt(i ? 8 : 0).flex().items_end().font_family(mono).text_size(13).text_color(t.dim).child(a.group.toUpperCase())]
              : [];
            return [...head, row(a)];
          })))
        .child(
          h_flex()
            .flex_none()
            .justify_center()
            .gap(10)
            .when(quiet && !unlocked, (el) => el.child(ghost("quiet-unlock", `unlock ${state?.unlockMinutes ?? 10} min`, onUnlock)))
            .when(quiet && !unlocked && manual, (el) => el.child(ghost("quiet-end", "end quiet", onEnd)))
            .when(unlocked, (el) => el.child(faint(`unlocked · ${minutesLeft(state, now)}m left`))),
        )
        .when(Boolean(error), (el) => el.child(div().flex_none().truncate().text_size(13.5).text_color(t.dim).child(error))),
    );
}

// ---- the chip ----------------------------------------------------------------
//
// que's foot row. Outside a quiet window: "Quiet" (an hour) and the lengths
// 30m 1h 2h right after it, the group taking the hover as a whole; at the
// right end, faint, when the next window starts (it opens the settings).
// While unlocked: the accent lock, the countdown ticking each second, and
// "lock now" (and "end quiet" for a quiet now) faint at the right.

export const QUIET_LENGTHS = [
  [30, "30m", "Quiet for 30 minutes"],
  [60, "1h", "Quiet for 1 hour"],
  [120, "2h", "Quiet for 2 hours"],
];

// When the next window starts: "18:00" today, "mon 18:00" on another day.
function nextLabel(state, now) {
  if (!state) return "";
  if (state.quiet) return `until ${hm(state.windowEnd)}`;
  if (!state.nextStart) return "off";
  return sameDay(state.nextStart, now) ? hm(state.nextStart) : `${DAY[new Date(state.nextStart).getDay()]} ${hm(state.nextStart)}`;
}

export function chip({ t, mono, state, now, error, hover, collapsed, countdown, onHover, onQuiet, onQuietNow, onLock, onEnd, onSettings }) {
  const unlocked = unlockedNow(state, now);
  const next = nextLabel(state, now);
  const small = (el) => el.font_family(mono).text_size(11);
  // A faint word that brightens under the pointer, no surface (que's "lock now").
  const faintLink = (id, text, action) =>
    small(div().id(id).flex_none().cursor_pointer().text_color(t.dim).hover((s) => s.text_color(t.muted)).on_click(action).child(text));

  const row = h_flex().id("quiet-chip").h(26).items_center();
  // The settings: the next start (or the error), faint, at the right end.
  const opener = (words, tip) =>
    h_flex()
      .id("quiet-settings")
      .flex_none()
      .min_w(0)
      .h(26)
      .px(6)
      .gap(6)
      .items_center()
      .rounded(4)
      .cursor_pointer()
      .text_color(error ? t.muted : t.dim)
      .hover((s) => s.text_color(t.muted))
      .tooltip(error ?? tip)
      .on_click(onSettings)
      .child(svg("mods/workspace-chrome/clock.svg").size(12).flex_none())
      .child(small(div().truncate()).child(words));

  let body;
  if (collapsed) {
    body = row
      .w(32)
      .justify_center()
      .rounded(4)
      .cursor_pointer()
      .hover((s) => s.bg(t.hover))
      .tooltip(error ?? (unlocked ? `${countdown} left · click to lock` : `quiet ${next} · click for quiet now`))
      .on_click(unlocked ? onLock : onQuietNow)
      .child(svg(unlocked ? "mods/quiet-hours/unlock.svg" : "mods/workspace-chrome/clock.svg").size(12).flex_none().text_color(unlocked ? t.accent : t.dim));
  } else if (unlocked) {
    body = row
      .px(8)
      .gap(6)
      .child(
        h_flex()
          .id("quiet-unlock")
          .flex_1()
          .min_w(0)
          .gap(6)
          .items_center()
          .cursor_pointer()
          .text_color(t.accent)
          .tooltip(error ?? "unlocked")
          .child(svg("mods/quiet-hours/unlock.svg").size(12).flex_none())
          .child(small(div().flex_none()).child(`${countdown} left`))
          ,
      )
      .child(faintLink("quiet-lock", "lock now", onLock))
      .when(state?.kind === "manual", (el) => el.child(faintLink("quiet-end", "end quiet", onEnd)));
  } else if (state?.quiet) {
    // Quiet and locked: the board is up; this shows only until it switches.
    body = row.child(div().flex_1());
  } else {
    // One quiet button: the menu asks for how long.
    body = row
      .id("quiet-open")
      .px(8)
      .gap(8)
      .rounded(6)
      .cursor_pointer()
      .text_size(12.5)
      .text_color(t.dim)
      .hover((s) => s.bg(t.hover).text_color(t.foreground))
      .tooltip(error ?? "Quiet mode")
      .on_click(onQuietNow)
      .child(svg("mods/workspace-chrome/clock.svg").size(13).flex_none())
      .child(div().flex_1().child("Quiet mode"))
      .when(Boolean(error), (el) => el.child(small(div().truncate()).child(error)));
  }

  return v_flex()
    .size_full()
    .bg(t.chrome)
    .px(6)
    .pb(8)
    .justify_end()
    .text_size(13)
    .when(collapsed, (el) => el.px(0).items_center())
    .child(body);
}

// ---- the chip's menu ---------------------------------------------------------

export const QUIET_FOR = [
  [15, "15 min"],
  [30, "30 min"],
  [60, "1 hour"],
  [120, "2 hours"],
  [240, "4 hours"],
];

export function menu({ t, onPick }) {
  return v_flex()
    .w_full()
    .p(5)
    .bg(t.popover)
    .text_size(12.8)
    .child(div().px(8).pt(4).pb(6).text_size(11).text_color(t.dim).child("Quiet mode for"))
    .children(
      QUIET_FOR.map(([minutes, label]) =>
        h_flex()
          .id(`quiet-for-${minutes}`)
          .h(31)
          .px(8)
          .rounded(7)
          .items_center()
          .text_color(t.foreground)
          .cursor_pointer()
          .hover((el) => el.bg(t.hover))
          .on_click((_e, cx) => onPick(minutes, cx))
          .child(label),
      ),
    );
}
