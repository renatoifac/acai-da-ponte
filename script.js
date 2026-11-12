// Edite esta configuração para adaptar o site à loja antes de publicar.
const CONFIG = {
  preview: true,
  whatsappNumber: "", // Ex.: "5568999999999" (país + DDD + número, somente dígitos)
  businessHours: {
    // Chaves: 0 = domingo, 1 = segunda, ... 6 = sábado. Formato 24h.
    // Exemplo: 1: [{ open: "10:00", close: "21:00" }]
  },
  sizes: [
    { id: "300ml", name: "Pequeno", volume: "300 ml", price: 1200, cupHeight: 24 },
    { id: "500ml", name: "Médio", volume: "500 ml", price: 1700, cupHeight: 32 },
    { id: "700ml", name: "Grande", volume: "700 ml", price: 2200, cupHeight: 40 }
  ],
  toppings: [
    { id: "banana", name: "Banana", price: 200 },
    { id: "granola", name: "Granola", price: 300 },
    { id: "leite-condensado", name: "Leite condensado", price: 250 },
    { id: "leite-em-po", name: "Leite em pó", price: 300 },
    { id: "pacoca", name: "Paçoca", price: 250 },
    { id: "morango", name: "Morango", price: 350 }
  ]
};

const state = { sizeId: null, toppingIds: [] };
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const weekdays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const sizeOptions = document.querySelector("#size-options");
const toppingOptions = document.querySelector("#topping-options");
const orderItems = document.querySelector("#order-items");
const totalElement = document.querySelector("#order-total");
const mobileTotalElement = document.querySelector("#mobile-total");
const toppingCounter = document.querySelector("#topping-counter");
const limitMessage = document.querySelector("#limit-message");
const resetButton = document.querySelector("#reset-order");
const whatsappButton = document.querySelector("#whatsapp-button");
const whatsappLabel = document.querySelector("#whatsapp-label");
const orderFootnote = document.querySelector("#order-footnote");
const feedback = document.querySelector("#message-feedback");
const resetDialog = document.querySelector("#reset-dialog");

function getSize(id) {
  return CONFIG.sizes.find((size) => size.id === id);
}

function getTopping(id) {
  return CONFIG.toppings.find((topping) => topping.id === id);
}

function money(cents) {
  return currency.format(cents / 100);
}

function renderSizes() {
  sizeOptions.innerHTML = CONFIG.sizes.map((size, index) => `
    <button class="size-option" type="button" role="radio" aria-checked="${state.sizeId === size.id}" tabindex="${state.sizeId === size.id || (!state.sizeId && index === 0) ? "0" : "-1"}" data-size-id="${size.id}">
      <span class="selected-check" aria-hidden="true">✓</span>
      <span class="size-visual" aria-hidden="true">
        <span class="size-cup" style="--cup-height:${size.cupHeight}px"></span>
        <span class="size-volume">${size.volume}</span>
      </span>
      <strong>${size.name}</strong>
      <span class="size-price">${money(size.price)}</span>
    </button>
  `).join("");
}

function renderToppings() {
  toppingOptions.innerHTML = CONFIG.toppings.map((topping) => {
    const selected = state.toppingIds.includes(topping.id);
    const limitReached = state.toppingIds.length >= 3 && !selected;
    return `
      <button class="topping-option" type="button" aria-pressed="${selected}" data-topping-id="${topping.id}" ${limitReached ? "disabled" : ""}>
        <span class="topping-check" aria-hidden="true">✓</span>
        <span class="topping-name">${topping.name}</span>
        <span class="topping-price">+ ${money(topping.price)}</span>
      </button>
    `;
  }).join("");
  toppingCounter.textContent = `${state.toppingIds.length} de 3`;
  limitMessage.textContent = state.toppingIds.length === 3 ? "Você já escolheu 3 complementos — remova um para trocar." : "";
}

function calculateTotal() {
  const size = getSize(state.sizeId);
  return (size ? size.price : 0) + state.toppingIds.reduce((total, id) => {
    const topping = getTopping(id);
    return total + (topping ? topping.price : 0);
  }, 0);
}

