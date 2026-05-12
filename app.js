const $ = (selector) => document.querySelector(selector);

const inputText = $("#inputText");
const outputBox = $("#outputBox");
const inputCounter = $("#inputCounter");

const generateBtn = $("#generateBtn");
const clearBtn = $("#clearBtn");
const copyBtn = $("#copyBtn");
const langSelect = $("#langSelect");

let isLoading = false;
let currentLang = "en";
let i18n = {};
let cancelController = null;

const i18nCache = new Map();

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function tr(key, fallback = "") {
  return i18n && i18n[key] != null ? i18n[key] : fallback;
}

async function loadLocale(lang) {
  if (i18nCache.has(lang)) return i18nCache.get(lang);

  const response = await fetch(`./locales/${lang}.json`, {
    cache: "no-store",
  });

  if (!response.ok) {
    if (lang !== "en") return loadLocale("en");
    throw new Error("Locale load failed");
  }

  const data = await response.json();
  i18nCache.set(lang, data);
  return data;
}

function applyI18n() {
  document.documentElement.lang = currentLang;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.textContent = tr(key, element.textContent);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    element.setAttribute("placeholder", tr(key, element.getAttribute("placeholder") || ""));
  });

  generateBtn.textContent = isLoading ? tr("cancel", "Cancel") : tr("generate", "Generate");
  clearBtn.textContent = tr("clear", "Clear");
  copyBtn.textContent = tr("copy", "Copy");

  if (!outputBox.dataset.hasResult && !isLoading) {
    renderPlaceholder();
  }
}

async function setLanguage(lang) {
  currentLang = lang;
  i18n = await loadLocale(lang);
  applyI18n();
}

function updateCounter() {
  inputCounter.textContent = String(inputText.value.length);
}

function updateGenerateButton() {
  const hasText = inputText.value.trim().length > 0;
  generateBtn.disabled = !isLoading && !hasText;
}

function renderPlaceholder() {
  delete outputBox.dataset.hasResult;

  outputBox.innerHTML = `
    <div class="output-placeholder">
      ${escapeHtml(tr("outputPlaceholder", "Your generated ability will appear here."))}
    </div>
  `;
}

function renderLoading() {
  delete outputBox.dataset.hasResult;

  outputBox.innerHTML = `
    <div class="ai-loading">
      <div class="ai-loading-icon">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div class="ai-loading-content">
        <div class="ai-loading-title">
          ${escapeHtml(tr("loadingTitle", "Generating ability"))}
        </div>
        <div class="ai-loading-text">
          ${escapeHtml(tr("loadingText", "Analyzing your input and preparing a professional result..."))}
        </div>
      </div>
    </div>
  `;
}

function renderResult(text) {
  outputBox.dataset.hasResult = "1";

  outputBox.innerHTML = `
    <div class="result">
      ${escapeHtml(text)}
    </div>
  `;
}

function setLoading(value) {
  isLoading = value;

  document.body.classList.toggle("is-loading", value);

  clearBtn.disabled = value;
  langSelect.disabled = value;

  generateBtn.textContent = value ? tr("cancel", "Cancel") : tr("generate", "Generate");

  updateGenerateButton();

  if (value) {
    renderLoading();
  }
}

function buildTestResult(input) {
  const cleanedInput = input.replace(/\s+/g, " ").trim();

  return `Transformed the provided experience into a clear, professional capability statement: ${cleanedInput}`;
}

async function generateAbility() {
  const input = inputText.value.trim();

  if (!input || isLoading) return;

  cancelController = new AbortController();
  setLoading(true);

  try {
    const result = await generateAbilityApi(input, currentLang, cancelController.signal);
    renderResult(result);
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error);
      renderResult(tr("errorMessage", "Something went wrong. Please try again."));
    }
  } finally {
    cancelController = null;
    setLoading(false);
  }
}

async function generateAbilityApi(input, language, signal) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
    body: JSON.stringify({
      inputText: input,
      language: language,
    }),
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid API response.");
  }

  if (!response.ok) {
    throw new Error(data.error || "Generation failed.");
  }

  if (!data.result || typeof data.result !== "string") {
    throw new Error("API response does not contain a valid result.");
  }

  return data.result.trim();
}

function generateAbilityMock(input, signal) {
  return new Promise((resolve, reject) => {
    const delay = 1200;

    const timer = setTimeout(() => {
      resolve(buildTestResult(input));
    }, delay);

    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Generation cancelled", "AbortError"));
    });
  });
}

function cancelGeneration() {
  if (!isLoading || !cancelController) return;

  cancelController.abort();
  cancelController = null;

  setLoading(false);
  renderPlaceholder();
}

async function copyResult() {
  const result = outputBox.dataset.hasResult
    ? outputBox.querySelector(".result")?.textContent?.trim()
    : "";

  if (!result) return;

  const textToCopy = `• ${result}`;

  try {
    await navigator.clipboard.writeText(textToCopy);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  const normalText = tr("copy", "Copy");
  copyBtn.textContent = tr("copied", "Copied");

  setTimeout(() => {
    copyBtn.textContent = normalText;
  }, 900);
}

function clearInput() {
  inputText.value = "";
  updateCounter();
  updateGenerateButton();
  renderPlaceholder();
  inputText.focus();
}

inputText.addEventListener("input", () => {
  updateCounter();
  updateGenerateButton();
});

generateBtn.addEventListener("click", () => {
  if (isLoading) {
    cancelGeneration();
  } else {
    generateAbility();
  }
});

clearBtn.addEventListener("click", clearInput);
copyBtn.addEventListener("click", copyResult);

langSelect.addEventListener("change", (event) => {
  setLanguage(event.target.value);
});

(async function init() {
  updateCounter();

  try {
    await setLanguage(langSelect.value || "en");
  } catch {
    i18n = {};
    currentLang = "en";
  }

  renderPlaceholder();
  updateGenerateButton();
})();