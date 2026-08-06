---
name: muller-brockmann-grid-systems
description: Build editorial/magazine/report webpages on a GENUINE Müller-Brockmann modular grid (International Typographic Style) — not a decorative one. Encodes the discipline (columns + modules + baseline, grotesque type, flush-left, restrained palette) AND the front-end engineering to make the grid real, visible, and verified: one CSS-variable source of truth, an interactive grid-toggle overlay that lives in the SAME content box as the content, subgrid "bands" so every element snaps to a column line, an 8px baseline lock, and runtime OPTICAL ALIGNMENT that puts display type's ink (not its box) on the line. Use when building any editorial/magazine/longform page that must read as rigorously grid-aligned or "Swiss".
---

# Müller-Brockmann Grid Systems — built real, visible, and verified

Josef Müller-Brockmann (1914–1996), Zurich; *Grid Systems in Graphic Design* (1981) is the corpus. The grid is treated as an ethic, not decoration: **"The grid system is an aid, not a guarantee. It permits a number of possible uses and each designer can look for a solution appropriate to his personal style. But one must learn how to use the grid; it is an art that requires practice."**

> Two review notes this skill exists to prevent:
> 1. *"the grid is just slapped on top and misaligned"* → the overlay wasn't in the same content box as the content (see §2.2).
> 2. *"the H in the headline is off the grid"* → the headline's BOX was on the grid but its INK wasn't; large glyphs carry a side-bearing (see §2.6). **Box-on-grid ≠ ink-on-grid.**

## ENVIRONMENT NOTE (Claude Code adaptation)

This skill was authored for another agent platform. The following references in
the original do **not** exist here and must be ignored / substituted:

- `SearchImages`, `PublishFilePublicly`, `PublishWebpage`, `pub.hyperagent.com`
  → use local image assets and the normal preview/deploy flow of the project.
- `verify_grid.js` needs Puppeteer + a Chrome binary (env `CHROME`, `PUP`). If
  those are unavailable, run the **same four checks** through the browser-pane
  tools (`javascript_tool`) against the local preview server — the assertions
  are what matter, not the harness.

---