function renderOrder() {
  const size = getSize(state.sizeId);
  const selectedToppings = state.toppingIds.map(getTopping).filter(Boolean);
  const lines = [];
  if (size) {
    lines.push(`
      <div class="order-line">
        <div><span class="item-bullet" aria-hidden="true">•</span><span>${size.name} · ${size.volume}</span></div>
        <strong>${money(size.price)}</strong>
        <button class="remove-item" type="button" aria-label="Remover tamanho ${size.name}" data-remove-size>×</button>
      </div>
    `);
  }
  selectedToppings.forEach((topping) => {
    lines.push(`
      <div class="order-line">
        <div><span class="item-bullet" aria-hidden="true">•</span><span>${topping.name}</span></div>
        <strong>${money(topping.price)}</strong>
        <button class="remove-item" type="button" aria-label="Remover ${topping.name}" data-remove-topping="${topping.id}">×</button>
      </div>
    `);
  });
  orderItems.innerHTML = lines.length ? lines.join("") : '<p class="empty-order">Seu pedido começa com um tamanho de copo. Depois, escolha seus complementos favoritos.</p>';
  const total = money(calculateTotal());
  totalElement.textContent = total;
  mobileTotalElement.textContent = total;
  resetButton.disabled = lines.length === 0;
  whatsappButton.disabled = !state.sizeId || !isValidWhatsAppNumber(CONFIG.whatsappNumber);
}

function isValidWhatsAppNumber(number) {
  return /^\d{12,13}$/.test(number);
}

function renderWhatsAppState() {
  if (!isValidWhatsAppNumber(CONFIG.whatsappNumber)) {
    whatsappLabel.textContent = "Configure o WhatsApp para ativar";
    orderFootnote.innerHTML = 'Configure o número da loja no arquivo <code>script.js</code> antes de publicar.';
    return;
  }
  whatsappLabel.textContent = "Enviar pedido pelo WhatsApp";
  orderFootnote.textContent = "Você confirma o envio pelo WhatsApp.";
}

function renderHours() {
  const list = document.querySelector("#hours-list");
  const status = document.querySelector("#store-status");
  const label = document.querySelector("#status-label");
  const nextOpening = document.querySelector("#next-opening");
  const entries = weekdays.map((day, index) => {
    const intervals = CONFIG.businessHours[index] || [];
    const value = intervals.length
      ? intervals.map((interval) => `${interval.open}–${interval.close}`).join(", ")
      : "Fechado";
    return { day, intervals, value, index };
  });
  list.innerHTML = entries.map(({ day, value }) => `<li><span>${day}</span><span>${value}</span></li>`).join("");

  const nowParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Rio_Branco",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(new Date());
  const weekdayShort = nowParts.find((part) => part.type === "weekday").value;
  const weekdayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekdayShort);
  const nowMinutes = Number(nowParts.find((part) => part.type === "hour").value) * 60
    + Number(nowParts.find((part) => part.type === "minute").value);
  const todayIntervals = CONFIG.businessHours[weekdayIndex] || [];
  const openNow = todayIntervals.some((interval) => {
    const [openHour, openMinute] = interval.open.split(":").map(Number);
    const [closeHour, closeMinute] = interval.close.split(":").map(Number);
    return nowMinutes >= openHour * 60 + openMinute && nowMinutes < closeHour * 60 + closeMinute;
  });

  status.classList.toggle("is-open", openNow);
  status.classList.toggle("is-closed", Object.keys(CONFIG.businessHours).length > 0 && !openNow);
  label.textContent = Object.keys(CONFIG.businessHours).length === 0
    ? "Horário a definir"
    : openNow ? "Aberto agora" : "Fechado agora";
  nextOpening.textContent = "";
  if (!openNow && Object.keys(CONFIG.businessHours).length > 0) {
    for (let dayOffset = 0; dayOffset <= 7; dayOffset += 1) {
      const dayIndex = (weekdayIndex + dayOffset) % 7;
      const intervals = CONFIG.businessHours[dayIndex] || [];
      const upcoming = intervals
        .map((interval) => ({ interval, minutes: interval.open.split(":").map(Number).reduce((hours, value, index) => hours + value * (index === 0 ? 60 : 1), 0) }))
        .filter(({ minutes }) => dayOffset > 0 || minutes > nowMinutes)
        .sort((a, b) => a.minutes - b.minutes)[0];
      if (!upcoming) continue;
      const [hour, minute] = upcoming.interval.open.split(":");
      const dayLabel = dayOffset === 0 ? "hoje" : dayOffset === 1 ? "amanhã" : weekdays[dayIndex].toLowerCase();
      nextOpening.textContent = `Abre ${dayLabel} às ${hour}:${minute}`;
      break;
    }
  }
}

