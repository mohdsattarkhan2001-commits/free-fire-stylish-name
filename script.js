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

const randomWords = ["Ghost", "Ninja", "Sniper", "Raven", "Venom", "Blaze", "Storm", "Killer", "Hunter", "Viper", "Cobra", "Titan"];
const freeFireNames = ["Alok", "Kelly", "Hayato", "Moco", "Chrono", "Skyler", "K", "Dimitri", "Tatsuya", "Jota", "Hunter", "Ninja", "Blaze", "Phantom"];

function getRandomName() {
  const word = randomWords[Math.floor(Math.random() * randomWords.length)];
  const suffix = Math.floor(Math.random() * 90 + 10);
  return `${word}${suffix}`;
}

let defaultPreviewName = getRandomName();
let defaultStyledCatalog = [];

function convertText(text, map) {
  return text
    .toLowerCase()
    .split("")
    .map((char) => map[char] ?? char)
    .join("");
}

function getStyledNames(name, maxCount = 100) {
  const base = name.trim();
  if (!base) {
    return [];
  }

  const transformed = fontMaps.map((map) => convertText(base, map));
  const coreNames = [...new Set([base, ...transformed, base.toUpperCase(), `${base}亗`, `${base}ツ`, `${base}メ`])];
  const prefixes = ["亗", "乂", "『", "⚡", "꧁", "★", "♛", "ツ", "༒", "FF", "ᴷᴵᴺᴳ", "ᶠᶠ"];
  const suffixes = ["亗", "乂", "』", "⚡", "꧂", "★", "♛", "ツ", "༒", "99", "YT", "PRO", "メ"];
  const tags = ["FF", "OP", "PRO", "KING", "YT", "X", "007"];
  const styles = new Set();

  const addStyle = (value) => {
    const trimmed = value.trim();
    if (trimmed) {
      styles.add(trimmed);
    }
  };

  coreNames.forEach((core) => {
    addStyle(core);
    wrappers.forEach(([left, right]) => {
      addStyle(`${left}${core}${right}`);
    });
  });

  for (const core of coreNames) {
    for (const prefix of prefixes) {
      for (const suffix of suffixes) {
        addStyle(`${prefix}${core}${suffix}`);
        if (styles.size >= maxCount) {
          return [...styles].slice(0, maxCount);
        }
      }
    }
  }

  for (const core of coreNames) {
    for (const tag of tags) {
      addStyle(`${tag}•${core}`);
      addStyle(`${core}•${tag}`);
      addStyle(`${tag}々${core}々${tag}`);
      if (styles.size >= maxCount) {
        return [...styles].slice(0, maxCount);
      }
    }
  }

  while (styles.size < maxCount) {
    addStyle(`${base}${styles.size}`);
  }

  return [...styles].slice(0, maxCount);
}

function buildDefaultStyles(targetCount = 100) {
  const styles = new Set();
  const candidateNames = [defaultPreviewName, ...freeFireNames.map((name) => `${name}${Math.floor(Math.random() * 90 + 10)}`)];

  candidateNames.forEach((candidate) => {
    getStyledNames(candidate, 10).forEach((style) => {
      if (styles.size < targetCount) {
        styles.add(style);
      }
    });
  });

  while (styles.size < targetCount) {
    getStyledNames(getRandomName(), 10).forEach((style) => {
      if (styles.size < targetCount) {
        styles.add(style);
      }
    });
  }

  return [...styles].slice(0, targetCount);
}

function renderList(list, values) {
  list.innerHTML = "";
  values.forEach((value) => {
    const clone = itemTemplate.content.cloneNode(true);
    const textNode = clone.querySelector(".result-text");
    textNode.textContent = value;
    textNode.title = value;
    const copyBtn = clone.querySelector(".copy-btn");
    copyBtn.addEventListener("click", () => copyText(value, copyBtn));
    list.appendChild(clone);
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => toast.classList.remove("show"), 1600);
}

async function copyText(value, button) {
  try {
    await navigator.clipboard.writeText(value);
    if (button) {
      button.classList.add("copied");
      window.setTimeout(() => button.classList.remove("copied"), 450);
    }
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
  const styled = typedName ? getStyledNames(activeName, 100) : defaultStyledCatalog;
  const presets = buildPresets(activeName);

  if (namePreview) {
    namePreview.textContent = `Preview: ${styled[0] ?? activeName}`;
  }
  renderList(resultsList, styled);
  renderList(presetList, presets);
}

randomBtn.addEventListener("click", () => {
  nicknameInput.value = getRandomName();
  generate();
});

clearBtn.addEventListener("click", () => {
  nicknameInput.value = "";
  defaultPreviewName = getRandomName();
  defaultStyledCatalog = buildDefaultStyles(100);
  generate();
});

generateBtn.addEventListener("click", generate);
nicknameInput.addEventListener("input", generate);
nicknameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    generate();
  }
});

defaultStyledCatalog = buildDefaultStyles(100);
generate();
