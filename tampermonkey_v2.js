// ==UserScript==
// @name         Populate_Photos_v1
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Populate various forms based on URL, with SPA support and dynamic button
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

function toggleCheckbox(selectorString,  logArea) {
  // const wrapper = document.querySelector('[data-testid="agreement-checkbox"]');
    const wrapper = document.querySelector(selectorString)
  if (!wrapper) {
    logArea.value += `[TM]  checkbox not found\n`;
    return;
  }

  const isChecked = wrapper.getAttribute("aria-checked") === "true";
  logArea.value += `[TM] Checkbox is currently ${isChecked ? 'checked' : 'unchecked'}\n`;

  if (!isChecked) {
    wrapper.click();
    logArea.value += `[TM] Checkbox clicked to check it\n`;
  } else {
    logArea.value += `[TM] Checkbox already checked — no action taken\n`;
  }

  logArea.scrollTop = logArea.scrollHeight;
}


function setInputField(selectorString, whatToWrite) {
  const input = document.querySelector(selectorString);
  if (!input) {
    console.warn('[TM] Input not found: ' + selectorString);
    return;
  }

  input.focus();
  input.value = whatToWrite;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.blur();
}

 function qSelect(selectorString, stateName) {
    // Step 1: Find the q-select wrapper by its test ID
    const wrapper = document.querySelector(selectorString);
    if (!wrapper) {
      console.warn('[TM] Could not find the state q-select');
      return;
    }

    // Step 2: Click the q-select to open the dropdown
    wrapper.click();

    // Step 3: Wait for the dropdown options to appear
    const observer = new MutationObserver(() => {
      const options = Array.from(document.querySelectorAll('.q-item__label'));
      const alabamaOption = options.find(opt => opt.textContent.trim() === stateName);

      if (alabamaOption) {
        console.log('[TM] Clicking ' + stateName);
        alabamaOption.click();
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

const firstNamesArray = ["Moon", "Water", "Sky", "Mood", "Ocean", "Dirt", "Dust", "Cloud"];
const middleNamesArray = ["A", "B", "C", "", ""];
let logArea = document.createElement("textarea");

function createUI() {
  if (document.getElementById("tm-multi-input-logger")) return;

  const container = document.createElement("div");
  Object.assign(container.style, {
    position: "fixed",
    top: "100px",
    left: "10px",
    width: "420px",
    background: "white",
    border: "1px solid #ccc",
    padding: "8px",
    zIndex: "2147483647",
    boxShadow: "0 0 8px rgba(0,0,0,0.2)",
    fontFamily: "Arial, sans-serif",
    fontSize: "12px",
    lineHeight: "1.2",
  });

  Object.assign(logArea.style, {
    width: "100%",
    height: "220px",
    resize: "none",
    marginBottom: "8px",
    border: "1px solid #bbb",
    backgroundColor: "#f9f9f9",
    fontSize: "12px",
  });
  logArea.id = "tm-multi-input-logger";

  const btn = document.createElement("button");
  btn.id = "tm-multi-populate-btn";
  Object.assign(btn.style, {
    padding: "4px 8px",
    fontSize: "12px",
    cursor: "pointer",
  });
  btn.addEventListener("click", () => {
    const { handler } = getPopulateConfig(window.location.pathname);
    handler(logArea);
  });

  const btn2 = document.createElement("button");
  Object.assign(btn2.style, {
    padding: "4px 8px",
    fontSize: "12px",
    cursor: "pointer",
  });
  const showing = "showing";
  const hiding = "hiding";
  let state = showing;
  btn2.addEventListener("click", () => {
    if (state === showing) {
      state = hiding;
      logArea.style.display = "none";
    } else {
      state = showing;
      logArea.style.display = "";
    }
  });
  btn2.textContent = "Hide/Show";

  container.append(logArea, btn, btn2);
  document.body.appendChild(container);
  const { btnText } = getPopulateConfig(window.location.pathname);
  btn.textContent = btnText;
}

function waitForBodyAndCreateUI() {
  if (!document.body) return setTimeout(waitForBodyAndCreateUI, 50);
  createUI();
}
waitForBodyAndCreateUI();

// Optional: re-insert UI if SPA clears DOM
// function ensureUIPersists() {
//   if (!document.getElementById("tm-multi-input-logger")) {
//     waitForBodyAndCreateUI();
//   }
//   setTimeout(ensureUIPersists, 1000);
// }
// ensureUIPersists();

function getRandom10Letters(length = 10) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
}

function randomFromArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function populateDefault(logArea) {
  logArea.value += `No specialized populate function for this page.\n`;
}

function selectOption(value, opts) {
  let input;
  if (opts.label)
    input = document.querySelector(`input[aria-label="${opts.label}"]`);
  else if (opts.selector) input = document.querySelector(opts.selector);
  if (!input) {
    logArea.value += `Combobox not found for ${opts.label || opts.selector}\n`;
    return;
  }
  input.click();
  const panelId = input.getAttribute("aria-controls");
  let retries = 10;
  (function attempt() {
    const panel = document.getElementById(panelId);
    const items = panel?.querySelectorAll('[role="option"]') || [];
    if ((!panel || !items.length) && --retries > 0) {
      return setTimeout(attempt, 50);
    }
    if (!panel || !items.length) {
      logArea.value += `${opts.label || opts.selector} panel/options missing\n`;
      return;
    }
    const match = Array.from(items).find(
      (item) =>
        item.querySelector(".q-item__label span")?.textContent.trim() ===
        String(value)
    );
    (match || items[0]).click();
    logArea.value += `${opts.label || opts.selector}: "${match ? value : "<first>"}"\n`;
  })();
}

async function populateSignup(logArea) {
  try {
    const mobile = document.querySelector('input[data-test-id="mobile-phone-input"]');
    if (mobile) {
      const phoneNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
      mobile.value = phoneNumber;
      mobile.dispatchEvent(new Event("input", { bubbles: true }));
      logArea.value += `Mobile Phone: set to "${phoneNumber}"\n`;
    }

    const allInputs = document.querySelectorAll("input");
    const fn = randomFromArray(firstNamesArray);
    const mn = randomFromArray(middleNamesArray);
    const ln = getRandom10Letters();
    const names = { 0: fn, 1: mn, 2: ln };

    allInputs.forEach((el, i) => {
      if (names[i] != null) {
        el.value = names[i];
        el.dispatchEvent(new Event("input", { bubbles: true }));
        logArea.value += `Index ${i}: set to "${names[i]}"\n`;
      }
    });

    const email = document.querySelector('input[data-test-id="email-input"]');
    if (email) {
      email.value = `${fn}.${ln}@something.com`;
      email.dispatchEvent(new Event("input", { bubbles: true }));
      logArea.value += `Email: set to "${email.value}"\n`;
    }

    const group = document.querySelector('div[data-test-id="contact-preference"]');
    if (group) {
      const opt = group.querySelector('div[role="radio"]');
      if (opt) {
        opt.click();
        logArea.value += `Contact Preference: set to "Email"\n`;
      }
    }

    selectOption("10", { label: "Month" });
    selectOption("10", { label: "Day" });
    selectOption("2010", { label: "Year" });
    selectOption("United States of America", {
      selector: 'div[data-testid="countries-dropdown-select"] input[role="combobox"]',
    });
    selectOption("Jr", {
      selector: '#name-entry-suffix-q-select input[role="combobox"]',
    });

    const cb = document.querySelector("div.q-checkbox__bg.absolute");
    if (cb) {
      const checkboxWrapper = cb.closest('.q-checkbox');
      const isChecked = checkboxWrapper?.classList.contains('q-checkbox--truthy');
        logArea.value += "CB " + checkboxWrapper?.classList
      if (!isChecked) {
        cb.click();
        logArea.value += `Checkbox was not checked — now clicked\n`;
      } else {
        logArea.value += `Checkbox already checked — no action taken\n`;
      }
    } else {
      logArea.value += `Checkbox not found\n`;
    }

    // Give the DOM a chance to settle before clicking "Sign Up"
    await sleep(300);
    clickByText(logArea, "span.block", "Sign Up");
    logArea.scrollTop = logArea.scrollHeight;
  } catch (err) {
    logArea.value += `Signup error: ${err.message}\n`;
  }

  logArea.scrollTop = logArea.scrollHeight;
}

async function populateLegalname(logArea) {
  try {
    setTimeout(() => {
      clickByText(logArea, "span.block", "Next");
      logArea.scrollTop = logArea.scrollHeight;
    }, 100);
  } catch (boom) {
    logArea.value += boom.message + "\n";
  }
}

async function clickNextWithRetries(selector, retries = 3, delay = 100) {
  for (let i = 0; i < retries; i++) {
    const btn = document.querySelector(selector);
    logArea.value += "trying to press Next\n";
    if (btn && !btn.disabled) {
      btn.click();
      return true;
    }
    await sleep(delay);
  }
  logArea.value += `Failed to click ${selector} after ${retries} attempts\n`;
  return false;
}

function populateBirthAndCitizenship() {
  try {
    // selectOption("countrycitystateselector-state-q-select", "Alabama"); // finch
    qSelect('[aria-testid="countrycitystateselector-state-q-select"]', 'Alabama')
    setInputField('[aria-testid="webcountrycitystateselector-city-q-input"]', 'Urbana')
    clickNextWithRetries("#navigationbuttons-rightbutton-q-btn");
  } catch (boom) {
    logArea.value += boom.message + "\n";
  }
}

function populateLocation(logArea) {
  try {
    const container = document.querySelector("div.col.scroll.q-pa-md");
    const firstCard = container?.querySelector("div.location-card");
    if (firstCard) {
      firstCard.click();
      logArea.value += `First location card clicked\n`;
      setTimeout(() => {
        clickByText(logArea, "span.block", "Next");
        logArea.scrollTop = logArea.scrollHeight;
      }, 100);
    } else {
      logArea.value += `No location cards found\n`;
    }
  } catch (err) {
    logArea.value += `Error in populateLocation: ${err.message}\n`;
  }
  logArea.scrollTop = logArea.scrollHeight;
}
function populateEligibility(logArea) {
    try {
        toggleCheckbox('[data-testid="agreement-checkbox"]',  logArea)
    } catch ( err ) {
      logArea.value += "Eligibility err: " + err
    }
}
function clickByText(logArea, selector, text) {
  const el = Array.from(document.querySelectorAll(selector)).find(
    (el) => el.textContent.trim() === text
  );
  if (el) {
    el.click();
    logArea.value += `Clicked "${text}"\n`;
  } else {
    logArea.value += `"${text}" not found for selector "${selector}"\n`;
  }
}

function getPopulateConfig(pathname) {
  const path = pathname.toLowerCase();

  switch (true) {
    case path.endsWith("/location"):
      return { handler: populateLocation, btnText: "Populate Location" };
    case path.endsWith("/signup") || path === "/":
      return { handler: populateSignup, btnText: "Populate Signup" };
    case path.endsWith("/legalname"):
      return { handler: populateLegalname, btnText: "Populate LegalName" };
    case path.endsWith("/birthandcitizenship"):
      return { handler: populateBirthAndCitizenship, btnText: "Populate Birth & Citizenship" };
    case path.endsWith("/eligibility"):
      return { handler: populateEligibility, btnText: "Populate Eligibility" };
    default:
      return { handler: populateDefault, btnText: "?? " + pathname };
  }
}
function setToggleSwitchByIndex(selector, state, index) {
  const wrappers = document.querySelectorAll(selector);
  const wrapper = wrappers[index];
  const checkbox = wrapper?.querySelector('input[type="checkbox"]');
  const shouldBeChecked = state.toLowerCase() === "yes";
  if (checkbox && checkbox.checked !== shouldBeChecked) {
    checkbox.click();
  }
}

// Monitor SPA URL changes
(function () {
  ["pushState", "replaceState"].forEach((fn) => {
    const orig = history[fn];
    history[fn] = function () {
      const ret = orig.apply(this, arguments);
      window.dispatchEvent(new Event("locationchange"));
      return ret;
    };
  });

  window.addEventListener("popstate", () =>
    window.dispatchEvent(new Event("locationchange"))
  );

  window.addEventListener("locationchange", () => {
    const btn = document.getElementById("tm-multi-populate-btn");
    if (logArea) {
      logArea.value = window.location.href + "\n";
      logArea.scrollTop = logArea.scrollHeight;
    }
    if (btn) {
      const { btnText } = getPopulateConfig(window.location.pathname);
      btn.textContent = btnText;
    }
  });
})();
