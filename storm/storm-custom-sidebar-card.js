/**
 * ==================================================================================
 * CUSTOM SIDEBAR CARD - HOME ASSISTANT
 * ==================================================================================
 *
 * Description:   A highly customizable sidebar for Home Assistant dashboards.
 *                Supports collapsed/expanded states, active item tracking,
 *                and dynamic styling via YAML configuration.
 *
 * Version:       1.2.0
 * Author:        Marc Maruschka a.k.a. stOrM!
 * Created:       2026
 * License:       GPL
 *
 * GitHub:        https://github.com/Private-Storm/storm-custom-sidebar
 *
 * Features:
 * - Responsive design (Collapsed/Expanded)
 * - Animated selection bar with hover-tracking
 * - Dynamic margins and paddings via YAML
 * - Custom scrollbar styling (Webkit-based)
 *
 * Change Log:
 * v1.0.0 - Initial release, fixed icon centering and selection bar logic.
 * v1.1.0 - Added Badge support.
 * v1.2.0 - Added SVG support
 * ==================================================================================
 */
import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm";

class StormCustomSidebar extends LitElement {
  static getStubConfig() {
    return {
      name: "Mein Haus",
      debug_log: false,
      styles: {
        width: "260px",
        "width-min": "70px",
        background: "#1a1a1a",
        color: "#f5f6fa",
        "border-radius": "16px",
        "highlight-color": "#9c88ff",
        "selection-radius": "16px",
        "icon-color": "#8392a5",
        "icon-color-hover": "#ffffff",
        "icon-color-active": "#ffffff",
        "separator-color": "rgba(255,255,255,0.1)",
        "footer-background": "rgba(0,0,0,0.2)",
        "footer-border-radius": "16px",
      },
      footer: {
        subtitle: "Admin",
      },
      buttons: [
        { name: "Wohnzimmer", icon: "mdi:sofa", path: "/lovelace/0" },
        { name: "Küche", icon: "mdi:fridge", path: "/lovelace/1" },
        { name: "---" },
        { name: "Keller", icon: "mdi:stairs", path: "/lovelace/2" },
      ],
    };
  }

  static get properties() {
    return {
      hass: { attribute: false },
      _config: {},
      _collapsed: { type: Boolean },
      _footerExpanded: { type: Boolean },
      _hoverIndex: { type: Number },
      _sidebarHeight: { type: Number },
    };
  }

  constructor() {
    super();
    this._collapsed = false;
    this._footerExpanded = false;
    this._hoverIndex = -1;
    this._sidebarHeight = window.innerHeight;
    this._boundUpdateHeight = this._updateHeight.bind(this);
    this._svgCache = new Map();
  }