function render() {
  document.querySelector("#preview-notice").hidden = !CONFIG.preview;
  renderSizes();
  renderToppings();
  renderOrder();
  renderWhatsAppState();
}

function focusMenuControl(selector) {
  const control = document.querySelector(selector);
  if (control) control.focus();
}

sizeOptions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-size-id]");
  if (!button) return;
  state.sizeId = button.dataset.sizeId;
  render();
  focusMenuControl(`[data-size-id="${state.sizeId}"]`);
});

sizeOptions.addEventListener("keydown", (event) => {
  const current = event.target.closest("[data-size-id]");
  if (!current) return;
  const buttons = [...sizeOptions.querySelectorAll("[data-size-id]")];
  const index = buttons.indexOf(current);
  let nextIndex = index;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % buttons.length;
  else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + buttons.length) % buttons.length;
  else if (event.key === "Home") nextIndex = 0;
  else if (event.key === "End") nextIndex = buttons.length - 1;
  else return;
  event.preventDefault();
  state.sizeId = buttons[nextIndex].dataset.sizeId;
  render();
  focusMenuControl(`[data-size-id="${state.sizeId}"]`);
});

toppingOptions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-topping-id]");
  if (!button || button.disabled) return;
  const id = button.dataset.toppingId;
  if (state.toppingIds.includes(id)) {
    state.toppingIds = state.toppingIds.filter((selectedId) => selectedId !== id);
  } else if (state.toppingIds.length < 3) {
    state.toppingIds = [...state.toppingIds, id];
  }
  render();
  focusMenuControl(`[data-topping-id="${id}"]`);
});

orderItems.addEventListener("click", (event) => {
  if (event.target.closest("[data-remove-size]")) {
    state.sizeId = null;
  } else {
    const removeButton = event.target.closest("[data-remove-topping]");
    if (!removeButton) return;
    state.toppingIds = state.toppingIds.filter((id) => id !== removeButton.dataset.removeTopping);
  }
  render();
});

resetButton.addEventListener("click", () => {
  if (state.sizeId || state.toppingIds.length) resetDialog.showModal();
});

resetDialog.addEventListener("close", () => {
  if (resetDialog.returnValue !== "confirm") return;
  state.sizeId = null;
  state.toppingIds = [];
  feedback.textContent = "";
  render();
});

document.querySelector("#hours-toggle").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const popover = document.querySelector("#hours-popover");
  const expanded = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!expanded));
  popover.hidden = expanded;
});

document.addEventListener("click", (event) => {
  const hoursWrap = document.querySelector(".hours-wrap");
  if (hoursWrap.contains(event.target)) return;
  document.querySelector("#hours-popover").hidden = true;
  document.querySelector("#hours-toggle").setAttribute("aria-expanded", "false");
});

whatsappButton.addEventListener("click", () => {
  const size = getSize(state.sizeId);
  if (!size || !isValidWhatsAppNumber(CONFIG.whatsappNumber)) return;
  const toppings = state.toppingIds.map(getTopping).filter(Boolean);
  const messageLines = [
    "Olá! Quero fazer um pedido para retirada na Açaí da Ponte:",
    "",
    `• ${size.name} (${size.volume}) — ${money(size.price)}`,
    ...toppings.map((topping) => `• ${topping.name} — ${money(topping.price)}`),
    "",
    `Total: ${money(calculateTotal())}`
  ];
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(messageLines.join("\n"))}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

render();
renderHours();
setInterval(renderHours, 60_000);
