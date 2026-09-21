/**
 * Build-time HTML renderers for janknode.fyi catalog tables and hero.
 */

export function escapeHtml(value) {
  if (value == null) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const attr = escapeHtml

const AMAZON_ICON =
  '<svg class="buy-store-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726a17.617 17.617 0 01-10.951-.577 17.88 17.88 0 01-5.43-3.35c-.1-.074-.151-.15-.151-.22 0-.047.021-.09.051-.13zm6.565-6.218c0-1.005.247-1.863.743-2.577.495-.71 1.17-1.25 2.04-1.615.796-.335 1.756-.575 2.912-.72.39-.046 1.033-.103 1.92-.174v-.37c0-.93-.105-1.558-.3-1.875-.302-.43-.78-.65-1.44-.65h-.182c-.48.046-.896.196-1.246.46-.35.27-.575.63-.675 1.096-.06.3-.206.465-.435.51l-2.52-.315c-.248-.06-.372-.18-.372-.39 0-.046.007-.09.022-.15.247-1.29.855-2.25 1.82-2.88.976-.616 2.1-.975 3.39-1.05h.54c1.65 0 2.957.434 3.888 1.29.135.15.27.3.405.48.12.165.224.314.283.45.075.134.15.33.195.57.06.254.105.42.135.51.03.104.062.3.076.615.01.313.02.493.02.553v5.28c0 .376.06.72.165 1.036.105.313.21.54.315.674l.51.674c.09.136.136.256.136.36 0 .12-.06.226-.18.314-1.2 1.05-1.86 1.62-1.963 1.71-.165.135-.375.15-.63.045a6.062 6.062 0 01-.526-.496l-.31-.347a9.391 9.391 0 01-.317-.42l-.3-.435c-.81.886-1.603 1.44-2.4 1.665-.494.15-1.093.227-1.83.227-1.11 0-2.04-.343-2.76-1.034-.72-.69-1.08-1.665-1.08-2.94l-.05-.076zm3.753-.438c0 .566.14 1.02.425 1.364.285.34.675.512 1.155.512.045 0 .106-.007.195-.02.09-.016.134-.023.166-.023.614-.16 1.08-.553 1.424-1.178.165-.28.285-.58.36-.91.09-.32.12-.59.135-.8.015-.195.015-.54.015-1.005v-.54c-.84 0-1.484.06-1.92.18-1.275.36-1.92 1.17-1.92 2.43l-.035-.02zm9.162 7.027c.03-.06.075-.11.132-.17.362-.243.714-.41 1.05-.5a8.094 8.094 0 011.612-.24c.14-.012.28 0 .41.03.65.06 1.05.168 1.172.33.063.09.099.228.099.39v.15c0 .51-.149 1.11-.424 1.8-.278.69-.664 1.248-1.156 1.68-.073.06-.14.09-.197.09-.03 0-.06 0-.09-.012-.09-.044-.107-.12-.064-.24.54-1.26.806-2.143.806-2.64 0-.15-.03-.27-.087-.344-.145-.166-.55-.257-1.224-.257-.243 0-.533.016-.87.046-.363.045-.7.09-1 .135-.09 0-.148-.014-.18-.044-.03-.03-.036-.047-.02-.077 0-.017.006-.03.02-.063v-.06z"/></svg>'

const money = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

const dash = '<span class="empty">—</span>'

const labeledTd = (label, content, className = '') =>
  `<td class="${className}" data-label="${attr(label)}">${content}</td>`

const buyButtonLabel = (item) => {
  const qty = item.pack_qty
  const price = item.pack_price_usd
  if (price == null) return null
  if (qty == null || qty <= 1) return `Buy ${money(price)}`
  return `Buy ${qty}-pack ${money(price)}`
}

const buyLinkHtml = (item, { priced = true } = {}) => {
  const href = item.buy_url || item.amazon
  if (!href) return null

  const packLabel = buyButtonLabel(item)
  const store = item.vendor || 'Amazon'
  const isAmazon = /amazon\./i.test(href)
  const icon = isAmazon ? AMAZON_ICON : ''
  const amazonClass = isAmazon ? ' row-buy--amazon' : ''

  if (packLabel == null) {
    return `<a class="row-buy${amazonClass} row-buy--unavailable" href="${attr(href)}" target="_blank" rel="noopener noreferrer" title="View on ${attr(store)} (not available)">${icon}${escapeHtml('Not available')}</a>`
  }

  const buttonText = priced ? packLabel : 'Buy'
  const title = priced ? `Buy on ${store}` : `Buy on ${store} · ${packLabel}`
  return `<a class="row-buy${amazonClass}" href="${attr(href)}" target="_blank" rel="noopener noreferrer" title="${attr(title)}">${icon}${escapeHtml(buttonText)}</a>`
}

const buyCell = (item, { priced = true } = {}) => {
  const link = buyLinkHtml(item, { priced })
  if (!link) return labeledTd('Buy', dash, 'col-buy')
  return labeledTd('Buy', link, 'col-buy')
}

const itemCell = ({ primary, secondary, badgeHtml = '' }) =>
  `<td class="col-item" data-label="">
            <div class="item-title">${primary}${badgeHtml}</div>
            ${secondary ? `<div class="item-sub">${escapeHtml(secondary)}</div>` : ''}
          </td>`

const gearThumb = (g) =>
  g.profile
    ? `<img class="thumb" src="${attr(g.profile)}" alt="${attr(g.brand)}" />`
    : `<div class="thumb thumb-empty" aria-hidden="true">no shot</div>`

const shellThumbCell = (l) =>
  `<td class="col-thumb" data-label=""><img class="thumb" src="${attr(l.profile)}" alt="${attr(l.brand)}" /></td>`

const shellReviewCell = (l) => {
  const play = l.youtube_review
    ? `<a class="review-play" href="${attr(l.youtube_review)}" target="_blank" rel="noopener noreferrer" title="Watch review" aria-label="Watch ${attr(l.brand)} review">▶</a>`
    : `<span class="review-play review-play-pending" title="Review coming soon" aria-label="${attr(l.brand)} review not published yet">▶</span>`
  return labeledTd('Review', play, 'col-review review-cell')
}

const sortKingFirst = (arr) =>
  [...arr].sort((a, b) => Number(!!b.king) - Number(!!a.king))

const nodeBomCost = (item) => {
  if (item.node_cost_usd != null) return item.node_cost_usd
  if (item.unit_price_usd != null) return item.unit_price_usd
  if (item.pack_price_usd != null && item.pack_qty === 1) {
    return item.pack_price_usd
  }
  return 0
}

const bomBuyLink = (item, { priced = true } = {}) =>
  buyLinkHtml(item, { priced }) || dash

const formatVswrShots = (shots) => {
  if (!shots?.length) return ''
  return `<div class="vna-shots">${shots
    .map(
      (s) =>
        `<a class="vna-shot" href="${attr(s.src)}" target="_blank" rel="noopener" title="Open full sweep">
                <img src="${attr(s.src)}" alt="${attr(s.alt || s.label)}" loading="lazy" />
                <span>${escapeHtml(s.label)}</span>
              </a>`,
    )
    .join('')}</div>`
}

const formatVswrCell = (a) => {
  const value =
    a.vswr_min != null && a.vswr_min_mhz != null
      ? `<span class="vswr-measured">${a.vswr_min.toFixed(2)} @ ${a.vswr_min_mhz}</span>`
      : dash
  const plots = formatVswrShots(a.vswr_shots)
  return `<td class="col-vswr vswr-cell" data-label="915 MHz VSWR">${value}${plots}</td>`
}

const gearRow = (
  g,
  extraClass = '',
  extraCells = '',
  kingLabel = 'pick',
  { priced = true, showBrand = true } = {},
) => {
  const opt = g.optional
    ? ' <span class="badge optional">optional</span>'
    : ''
  const crown = g.king
    ? `<span class="king-mark" title="King ${attr(kingLabel)}">👑</span>`
    : ''
  const rowClass = [g.king ? 'king-row' : '', extraClass]
    .filter(Boolean)
    .join(' ')
  return `<tr class="${rowClass}">
          ${labeledTd('', gearThumb(g), 'col-thumb')}
          ${itemCell({
            primary: `${escapeHtml(g.title)}${opt}`,
            secondary: showBrand ? g.brand : null,
            badgeHtml: crown,
          })}
          ${buyCell(g, { priced })}
          ${extraCells}
          ${labeledTd('Notes', g.note ? escapeHtml(g.note) : dash, 'col-notes')}
        </tr>`
}

const shellRow = (l) => {
  const works = l.works || 'unknown'
  const worksClass = /^[\w-]+$/.test(works) ? works : 'unknown'
  const crown = l.king
    ? '<span class="king-mark" title="King shell">👑</span>'
    : ''
  return `<tr class="${l.king ? 'king-row' : ''}">
          ${shellThumbCell(l)}
          ${shellReviewCell(l)}
          ${itemCell({
            primary: escapeHtml(l.brand),
            secondary: l.form || null,
            badgeHtml: crown,
          })}
          ${labeledTd('Works?', `<span class="badge ${worksClass}">${escapeHtml(works)}</span>`, 'col-works')}
          ${buyCell(l)}
          ${labeledTd('mAh', l.mah_label != null ? escapeHtml(l.mah_label.toLocaleString()) : dash, 'col-mah num')}
        </tr>`
}

const heroCard = ({ item, label, name, mediaClass = '' }) =>
  `<figure class="hero-stack-item">
          <div class="hero-card-media${mediaClass}">
            <img src="${attr(item.profile)}" alt="${attr(`${item.brand} ${item.title || name}`)}" />
          </div>
          <figcaption class="hero-card-info">
            <span class="hero-card-label">${escapeHtml(label)}</span>
            <span class="hero-card-name">${escapeHtml(name)}</span>
            <div class="hero-card-cost">${escapeHtml(money(nodeBomCost(item)))}/node</div>
            <div class="hero-card-foot">${bomBuyLink(item)}</div>
          </figcaption>
        </figure>`

const heroBomRow = (item, label, name) =>
  `<div class="hero-bom-row">
          <img class="hero-bom-thumb" src="${attr(item.profile)}" alt="" />
          <div>
            <div class="hero-bom-label">${escapeHtml(label)}</div>
            <div class="hero-bom-name">${escapeHtml(name)}</div>
          </div>
          <span class="hero-bom-cost">${escapeHtml(money(nodeBomCost(item)))}/node</span>
          ${bomBuyLink(item)}
        </div>`

function computeBom(catalog) {
  const { lights, boards, antennas, consumables, hero } = catalog
  const king = lights.find((l) => l.king)
  const kingBoard = boards.find((k) => k.king) || boards[0]
  const kingAntenna = antennas.find((a) => a.king) || antennas[0]
  const bomCore = [
    { item: king, label: 'Shell', name: `${king.brand} · ${king.title || king.form}`, mediaClass: ' hero-card-media--cover' },
    { item: kingBoard, label: 'Board', name: kingBoard.title, mediaClass: '' },
    {
      item: kingAntenna,
      label: 'Antenna',
      name: `${kingAntenna.brand} · ${hero.antenna_display || '915 MHz antenna'}`,
      mediaClass: '',
    },
  ]
  const bomConsumables = consumables.filter((c) => !c.optional)
  const bomTotal = [...bomCore.map((row) => row.item), ...bomConsumables].reduce(
    (sum, item) => sum + nodeBomCost(item),
    0,
  )
  return { king, bomCore, bomTotal }
}

export function renderPage(catalog) {
  const { lights, boards, antennas, consumables, tools, hero, last_verified } =
    catalog
  const { bomCore, bomTotal } = computeBom(catalog)
  const bomLabel = money(bomTotal)

  const heroHtml = `
        <h2 class="hero-headline">Build a Meshtastic or MeshCore solar repeater for<br /><span class="hero-headline-price">${escapeHtml(bomLabel)}</span></h2>
        <div class="hero-stack">
          ${bomCore.map((row) => heroCard(row)).join('')}
        </div>
        <p class="hero-bom-heading">Consumables per node</p>
        <div class="hero-bom">
          ${(hero.consumables || [])
            .map((row) => {
              const item = consumables.find((c) => c.asin === row.asin)
              return item ? heroBomRow(item, row.label, row.name) : ''
            })
            .join('')}
        </div>`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Janknode Review Guide',
    description: `Solar repeater shell rankings and build BOM from ${bomLabel} per node.`,
    url: 'https://janknode.fyi/',
    dateModified: last_verified,
  }

  return {
    title: `Janknode Review Guide — solar repeater from ${bomLabel}`,
    description: `Build a Meshtastic or MeshCore solar repeater from ${bomLabel}. Shell rankings, RAK boards, 915 MHz antennas, consumables, and bench tools.`,
    json_ld: `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
    hero: heroHtml,
    stamp: escapeHtml(`Last verified ${last_verified} · ${lights.length} shells`),
    shell_rows: sortKingFirst(lights).map(shellRow).join(''),
    board_rows: sortKingFirst(boards)
      .map((g) => gearRow(g, '', '', 'board'))
      .join(''),
    antenna_rows: sortKingFirst(antennas)
      .map((g) => gearRow(g, '', formatVswrCell(g), 'antenna'))
      .join(''),
    consumable_rows: consumables
      .map((g) =>
        gearRow(g, g.optional ? 'optional-row' : '', '', 'pick', {
          showBrand: false,
        }),
      )
      .join(''),
    tool_rows: tools
      .map((g) => {
        const rowClass = [
          g.pairs_with ? 'pair-row' : '',
          g.optional ? 'optional-row' : '',
        ]
          .filter(Boolean)
          .join(' ')
        return gearRow(g, rowClass, '', 'pick', { showBrand: false })
      })
      .join(''),
  }
}

export function applyTemplate(template, parts) {
  return template
    .replace('{{title}}', escapeHtml(parts.title))
    .replace('{{description}}', escapeHtml(parts.description))
    .replace('{{json_ld}}', parts.json_ld)
    .replace('{{hero}}', parts.hero)
    .replace('{{stamp}}', parts.stamp)
    .replace('{{shell_rows}}', parts.shell_rows)
    .replace('{{board_rows}}', parts.board_rows)
    .replace('{{antenna_rows}}', parts.antenna_rows)
    .replace('{{consumable_rows}}', parts.consumable_rows)
    .replace('{{tool_rows}}', parts.tool_rows)
}
