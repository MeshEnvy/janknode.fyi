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

const shellVideoUrl = (l) => l.youtube_review || l.youtube_assembly;

const shellVideoLabel = (l) => (l.youtube_review ? "review" : "build video");

const shellVideoThumbSrc = (l) => {
  if (l.youtube_thumb) return l.youtube_thumb;
  const videoId = youtubeVideoId(shellVideoUrl(l));
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
};

const shellThumbCell = (l) => {
  const videoUrl = shellVideoUrl(l);
  if (l.profile_video && videoUrl) {
    const label = shellVideoLabel(l);
    const thumbSrc = shellVideoThumbSrc(l);
    if (thumbSrc) {
      return `<td class="col-thumb col-thumb--video" data-label=""><a class="shell-video-thumb" href="${attr(videoUrl)}" target="_blank" rel="noopener noreferrer" title="Watch ${label}" aria-label="Watch ${attr(l.brand)} ${label}"><img class="shell-video-thumb__img" src="${attr(thumbSrc)}" alt="" loading="lazy" onerror="this.closest('.shell-video-thumb').classList.add('shell-video-thumb--no-img')" /><span class="shell-video-thumb__play" aria-hidden="true">▶</span></a></td>`;
    }
  }
  return `<td class="col-thumb" data-label=""><img class="thumb" src="${attr(l.profile)}" alt="${attr(l.brand)}" /></td>`;
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

const shellRow = (l) => {
  const works = l.works || "unknown";
  const worksClass = /^[\w-]+$/.test(works) ? works : "unknown";
  return `<tr>
          ${shellThumbCell(l)}
          ${itemCell({
            primary: escapeHtml(l.brand),
            secondary: l.form || null,
          })}
          ${labeledTd("Works?", `<span class="badge ${worksClass}">${escapeHtml(works)}</span>`, "col-works")}
          ${labeledTd("mAh", l.mah_label != null ? `<span class="num">${escapeHtml(l.mah_label.toLocaleString())}</span>` : dash, "col-mah num")}
          ${formatUnitCostCell(l)}
          ${buyCell(l)}
        </tr>`;
};

const bomTableRow = (item, role, name) =>
  `<tr class="bom-row">
          ${labeledTd("", `${winnerBadgeHtml()}${gearThumb(item)}`, "col-thumb")}
          ${labeledTd("Role", escapeHtml(role), "col-role")}
          ${itemCell({ primary: escapeHtml(name), secondary: null })}
          ${labeledTd("$/node", `<span class="num">${escapeHtml(money(nodeBomCost(item)))}</span>`, "col-cost num")}
          ${buyCell(item)}
        </tr>`;

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
  const { lights, boards, antennas, consumables, tools, hero, last_verified } =
    catalog;
  const { bomCore, bomTotal, firstBuyTotal } = computeBom(catalog);
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
    description: `Build a Meshtastic or MeshCore solar repeater from ${bomLabel}. Shell rankings, RAK boards, 915 MHz antennas, consumables, and bench tools.`,
    json_ld: `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
    copyright_year: String(new Date().getFullYear()),
    record_strip_html: recordStripHtml,
    bom_rows: bomRows,
    shell_rows: sortKingFirst(lights).map(shellRow).join(""),
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
    .replace("{{shell_rows}}", parts.shell_rows)
    .replace("{{board_rows}}", parts.board_rows)
    .replace("{{antenna_rows}}", parts.antenna_rows)
    .replace("{{consumable_rows}}", parts.consumable_rows)
    .replace("{{tool_rows}}", parts.tool_rows);
}