## PART 1 — THE DISCIPLINE (decide before drawing)
- **Objective order.** The grid brings "constructive thought," legibility, and "objective and functional" design. Restraint is the point; the system, not the ego, organizes the page.
- **Modular grid.** Divide the type area into a field of **modules** — columns AND rows — separated by consistent **gutters**, inside defined **margins**. Text and images occupy whole modules. Common field counts (8 / 20 / 32). For the web, a **12-column grid + 8px baseline** is a robust default; a **6×6 or 4×8 modular field grid** when you want visible rows too.
- **Baseline grid.** Vertical rhythm is sacred: **leading = a whole multiple of the baseline unit**, and every element snaps to it.
- **Typography.** A **grotesque sans** (Akzidenz-Grotesk / Helvetica; on the web Inter, Helvetica Now, Archivo, Satoshi). **Flush-left, ragged-right.** Few sizes, large jumps in **scale** for hierarchy; objective, not expressive. Big **numerals/data set large** is a signature move.
- **Palette.** Pure white paper, near-black ink, **one accent — red is canonical** (substitute the project's brand accent when one exists). Avoid the warm-cream look; **never blue/purple gradients**.
- **White space + asymmetry.** Generous margins; asymmetric compositions held in tension by the grid.

---

## PART 2 — MAKE THE GRID REAL ON THE WEB (the load-bearing engineering)
`scripts/grid_tokens.py` emits this whole scaffold correctly; the rules below are why it's built the way it is.

### 2.1 One source of truth
Put every grid parameter in `:root` CSS variables — `--cols, --gutter, --margin, --bl (baseline), --lh (leading=3×bl), --maxw`. **Content and the overlay both read these same variables.** Never hand-author the overlay separately or it will drift.

### 2.2 The overlay MUST live in the SAME content box as the content ← #1 bug
Failure mode: content sits in a centered `max-width` container while the overlay is a **full-width sibling** of the section. On any viewport wider than `--maxw`, the centered content and the full-width overlay no longer share column positions → "slapped on top / misaligned."
**Fix:** put `.guides` *inside* the same `.wrap`, and draw the column guides with `left/right = var(--margin)` and the **same** `repeat(var(--cols),1fr)` + `column-gap:var(--gutter)`. Add left/right margin lines at `var(--margin)`.

### 2.3 Place every element by column LINE via subgrid bands
```css
.band{grid-column:1 / -1; display:grid; grid-template-columns:subgrid; column-gap:var(--gutter); align-items:start;}
@supports not (grid-template-columns:subgrid){ .band{grid-template-columns:repeat(var(--cols),1fr);} }
```
Children place with `grid-column: <startline> / <endline>` (e.g. `1 / 6`, `6 / 13`).

### 2.4 Lock vertical rhythm to the baseline
- Leading = `--lh` (e.g. 24px = 3×8). **Every line-height a multiple of the baseline, in px (not unitless) for display type.**
- Every margin/padding a multiple of the baseline.
- **Media heights = multiples of the leading** (e.g. 240/360/432/480px).
- Hairline rules sit inside a baseline-height band, not free-floating.

### 2.5 The toggle
A control (button **+ `G` key**) toggles `body.grid-on`; overlay fades 0→1. Overlay draws translucent **numbered column fields**, the **baseline** (major line every `--lh`, faint minor every `--bl`), and **margin lines**. Showing the real grid the page is built on IS the demo.

### 2.6 OPTICAL ALIGNMENT — display ink, not its box ← the subtle bug
A large headline whose layout box is exactly on line 1 still looks misaligned, because the letterform's **ink** is inset by its **left side-bearing**. Cure at runtime:
```js
var cvs=document.createElement('canvas'),ctx=cvs.getContext('2d');
document.querySelectorAll('.masthead,.numeral,.shead h2,.h2b').forEach(function(el){
  el.style.marginLeft='0px';
  var cs=getComputedStyle(el),ch=(el.textContent||'').trim()[0]; if(!ch) return;
  if(cs.textTransform==='uppercase') ch=ch.toUpperCase();
  ctx.font=cs.fontStyle+' '+cs.fontWeight+' '+cs.fontSize+' '+cs.fontFamily; ctx.textAlign='left';
  var abl=ctx.measureText(ch).actualBoundingBoxLeft;
  if(isFinite(abl)) el.style.marginLeft=abl.toFixed(2)+'px';
});
```
Run after `document.fonts.ready` and on resize.
**CRITICAL caveat:** side-bearing is **font-specific**. Measuring with the wrong font gives the wrong nudge. Headless Chrome often lacks the webfont and falls back to another grotesque. In production the runtime JS measures the loaded font and is correct.

---

## PART 3 — VERIFY (don't trust, measure)
Assert at **several widths including > and < `--maxw`** (e.g. 1440 / 1180 / 900):
1. **Column adherence** — every placed `.band > *` left snaps to a column START and right to a column END (~0px). **Exclude the optically-aligned display elements.** Build BOTH the column-start set and the column-end set — an item spanning "to line N" ends at the *far* side of the gutter.
2. **Overlay match** — each `.guides .col` rect equals the computed column rect (~0px).
3. **Baseline** — text tops modulo the baseline ≈ 0 (tolerance ≈ half a baseline).
4. **Optical ink** — each display element's ink-left (box − `actualBoundingBoxLeft`) equals **its own** column line, not always line 1.

A clean run looks like: `col=0px overlay=0px baseline≤4px ink=0px` → **PASS**.

---

## PART 4 — CRAFT DEFAULTS
- **Palette:** white, near-black ink, one accent. No warm-cream; no blue/purple gradients.
- **Type:** a real grotesque webfont for display + body; a **mono** (Space Mono / IBM Plex Mono) for folios, captions, grid annotations.
- **Hierarchy** through scale + weight + white space, not color. Key data as **large numerals**. Kicker labels in mono caps. Per-spread folios.
- **Spread model:** full-width sections, each its own per-spread `.grid` + `.guides`, consistent margins/folios.

---

## PART 5 — WORKFLOW
1. Pick the subject; gather images.
2. Generate the scaffold: `python3 scripts/grid_tokens.py --scaffold` (`--cols/--baseline/--gutter/--margin/--maxw/--accent`).
3. Build spreads as **subgrid bands**; place everything by **column line**; lock spacing/line-heights/media heights to the **baseline**.
4. Add the overlay (same content box) + toggle + optical-alignment JS; point its selector list at your display elements.
5. Verify the four checks at several widths. Eyeball a top-left zoom crop. Fix.

## CREED
A grid you can't toggle on and measure is a mood board, not a system. Build it from one source of truth, prove it at 0px, and align the **ink**.