  updated(changedProps) {
    super.updated(changedProps);
    const fc = this.shadowRoot?.querySelector("#nav-footer-content");
    if (fc) {
      const open = this._footerExpanded && !this._collapsed;
      fc.style.maxHeight = open ? "200px" : "0px";
      fc.style.paddingTop = open ? "16px" : "0";
      fc.style.paddingBottom = open ? "16px" : "0";
    }
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    this._config = { ...config };
    if (this._config.debug_log) {
      console.log("[storm-card] config:", this._config);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._ensureProbe();
    window.addEventListener("resize", this._boundUpdateHeight);
    setTimeout(() => this._updateHeight(), 500);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("resize", this._boundUpdateHeight);
  }

  _ensureProbe() {
    if (document.getElementById("__storm-height-probe")) return;
    const probe = document.createElement("div");
    probe.id = "__storm-height-probe";
    probe.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      visibility: hidden;
      z-index: -1;
    `;
    document.body.appendChild(probe);
  }

  _updateHeight() {
    const probe = document.getElementById("__storm-height-probe");
    if (!probe) {
      this._ensureProbe();
      return;
    }

    const probeH = probe.offsetHeight;
    const cardTop = this.getBoundingClientRect().top;
    const available = probeH - cardTop;

    if (this._config && this._config.debug_log) {
      console.log(
        "[storm-card] probe:",
        probeH,
        "cardTop:",
        cardTop,
        "available:",
        available,
      );
    }

    if (available > 0 && available !== this._sidebarHeight) {
      this._sidebarHeight = available;
    }
  }

  _cv(value) {
    if (typeof value !== "string") return value;
    return value.replace(/^['"]|['"]$/g, "");
  }

  _handleToggle() {
    this._collapsed = !this._collapsed;
    if (this._config.debug_log) {
      console.log("[storm-card] Toggle - Collapsed:", this._collapsed);
    }
    setTimeout(() => window.dispatchEvent(new Event("iron-resize")), 200);
  }

  _navigate(path) {
    if (!path) return;
    history.pushState(null, "", path);
    window.dispatchEvent(new Event("location-changed"));
  }

  async _loadSvg(path) {
    if (this._svgCache.has(path)) return this._svgCache.get(path);
    if (!path || !path.trim().toLowerCase().endsWith(".svg")) return null;

    try {
      const response = await fetch(path);
      if (!response.ok) {
        console.warn(
          `[storm-card] SVG fetch failed (${response.status}): ${path}`,
        );
        return null;
      }

      let text = await response.text();

      text = text.replace(/<script[\s\S]*?<\/script>/gi, "");
      text = text.replace(/\s+on\w+="[^"]*"/gi, "");
      text = text.replace(/\s+on\w+='[^']*'/gi, "");
      text = text.replace(/href\s*=\s*["']?\s*javascript:[^"'\s>]*/gi, "");

      if (!text.includes("<svg")) {
        console.warn(`[storm-card] Not a valid SVG: ${path}`);
        return null;
      }

      this._svgCache.set(path, text);
      return text;
    } catch (err) {
      console.warn(`[storm-card] SVG load error: ${path}`, err);
      return null;
    }
  }

  _renderIcon(icon, size, svg) {
    if (svg) {
      const isEditing = !!document.querySelector("hui-dialog-edit-card");
      if (isEditing) {
        return html`<img
          class="svg-icon"
          src="${svg}"
          style="width:${size}; height:${size}; object-fit:contain;"
        />`;
      }
      const cached = this._svgCache.get(svg);
      if (cached) {
        return html`<span
          class="svg-icon"
          style="width:${size}; height:${size}; display:flex; align-items:center; justify-content:center;"
          .innerHTML="${cached}"
        ></span>`;
      }
      this._loadSvg(svg).then((result) => {
        if (result) this.requestUpdate();
      });
      return html`<img
        class="svg-icon"
        src="${svg}"
        style="width:${size}; height:${size}; object-fit:contain;"
      />`;
    }
    if (!icon) return html``;
    return html`<ha-icon
      icon="${icon}"
      style="--mdc-icon-size: ${size};"
    ></ha-icon>`;
  }

  _renderBadge(btn) {
    if (!btn.badge || !btn.badge.entity || !this.hass) return null;

    const stateObj = this.hass.states[btn.badge.entity];
    if (!stateObj || stateObj.state === "0" || stateObj.state === "off")
      return null;

    const cv = this._cv.bind(this);
    const s = this._config.styles || {};
    const b = btn.badge;
    const bgColor = cv(b.color || s["badge-color"] || "#ef4444");
    const fgColor = cv(b["text-color"] || s["badge-text-color"] || "white");
    let borderColor = cv(
      b["border-color"] ||
        s["badge-border-color"] ||
        s["background"] ||
        "#1a1a1a",
    );

    if (typeof borderColor === "string") {
      borderColor = borderColor.trim().replace(/^#+/, "");
      if (/^[0-9a-fA-F]+$/.test(borderColor)) {
        borderColor = "#" + borderColor;
      }
    }

    const showAnim =
      b.animation !== undefined
        ? b.animation
        : s["badge-animation"] !== undefined
          ? s["badge-animation"]
          : true;
    const animColor = cv(
      b["animation-color"] || s["animation-color"] || bgColor,
    );

    return html`
      <div
        class="badge-pill ${showAnim ? "animate" : ""}"
        style="
          background-color: ${bgColor};
          color: ${fgColor};
          box-shadow: 0 0 0 1px ${borderColor};
          --badge-bg: ${bgColor};
          --anim-color: ${animColor};
        "
      >
        ${stateObj.state}
      </div>
    `;
  }

  _getContentOffset() {
    const s = this._config?.styles || {};
    const headerHeight = parseInt(s["header-height"] || "80");
    const separatorHeight = 1;
    return headerHeight + separatorHeight;
  }

  render() {
    if (!this._config) return html``;

    const cv = this._cv.bind(this);
    const s = this._config.styles || {};
    const buttons = this._config.buttons || [];
    const footer = this._config.footer || {};

    const user = this.hass?.user;
    const userId = user?.id;
    const person = this.hass
      ? Object.values(this.hass.states).find(
          (e) => e.attributes.user_id === userId,
        )
      : null;
    const userPicture = person?.attributes.entity_picture;
    const userName = person?.attributes.friendly_name || user?.name || "?";

    const badgeAnimDefault =
      s["badge-animation"] !== undefined ? s["badge-animation"] : true;
    const animColorDefault = cv(s["animation-color"] || "red");

    const currentPath = window.location.pathname;
    const bgColor = cv(s["background"] || "#1a1a1a");
    const textColor = cv(s["color"] || "#f5f6fa");
    const borderColor = cv(s["border-color"] || "transparent");
    const borderRadius = cv(s["border-radius"] || "16px");
    const borderWidth = cv(s["border-width"] || "0px");
    const separatorColor = cv(s["separator-color"] || "rgba(255,255,255,0.1)");
    const titleColor = cv(s["title-color"] || "#fff");
    const titleFontSize = cv(s["title-font-size"] || "1.5rem");
    const titleFontWeight = cv(s["title-font-weight"] || "bold");
    const headerHeight = cv(s["header-height"] || "80px");
    const iconSize = cv(s["icon-size"] || "24px");
    const iconColor = cv(s["icon-color"] || "#8392a5");
    const iconColorHover = cv(s["icon-color-hover"] || "#ffffff");
    const iconColorActive = cv(s["icon-color-active"] || "#ffffff");
    const iconPadding = cv(s["icon-padding"] || "padding: 0 0 0 1rem");
    const hoverTransition = cv(s["hover-transition"] || "0.25s");
    const fontSize = cv(s["font-size"] || "1rem");
    const highlightColor = cv(s["highlight-color"] || "#9c88ff");
    const selectionRadius = cv(s["selection-radius"] || "16px");
    const scrollbarColor = cv(s["scrollbar-color"] || highlightColor);
    const footerBg = cv(s["footer-background"] || "rgba(0,0,0,0.2)");
    const footerMargin = cv(s["footer-margin"] || "8px");
    const footerRadius = cv(s["footer-border-radius"] || "16px");
    const footerHeight = cv(s["footer-height"] || "54px");
    const footerTitleSize = cv(s["footer-title-font-size"] || "0.9rem");
    const footerSubSize = cv(s["footer-subtitle-font-size"] || "0.7rem");
    const avatarSize = cv(s["avatar-size"] || "36px");
    const avatarBg = cv(s["avatar-bg"] || "#444");
    const currentWidth = this._collapsed
      ? cv(s["width-min"] || "70px")
      : cv(s["width"] || "260px");
    const marginTop = cv(s["margin-top"] || "0px");
    const marginRight = cv(s["margin-right"] || "0px");
    const marginBottom = cv(s["margin-bottom"] || "0px");
    const marginLeft = cv(s["margin-left"] || "0px");
    const paddingTop = cv(s["padding-top"] || "0px");
    const paddingRight = cv(s["padding-right"] || "0px");
    const paddingBottom = cv(s["padding-bottom"] || "0px");
    const paddingLeft = cv(s["padding-left"] || "0px");

    const itemHeight = parseInt(s["item-height"] || "54");
    const hostHeight = `${this._sidebarHeight}px`;
    const separatorHeight = 17;
    let yOffset = 0;
    const buttonOffsets = buttons.map((btn) => {
      if (btn.name === "---") {
        const y = yOffset;
        yOffset += separatorHeight;
        return { isSeparator: true, y };
      }
      const y = yOffset;
      yOffset += itemHeight;
      return { isSeparator: false, y };
    });

    const activeIndex = buttons.findIndex(
      (btn) => btn.path && currentPath.startsWith(btn.path),
    );
    const highlightIndex =
      this._hoverIndex !== -1 ? this._hoverIndex : activeIndex;

    const highlightItem =
      highlightIndex !== -1 ? buttonOffsets[highlightIndex] : null;
    const highlightTop =
      highlightItem && !highlightItem.isSeparator ? highlightItem.y : -200;

    const highlightLeft = this._collapsed
      ? `calc(50% - ${itemHeight / 2}px)`
      : "16px";
    const highlightWidth = this._collapsed
      ? `${itemHeight}px`
      : "calc(100% - 32px)";
    const badgeBorderColor = cv(s["badge-border-color"] || bgColor); // Nutzt Sidebar-BG als Default

    return html`
      <style>
        :host {
          display: flex !important;
          flex-direction: column;
          width: ${currentWidth} !important;
          min-width: ${currentWidth} !important;
          max-width: ${currentWidth} !important;
          height: ${hostHeight} !important;
          max-height: ${hostHeight} !important;
          min-height: unset !important;
          transition:
            width 0.3s ease-in-out,
            min-width 0.3s ease-in-out,
            max-width 0.3s ease-in-out;
          margin: ${marginTop} ${marginRight} ${marginBottom} ${marginLeft};
          padding: ${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft};
          box-sizing: border-box;
          overflow: hidden;
        }

        #nav-bar {
          display: flex;
          flex-direction: column;
          width: 100%;
          flex: 1;
          min-height: 0;
          background: ${bgColor};
          color: ${textColor};
          border: ${borderWidth} solid ${borderColor};
          border-radius: ${borderRadius};
          overflow: hidden;
          position: relative;
          box-sizing: border-box;
        }

        #nav-header {
          height: ${headerHeight};
          display: flex;
          align-items: center;
          padding: 0 16px;
          flex-shrink: 0;
          position: relative;
          justify-content: ${this._collapsed ? "center" : "flex-start"};
        }

