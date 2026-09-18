"use strict";

(() => {
  const SUPPORTED = ["en-US", "zh-CN"];
  const SETTINGS_KEY = "metropolis_roaring_times_m1w_settings_v1";
  const dictionaries = window.M1W_LOCALES || {};
  let locale = "en-US";

  function normalize(value) {
    if (!value) return null;
    const candidate = String(value).toLowerCase();
    if (candidate === "zh" || candidate.startsWith("zh-")) return "zh-CN";
    if (candidate === "en" || candidate.startsWith("en-")) return "en-US";
    return SUPPORTED.includes(value) ? value : null;
  }

  function preferredLocale() {
    const query = normalize(new URLSearchParams(window.location.search).get("lang"));
    if (query) return query;
    try {
      const saved = JSON.parse(window.localStorage.getItem(SETTINGS_KEY) || "null");
      if (normalize(saved?.language)) return normalize(saved.language);
    } catch (error) {
      console.warn("Could not read language settings", error);
    }
    return "en-US";
  }

  function lookup(key, requested = locale) {
    if (key.startsWith("static.") && /\.\d+$/.test(key)) {
      const sharedKey = key.replace(/\.\d+$/, "");
      return dictionaries[requested]?.[key]
        ?? dictionaries[requested]?.[sharedKey]
        ?? dictionaries["en-US"]?.[key]
        ?? dictionaries["en-US"]?.[sharedKey]
        ?? key.slice(7).replace(/\.\d+$/, "");
    }
    const exact = dictionaries[requested]?.[key] ?? dictionaries["en-US"]?.[key];
    if (exact != null) return exact;
    return key;
  }

  function format(template, values = {}) {
    return String(template).replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key) => values[key] ?? `{${key}}`);
  }

  function t(key, values = {}, requested = locale) {
    return format(lookup(key, requested), values);
  }

  function translateDocument() {
    document.documentElement.lang = locale;
    document.title = t("meta.title");
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = t("meta.description");
    for (const element of document.querySelectorAll("[data-i18n]")) element.textContent = t(element.dataset.i18n);
    for (const element of document.querySelectorAll("[data-i18n-html]")) element.innerHTML = t(element.dataset.i18nHtml);
    for (const element of document.querySelectorAll("[data-i18n-aria]")) element.setAttribute("aria-label", t(element.dataset.i18nAria));
    for (const element of document.querySelectorAll("[data-i18n-alt]")) element.setAttribute("alt", t(element.dataset.i18nAlt));
  }

  function persist() {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify({ language: locale }));
  }

  function setLocale(next, options = {}) {
    const normalized = normalize(next) || "en-US";
    const changed = normalized !== locale;
    locale = normalized;
    translateDocument();
    if (options.persist !== false) persist();
    if (changed || options.forceEvent) window.dispatchEvent(new CustomEvent("m1w:locale-changed", { detail: { locale } }));
    return locale;
  }

  function registerStaticText() {
    const english = dictionaries["en-US"] || {};
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (["SCRIPT", "STYLE", "OPTION"].includes(node.parentElement?.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    const counts = new Map();
    for (const textNode of nodes) {
      const original = textNode.nodeValue;
      const source = original.trim();
      const index = (counts.get(source) || 0) + 1;
      counts.set(source, index);
      const key = `static.${source}.${index}`;
      if (!(key in english)) english[key] = source;
      const span = document.createElement("span");
      span.dataset.i18n = key;
      span.textContent = source;
      const leading = original.match(/^\s*/)?.[0] || "";
      const trailing = original.match(/\s*$/)?.[0] || "";
      textNode.replaceWith(document.createTextNode(leading), span, document.createTextNode(trailing));
    }
    for (const element of document.querySelectorAll("[aria-label]")) {
      const source = element.getAttribute("aria-label");
      const key = `attribute.${source}`;
      if (!(key in english)) english[key] = source;
      element.dataset.i18nAria = key;
    }
    for (const element of document.querySelectorAll("[alt]")) {
      const source = element.getAttribute("alt");
      if (source) {
        const key = `attribute.${source}`;
        if (!(key in english)) english[key] = source;
        element.dataset.i18nAlt = key;
      }
    }
  }

  locale = preferredLocale();
  window.M1WI18n = { t, lookup, setLocale, getLocale: () => locale, translateDocument, normalize, supported: [...SUPPORTED] };
  registerStaticText();
  translateDocument();
})();
