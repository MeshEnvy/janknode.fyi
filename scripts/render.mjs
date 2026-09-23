/**
 * Build-time HTML renderers for janknode.fyi catalog tables and hero.
 */

export function escapeHtml(value) {
  if (value == null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const attr = escapeHtml;

const BUY_BTN_BASE = "btn btn-sm buy-btn w-100";

const storeIconHtml = (href, store) => {
  if (/amazon\./i.test(href)) {
    return '<i class="fa-brands fa-amazon fa-fw" aria-hidden="true"></i>';
  }
  if (/rokland\./i.test(href) || store === "Rokland") {
    return '<img class="buy-store-icon" src="assets/rokland-favicon.png" alt="" aria-hidden="true" />';
  }
  return '<i class="fa-solid fa-bag-shopping fa-fw" aria-hidden="true"></i>';
};

const money = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const dash = '<span class="empty">—</span>';

const winnerBadgeHtml = () =>
  `<span class="card-winner-badge"><span class="card-winner-badge__icon" aria-hidden="true">👑</span> Winner</span>`;

const labeledTd = (label, content, className = "") =>
  `<td class="${className}" data-label="${attr(label)}">${content}</td>`;

const buyButtonLabel = (item) => {
  const qty = item.pack_qty;
  const price = item.pack_price_usd;
  if (price == null) return null;
  if (qty == null || qty <= 1) return `Buy ${money(price)}`;
  return `Buy ${qty}-pack ${money(price)}`;
};

const buyLinkHtml = (item, { priced = true } = {}) => {
  const href = item.buy_url || item.amazon;
  if (!href) return null;

  const packLabel = buyButtonLabel(item);
  const store = item.vendor || "Amazon";
  const icon = storeIconHtml(href, store);

  if (packLabel == null) {
    return `<a class="${BUY_BTN_BASE} btn-outline-secondary" href="${attr(href)}" target="_blank" rel="noopener noreferrer" title="View on ${attr(store)} (not available)"><span class="buy-btn__icon">${icon}</span><span class="buy-btn__label">${escapeHtml("Not available")}</span></a>`;
  }

  const buttonText = priced ? packLabel : "Buy";
  const title = priced ? `Buy on ${store}` : `Buy on ${store} · ${packLabel}`;
  return `<a class="${BUY_BTN_BASE} btn-dark" href="${attr(href)}" target="_blank" rel="noopener noreferrer" title="${attr(title)}"><span class="buy-btn__icon">${icon}</span><span class="buy-btn__label">${escapeHtml(buttonText)}</span></a>`;
};

const buyCell = (item, { priced = true } = {}) => {
  const link = buyLinkHtml(item, { priced });
  if (!link) return labeledTd("Buy", dash, "col-buy");
  return labeledTd("Buy", link, "col-buy");
};

const itemCell = ({ primary, secondary, badgeHtml = "" }) =>
  `<td class="col-item" data-label="">
            <div class="item-title">${primary}${badgeHtml}</div>
            ${secondary ? `<div class="item-sub">${escapeHtml(secondary)}</div>` : ""}
          </td>`;

const gearThumb = (g) =>
  g.profile
    ? `<img class="thumb" src="${attr(g.profile)}" alt="${attr(g.brand)}" />`
    : `<div class="thumb thumb-empty" aria-hidden="true">no shot</div>`;

const youtubeVideoId = (url) => {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("/")[0] || null;
    if (u.searchParams.has("v")) return u.searchParams.get("v");
    const embed = u.pathname.match(/\/embed\/([^/?]+)/);
    if (embed) return embed[1];
  } catch {
    return null;
  }
  return null;
};

const productVideoUrl = (item) => item.youtube_review || item.youtube_assembly;

const productVideoLabel = (item) =>
  item.youtube_review ? "review" : "build video";

const productVideoThumbSrc = (item) => {
  if (item.youtube_thumb) return item.youtube_thumb;
  const videoId = youtubeVideoId(productVideoUrl(item));
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
};

const productVideoThumbHtml = (item) => {
  const videoUrl = productVideoUrl(item);
  if (!videoUrl) return null;
  const thumbSrc = productVideoThumbSrc(item);
  if (!thumbSrc) return null;
  const label = productVideoLabel(item);
  const brand = item.brand || item.title || "product";
  return `<a class="shell-video-thumb" href="${attr(videoUrl)}" target="_blank" rel="noopener noreferrer" title="Watch ${label}" aria-label="Watch ${attr(brand)} ${label}"><img class="shell-video-thumb__img" src="${attr(thumbSrc)}" alt="" loading="lazy" onerror="this.closest('.shell-video-thumb').classList.add('shell-video-thumb--no-img')" /><span class="shell-video-thumb__play" aria-hidden="true">▶</span></a>`;
};

const shellThumbCell = (l) => {
  const videoHtml = productVideoThumbHtml(l);
  if (videoHtml) {
    return `<td class="col-thumb col-thumb--video" data-label="">${videoHtml}</td>`;
  }
  return `<td class="col-thumb" data-label=""><img class="thumb" src="${attr(l.profile)}" alt="${attr(l.brand)}" /></td>`;
};

const bomThumbCell = (item) => {
  const badge = winnerBadgeHtml();
  const videoHtml = productVideoThumbHtml(item);
  if (videoHtml) {
    return `<td class="col-thumb col-thumb--video" data-label="">${badge}${videoHtml}</td>`;
  }
  return labeledTd("", `${badge}${gearThumb(item)}`, "col-thumb");
};

const sortKingFirst = (arr) =>
  [...arr].sort((a, b) => Number(!!b.king) - Number(!!a.king));

const nodeBomCost = (item) => {
  if (item.node_cost_usd != null) return item.node_cost_usd;
  if (item.unit_price_usd != null) return item.unit_price_usd;
  if (item.pack_price_usd != null && item.pack_qty === 1) {
    return item.pack_price_usd;
  }
  return 0;
};

const packBomCost = (item) =>
  item.pack_price_usd != null ? item.pack_price_usd : null;

const formatVswrShots = (shots) => {
  if (!shots?.length) return "";
  return `<div class="vna-shots">${shots
    .map(
      (s) =>
        `<button type="button" class="vna-shot" data-vna-src="${attr(s.src)}" data-vna-label="${attr(s.label)}" aria-label="View ${attr(s.label)} sweep">
                <img src="${attr(s.src)}" alt="${attr(s.alt || s.label)}" loading="lazy" />
                <span>${escapeHtml(s.label)}</span>
              </button>`,
    )
    .join("")}</div>`;
};

const chemistryLabel = (chemistry) => {
  if (chemistry == null) return null;
  const key = String(chemistry).toLowerCase();
  const labels = {
    "1s-li-ion": "Li-ion",
    "1.2v-nimh": "NiMH",
    nimh: "NiMH",
    "li-ion": "Li-ion",
  };
  return labels[key] || chemistry;
};

const formatCellCell = (l) =>
  labeledTd("Cell", l.cell ? escapeHtml(String(l.cell)) : dash, "col-cell");

const formatChemistryCell = (l) => {
  const label = chemistryLabel(l.chemistry);
  return labeledTd(
    "Chemistry",
    label ? escapeHtml(label) : dash,
    "col-chemistry",
  );
};

const formatNominalVCell = (l) => {
  const value =
    l.nominal_v != null
      ? `<span class="num">${escapeHtml(String(l.nominal_v))}</span>`
      : dash;
  return labeledTd("V", value, "col-v num");
};

const formatMahCell = (item) => {
  const value =
    item.mah_label != null
      ? `<span class="num">${escapeHtml(item.mah_label.toLocaleString())}</span>`
      : dash;
  return labeledTd("mAh", value, "col-mah num");
};

const formatTopCell = (b) =>
  labeledTd(
    "Top",
    b.top ? escapeHtml(String(b.top)) : dash,
    "col-top",
  );

const formatProtectedCell = (b) => {
  if (b.protected == null) return labeledTd("Protected", dash, "col-protected");
  const label = b.protected ? "Yes" : "No";
  return labeledTd("Protected", escapeHtml(label), "col-protected");
};

const formatRuntimeDaysCell = (b, dailyMah) => {
  if (b.mah_label == null || dailyMah == null || dailyMah <= 0) {
    return labeledTd("Days", dash, "col-days num");
  }
  const days = b.mah_label / dailyMah;
  const formatted =
    days >= 10 ? String(Math.round(days)) : days.toFixed(1).replace(/\.0$/, "");
  return labeledTd(
    "Days",
    `<span class="num">${escapeHtml(formatted)}</span>`,
    "col-days num",
  );
};

const formatUnitCostCell = (item) => {
  const value =
    item.unit_price_usd != null
      ? `<span class="num">${escapeHtml(money(item.unit_price_usd))}</span>`
      : dash;
  return labeledTd("$/unit", value, "col-unit num");
};

const formatGainCell = (a) => {
  const value =
    a.gain_dbi != null
      ? `<span class="gain-listed">${escapeHtml(String(a.gain_dbi))} dBi</span>`
      : dash;
  return labeledTd("Gain", value, "col-gain num");
};

const formatVswrCell = (a) => {
  const value =
    a.vswr_min != null && a.vswr_min_mhz != null
      ? `<span class="vswr-measured">${a.vswr_min.toFixed(2)} @ ${a.vswr_min_mhz}</span>`
      : dash;
  const plots = formatVswrShots(a.vswr_shots);
  return `<td class="col-vswr vswr-cell" data-label="915 MHz VSWR">${value}${plots}</td>`;
};

const gearRow = (
  g,
  extraClass = "",
  extraCells = "",
  { priced = true, showBrand = true, unitCost = false } = {},
) => {
  const opt = g.optional ? ' <span class="badge optional">optional</span>' : "";
  return `<tr class="${extraClass}">
          ${labeledTd("", gearThumb(g), "col-thumb")}
          ${itemCell({
            primary: `${escapeHtml(g.title)}${opt}`,
            secondary: showBrand ? g.brand : null,
          })}
          ${extraCells}
          ${labeledTd("Notes", g.note ? escapeHtml(g.note) : dash, "col-notes")}
          ${unitCost ? formatUnitCostCell(g) : ""}
          ${buyCell(g, { priced })}
        </tr>`;
};

const batteryRow = (b, dailyMah) => {
  const kingBadge = b.king ? winnerBadgeHtml() : "";
  return `<tr>
          ${labeledTd("", gearThumb(b), "col-thumb")}
          ${itemCell({
            primary: `${escapeHtml(b.title)}${kingBadge}`,
            secondary: b.brand,
          })}
          ${formatCellCell(b)}
          ${formatChemistryCell(b)}
          ${formatNominalVCell(b)}
          ${formatMahCell(b)}
          ${formatTopCell(b)}
          ${formatProtectedCell(b)}
          ${formatRuntimeDaysCell(b, dailyMah)}
          ${formatUnitCostCell(b)}
          ${buyCell(b)}
        </tr>`;
};

const FAIL_REASON_LABELS = {
  sealed: "sealed",
  nimh: "NiMH",
  underpowered: "underpowered",
  alkaline: "alkaline",
};

const formatWorksBadge = (l) => {
  const works = l.works || "unknown";
  if (works === "fail") {
    const reason = l.fail_reason || "fail";
    const label = FAIL_REASON_LABELS[reason] || reason;
    return `<span class="badge fail">${escapeHtml(label)}</span>`;
  }
  const worksClass = /^[\w-]+$/.test(works) ? works : "unknown";
  return `<span class="badge ${worksClass}">${escapeHtml(works)}</span>`;
};

const shellRow = (l) => {
  return `<tr>
          ${shellThumbCell(l)}
          ${itemCell({
            primary: escapeHtml(l.brand),
            secondary: l.form || null,
          })}
          ${labeledTd("Works?", formatWorksBadge(l), "col-works")}
          ${formatCellCell(l)}
          ${formatChemistryCell(l)}
          ${formatNominalVCell(l)}
          ${formatMahCell(l)}
          ${formatUnitCostCell(l)}
          ${buyCell(l)}
        </tr>`;
};

const isPassingShell = (l) => l.works === "pass" || l.works === "likely";

const partitionShells = (lights) => {
  const passing = [];
  const evaluation = [];
  const failed = [];
  for (const l of lights) {
    if (l.works === "fail") failed.push(l);
    else if (isPassingShell(l)) passing.push(l);
    else evaluation.push(l);
  }
  return { passing, evaluation, failed };
};

const shellTableHead = `<thead>
              <tr>
                <th></th>
                <th>Shell</th>
                <th>Works?</th>
                <th>Cell</th>
                <th>Chemistry</th>
                <th class="num">V</th>
                <th class="num">mAh</th>
                <th class="num">$/unit</th>
                <th class="col-buy">Buy</th>
              </tr>
            </thead>`;

const shellEmptyRow =
  '<tr><td colspan="9" class="shell-empty" data-label="">None yet.</td></tr>';

const renderShellTableBlock = (title, hint, shells, modifier = "") => {
  const rows = sortKingFirst(shells).map(shellRow).join("");
  const modClass = modifier ? ` shell-table-block--${modifier}` : "";
  return `<div class="shell-table-block${modClass}">
          <h3 class="shell-table-block__title">${escapeHtml(title)}</h3>
          <p class="gear-hint gear-block shell-table-block__hint">${escapeHtml(hint)}</p>
          <div class="scroll catalog-scroll">
            <table class="catalog-table">
              ${shellTableHead}
              <tbody>${shells.length ? rows : shellEmptyRow}</tbody>
            </table>
          </div>
        </div>`;
};

const renderFailedShellSection = (failed) => {
  if (!failed.length) return "";
  const rows = sortKingFirst(failed).map(shellRow).join("");
  const count = failed.length;
  const label = count === 1 ? "1 failed shell" : `${count} failed shells`;
  return `<details class="shell-failed">
          <summary class="shell-failed__summary">${escapeHtml(label)}</summary>
          <p class="gear-hint gear-block shell-failed__hint">
            Bench checked. Sealed shut, wrong chemistry, or otherwise not viable
            for a janknode build.
          </p>
          <div class="scroll catalog-scroll">
            <table class="catalog-table">
              ${shellTableHead}
              <tbody>${rows}</tbody>
            </table>
          </div>
        </details>`;
};

const bomTableRow = (item, role, name) => {
  const videoHtml = productVideoThumbHtml(item);
  const rowClass = videoHtml ? "bom-row bom-row--video" : "bom-row";
  return `<tr class="${rowClass}">
          ${bomThumbCell(item)}
          ${labeledTd("Role", escapeHtml(role), "col-role")}
          ${itemCell({ primary: escapeHtml(name), secondary: null })}
          ${labeledTd("$/node", `<span class="num">${escapeHtml(money(nodeBomCost(item)))}</span>`, "col-cost num")}
          ${buyCell(item)}
        </tr>`;
};

function computeBom(catalog) {
  const { lights, boards, antennas, consumables, hero } = catalog;
  const king = lights.find((l) => l.king);
  const kingBoard = boards.find((k) => k.king) || boards[0];
  const kingAntenna = antennas.find((a) => a.king) || antennas[0];
  const bomCore = [
    ...(king
      ? [
          {
            item: king,
            role: "Shell",
            name: king.title || king.form,
          },
        ]
      : []),
    { item: kingBoard, role: "Board", name: kingBoard.title },
    {
      item: kingAntenna,
      role: "Antenna",
      name: kingAntenna.title,
    },
  ];
  const bomHeroConsumables = (hero.consumables || [])
    .map((row) => consumables.find((c) => c.asin === row.asin))
    .filter(Boolean);
  const bomItems = [...bomCore.map((row) => row.item), ...bomHeroConsumables];
  const bomTotal = bomItems.reduce((sum, item) => sum + nodeBomCost(item), 0);
  const firstBuyTotal = bomItems.reduce(
    (sum, item) => sum + (packBomCost(item) ?? 0),
    0,
  );
  return { king, bomCore, bomTotal, firstBuyTotal };
}

export function renderPage(catalog) {
  const {
    lights,
    boards,
    antennas,
    batteries,
    consumables,
    tools,
    hero,
    last_verified,
    radio_daily_mah,
  } = catalog;
  const { bomCore, bomTotal, firstBuyTotal } = computeBom(catalog);
  const { passing, evaluation, failed: failedShells } = partitionShells(lights);
  const bomLabel = money(bomTotal);
  const firstBuyLabel = money(firstBuyTotal);

  const bomConsumableRows = (hero.consumables || [])
    .map((row) => {
      const item = consumables.find((c) => c.asin === row.asin);
      return item ? bomTableRow(item, row.label, item.title) : "";
    })
    .join("");

  const bomRows = `${bomCore.map((row) => bomTableRow(row.item, row.role, row.name)).join("")}${bomConsumableRows}<tr class="bom-total-row">
          <td colspan="3" class="bom-total-label" data-label="">Total</td>
          <td class="col-cost num" data-label="$/node"><span class="num">${escapeHtml(bomLabel)}</span></td>
          <td class="col-buy num bom-total-buy" data-label="Buy"><span class="num">${escapeHtml(firstBuyLabel)}</span></td>
        </tr>`;

  const recordCopy = "Build a Meshtastic or MeshCore solar repeater for";
  const recordItem = (hidden) =>
    `<span class="current-record__item"${hidden ? ' aria-hidden="true"' : ""}><span class="current-record__copy">${escapeHtml(recordCopy)}</span> <span class="current-record__price">${escapeHtml(bomLabel)}</span></span>`;
  const recordStripHtml = `<aside class="current-record" aria-label="Current winning build"><div class="current-record__strip"><div class="current-record__badge"><span class="current-record__badge-icon" aria-hidden="true">👑</span> Current best</div><div class="current-record__viewport"><div class="current-record__track">${recordItem(false)}${recordItem(true)}</div></div></div></aside>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Janknode Review Guide",
    description: `Solar repeater shell rankings and build BOM from ${bomLabel} per node.`,
    url: "https://janknode.fyi/",
    dateModified: last_verified,
  };

  return {
    title: `Janknode Review Guide — solar repeater from ${bomLabel}`,
    description: `Build a Meshtastic or MeshCore solar repeater from ${bomLabel}. Shell rankings, RAK boards, 915 MHz antennas, 18650 cells, consumables, and bench tools.`,
    json_ld: `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
    copyright_year: String(new Date().getFullYear()),
    record_strip_html: recordStripHtml,
    bom_rows: bomRows,
    shell_passing_section: renderShellTableBlock(
      "Passing",
      "Bench pass or strong 1S Li-ion signals from the listing.",
      passing,
      "passing",
    ),
    shell_evaluation_section: renderShellTableBlock(
      "Under evaluation",
      "Harvested from Amazon. Teardown or field test still pending.",
      evaluation,
      "evaluation",
    ),
    shell_failed_section: renderFailedShellSection(failedShells),
    board_rows: sortKingFirst(boards)
      .map((g) => gearRow(g))
      .join(""),
    antenna_rows: sortKingFirst(antennas)
      .map((g) =>
        gearRow(g, "", `${formatGainCell(g)}${formatVswrCell(g)}`, {
          unitCost: true,
        }),
      )
      .join(""),
    battery_rows: sortKingFirst(batteries)
      .map((b) => batteryRow(b, radio_daily_mah))
      .join(""),
    consumable_rows: consumables
      .map((g) =>
        gearRow(g, g.optional ? "optional-row" : "", "", {
          showBrand: false,
          unitCost: true,
        }),
      )
      .join(""),
    tool_rows: tools
      .map((g) => {
        const rowClass = [
          g.pairs_with ? "pair-row" : "",
          g.optional ? "optional-row" : "",
        ]
          .filter(Boolean)
          .join(" ");
        return gearRow(g, rowClass, "", { showBrand: false });
      })
      .join(""),
  };
}

export function applyTemplate(template, parts) {
  return template
    .replace("{{title}}", escapeHtml(parts.title))
    .replace("{{description}}", escapeHtml(parts.description))
    .replace("{{json_ld}}", parts.json_ld)
    .replace("{{copyright_year}}", escapeHtml(parts.copyright_year))
    .replace("{{record_strip_html}}", parts.record_strip_html)
    .replace("{{bom_rows}}", parts.bom_rows)
    .replace("{{shell_passing_section}}", parts.shell_passing_section)
    .replace("{{shell_evaluation_section}}", parts.shell_evaluation_section)
    .replace("{{shell_failed_section}}", parts.shell_failed_section)
    .replace("{{board_rows}}", parts.board_rows)
    .replace("{{antenna_rows}}", parts.antenna_rows)
    .replace("{{battery_rows}}", parts.battery_rows)
    .replace("{{consumable_rows}}", parts.consumable_rows)
    .replace("{{tool_rows}}", parts.tool_rows);
}