        #nav-title {
          font-size: ${titleFontSize};
          font-weight: ${titleFontWeight};
          color: ${titleColor};
          opacity: ${this._collapsed ? "0" : "1"};
          transition: opacity 0.2s ease-in-out;
          white-space: nowrap;
          overflow: hidden;
          display: ${this._collapsed ? "none" : "block"};
        }

        #nav-toggle-btn {
          position: absolute;
          right: ${this._collapsed ? "50%" : "16px"};
          transform: ${this._collapsed ? "translateX(50%)" : "none"};
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          color: ${textColor};
        }

        #nav-content {
          flex: 1;
          min-height: 0;
          position: relative;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: thin;
          scrollbar-color: ${scrollbarColor} transparent;
        }

        #nav-content::-webkit-scrollbar {
          width: 4px;
          width: 4px;
          height: 4px;
        }

        #nav-content::-webkit-scrollbar-button {
          display: none;
        }

        #nav-content::-webkit-scrollbar-track,
        #nav-content::-webkit-scrollbar-track-piece {
          background: transparent;
        }

        #nav-content::-webkit-scrollbar-thumb {
          background: ${scrollbarColor};
          border-radius: 4px;
          background-clip: padding-box;
        }

        #nav-content::-webkit-scrollbar-corner,
        #nav-content::-webkit-resizer {
          background: transparent;
        }

        #nav-content-highlight {
          position: absolute;
          left: ${highlightLeft};
          width: ${highlightWidth};
          height: ${itemHeight}px;
          background: ${highlightColor};
          border-radius: ${selectionRadius};
          transition:
            top 0.2s cubic-bezier(0.4, 0, 0.2, 1),
            left 0.3s ease,
            width 0.3s ease;
          z-index: 1;
        }

        .separator {
          height: 1px;
          background: ${separatorColor};
          margin: ${this._collapsed ? "0 8px" : "0 16px"};
          flex-shrink: 0;
        }

        .nav-button {
          position: relative;
          height: ${itemHeight}px;
          display: flex;
          align-items: center;
          justify-content: ${this._collapsed ? "center" : "flex-start"};
          padding: 0 ${this._collapsed ? "0" : "16px"};
          cursor: pointer;
          z-index: 2;
          transition: background-color 0.2s ease;
          border-radius: ${selectionRadius};
          overflow: visible !important;
        }

        .nav-button ha-icon,
        .nav-button .svg-icon {
          color: ${iconColor};
          transition: color ${hoverTransition} ease;
          padding: ${this._collapsed ? "0" : "0 0 0 .8rem"};
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-button .svg-icon svg {
          width: 100%;
          height: 100%;
          fill: currentColor;
        }

        .nav-button span {
          margin-left: ${this._collapsed ? "0" : "16px"};
          font-size: ${fontSize};
          color: ${iconColor};
          opacity: ${this._collapsed ? "0" : "1"};
          max-width: ${this._collapsed ? "0" : "200px"};
          overflow: hidden;
          transition:
            opacity 0.3s ease-in-out,
            max-width 0.3s ease-in-out,
            margin-left 0.3s ease-in-out,
            color ${hoverTransition} ease;
          white-space: nowrap;
        }

        .badge-pill {
          position: absolute;
          top: 4px;
          right: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          background: var(--badge-bg);
          color: var(--badge-fg);
          border-radius: 999px;
          font-size: 10px;
          font-weight: 900;
          z-index: 10;
          white-space: nowrap;
        }

        .badge-pill.animate::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: var(--anim-color);
          opacity: 0.7;
          z-index: -1;
          animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes ping {
          75%,
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        .nav-button.active {
          background: ${highlightColor};
          border-radius: ${selectionRadius};
          width: ${this._collapsed ? `${itemHeight}px` : "calc(100% - 64px)"};
          margin-left: ${this._collapsed ? "auto" : "16px"};
          margin-right: ${this._collapsed ? "auto" : "auto"};
        }

        #nav-content:hover .nav-button.active {
          background: ${highlightColor};
          opacity: 0.8;
        }

        .nav-button.active:hover {
          opacity: 1 !important;
        }

        .nav-button:hover ha-icon,
        .nav-button:hover .svg-icon {
          color: ${iconColorHover};
        }

        .nav-button:hover span {
          color: ${iconColorHover};
        }

        .nav-button.active ha-icon,
        .nav-button.active .svg-icon {
          color: ${iconColorActive};
        }

        .nav-button.active span {
          color: ${iconColorActive};
        }

        .nav-separator {
          height: 1px;
          background: ${separatorColor};
          margin: 8px ${this._collapsed ? "8px" : "16px"};
          flex-shrink: 0;
          cursor: default;
        }

        #nav-footer {
          flex-shrink: 0;
          background: ${footerBg};
          margin: ${footerMargin};
          border-radius: ${footerRadius};
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: ${this._collapsed ? "center" : "stretch"};
        }

        #nav-footer-heading {
          height: ${footerHeight};
          display: flex;
          align-items: center;
          padding: 0 ${this._collapsed ? "0" : "8px"};
          justify-content: ${this._collapsed ? "center" : "flex-start"};
          gap: 0;
          width: 100%;
        }

        #nav-footer-avatar {
          width: ${avatarSize};
          height: ${avatarSize};
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          background: ${avatarBg};
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1rem;
          color: #fff;
          cursor: ${footer.avatar_path ? "pointer" : "default"};
        }

        #nav-footer-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        #nav-footer-titlebox {
          margin-left: ${this._collapsed ? "0" : "12px"};
          display: ${this._collapsed ? "none" : "flex"};
          flex-direction: column;
          opacity: ${this._collapsed ? "0" : "1"};
          transition: opacity 0.2s ease-in-out;
          overflow: hidden;
          flex: 1;
          cursor: pointer;
        }

        #nav-footer-title {
          font-size: ${footerTitleSize};
          font-weight: bold;
          white-space: nowrap;
          color: ${textColor};
        }

        #nav-footer-subtitle {
          font-size: ${footerSubSize};
          opacity: 0.6;
          white-space: nowrap;
          color: ${textColor};
        }

        #nav-footer-content {
          font-size: 0.8rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: ${textColor};
          overflow: hidden;
          max-height: 0px;
          padding: 0 16px;
          transition:
            max-height 0.35s ease-in-out,
            padding 0.35s ease-in-out;
        }
      </style>

      <div id="nav-bar">
        <div id="nav-header">
          <div id="nav-title">${this._config.name}</div>
          <div id="nav-toggle-btn" @click="${this._handleToggle}">
            <ha-icon
              icon="${this._collapsed ? "mdi:menu" : "mdi:chevron-left"}"
            ></ha-icon>
          </div>
        </div>

        <div class="separator"></div>

        <div id="nav-content">
          ${buttons.map((btn, index) => {
            if (btn.name === "---") {
              return html`<div class="nav-separator"></div>`;
            }
            const isActive = btn.path && currentPath.startsWith(btn.path);
            return html`
              <div
                class="nav-button ${isActive ? "active" : ""}"
                @mouseenter="${() => {
                  if (buttons[index].name !== "---") this._hoverIndex = index;
                }}"
                @mouseleave="${() => (this._hoverIndex = -1)}"
                @click="${() => this._navigate(btn.path)}"
              >
                ${this._renderIcon(btn.icon, iconSize, btn.svg)}
                <span>${btn.name}</span>

                ${this._renderBadge(btn)}
              </div>
            `;
          })}
          <div
            id="nav-content-highlight"
            style="top: ${highlightTop}px; left: ${highlightLeft}; width: ${highlightWidth};"
          ></div>
        </div>

        <div class="separator"></div>

        <div id="nav-footer">
          <div id="nav-footer-heading">
            <div
              id="nav-footer-avatar"
              @click="${() =>
                footer.avatar_path ? this._navigate(footer.avatar_path) : null}"
            >
              ${userPicture
                ? html`<img src="${userPicture}" alt="${userName}" />`
                : userName.charAt(0).toUpperCase()}
            </div>
            <div
              id="nav-footer-titlebox"
              @click="${() => (this._footerExpanded = !this._footerExpanded)}"
            >
              <span id="nav-footer-title">${userName}</span>
              <span id="nav-footer-subtitle">${footer.subtitle || ""}</span>
            </div>
          </div>
          <div id="nav-footer-content">${footer.content || ""}</div>
        </div>
      </div>
    `;
  }
}

customElements.define("storm-custom-sidebar-card", StormCustomSidebar);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "storm-custom-sidebar-card",
  name: "Storm Sidebar",
  description: "A fully customizeable sidebar for Home Assistant",
  preview: true,
});
