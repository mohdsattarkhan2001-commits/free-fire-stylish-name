const nicknameInput = document.getElementById("nicknameInput");
const generateBtn = document.getElementById("generateBtn");
const randomBtn = document.getElementById("randomBtn");
const clearBtn = document.getElementById("clearBtn");
const resultsList = document.getElementById("resultsList");
const presetList = document.getElementById("presetList");
const itemTemplate = document.getElementById("resultItemTemplate");
const toast = document.getElementById("toast");
const namePreview = document.getElementById("namePreview");

const fontMaps = [
  { a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ғ", g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ", s: "s", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ" },
  { a: "卂", b: "乃", c: "匚", d: "ᗪ", e: "乇", f: "千", g: "Ꮆ", h: "卄", i: "丨", j: "ﾌ", k: "Ҝ", l: "ㄥ", m: "爪", n: "几", o: "ㄖ", p: "卩", q: "Ɋ", r: "尺", s: "丂", t: "ㄒ", u: "ㄩ", v: "ᐯ", w: "山", x: "乂", y: "ㄚ", z: "乙" },
  { a: "𝖆", b: "𝖇", c: "𝖈", d: "𝖉", e: "𝖊", f: "𝖋", g: "𝖌", h: "𝖍", i: "𝖎", j: "𝖏", k: "𝖐", l: "𝖑", m: "𝖒", n: "𝖓", o: "𝖔", p: "𝖕", q: "𝖖", r: "𝖗", s: "𝖘", t: "𝖙", u: "𝖚", v: "𝖛", w: "𝖜", x: "𝖝", y: "𝖞", z: "𝖟" }
];

const wrappers = [
  ["『", "』"],
  ["乂", "乂"],
  ["◥", "◤"],
  ["꧁", "꧂"],
  ["★", "★"],
  ["⚡", "⚡"]
];

const randomWords = ["Ghost", "Ninja", "Sniper", "Raven", "Venom", "Blaze", "Storm", "Killer", "Hunter", "Viper"];
const defaultPreviewName = "FONTIXA";

function convertText(text, map) {
  return text
    .toLowerCase()
    .split("")
    .map((char) => map[char] ?? char)
    .join("");
}

function getStyledNames(name) {
  const base = name.trim();
  if (!base) {
    return [];
  }

  const transformed = fontMaps.map((map) => convertText(base, map));
  const decorated = wrappers.map(([left, right]) => `${left}${base}${right}`);
  const combos = wrappers.map(([left, right], index) => `${left}${transformed[index % transformed.length]}${right}`);

  return [...new Set([base, ...transformed, ...decorated, ...combos])];
}

function renderList(list, values) {
  list.innerHTML = "";
  values.forEach((value) => {
    const clone = itemTemplate.content.cloneNode(true);
    clone.querySelector(".result-text").textContent = value;
    clone.querySelector(".copy-btn").addEventListener("click", () => copyText(value));
    list.appendChild(clone);
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => toast.classList.remove("show"), 1600);
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    showToast("Copied to clipboard");
  } catch {
    showToast("Clipboard blocked in this browser");
  }
}

function buildPresets(name) {
  return [
    `${name}࿐`,
    `ᶠᶠ•${name}`,
    `${name}ᴳᴬᴹᴱᴿ`,
    `ᴷᴵᴺᴳ々${name}`,
    `${name}メYT`,
    `꧁༒${name}༒꧂`,
    `${name}⚡PRO`,
    `『${name}』99`
  ];
}

function generate() {
  const typedName = nicknameInput.value.trim();
  const activeName = typedName || defaultPreviewName;
  const styled = getStyledNames(activeName);
  const presets = buildPresets(activeName);

  namePreview.textContent = `Preview: ${styled[0]}`;
  renderList(resultsList, styled);
  renderList(presetList, presets);
}

randomBtn.addEventListener("click", () => {
  const word = randomWords[Math.floor(Math.random() * randomWords.length)];
  const suffix = Math.floor(Math.random() * 90 + 10);
  nicknameInput.value = `${word}${suffix}`;
  generate();
});

clearBtn.addEventListener("click", () => {
  nicknameInput.value = "";
  generate();
});

generateBtn.addEventListener("click", generate);
nicknameInput.addEventListener("input", generate);
nicknameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    generate();
  }
});

generate();
