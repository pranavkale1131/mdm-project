const monthlyBtn = document.getElementById("monthlyBtn");
const yearlyBtn = document.getElementById("yearlyBtn");
const prices = document.querySelectorAll(".price");
const billingNote = document.getElementById("billingNote");
const proBilled = document.getElementById("proBilled");
const businessBilled = document.getElementById("businessBilled");
const checkoutModal = document.getElementById("checkoutModal");
const closeModalButton = document.querySelector(".close-modal");
const selectedPlanName = document.getElementById("selectedPlanName");
const selectedPlanPrice = document.getElementById("selectedPlanPrice");
const selectedPlanMeta = document.getElementById("selectedPlanMeta");
const payButton = document.querySelector(".pay-button");
const checkoutTriggers = document.querySelectorAll(".open-checkout");
const paymentMethodButtons = document.querySelectorAll(".payment-method");
const paymentPanels = document.querySelectorAll(".payment-panel");

let activeBilling = "monthly";

function setBillingPeriod(period) {
  const isYearly = period === "yearly";
  activeBilling = period;

  monthlyBtn.classList.toggle("active", !isYearly);
  yearlyBtn.classList.toggle("active", isYearly);
  monthlyBtn.setAttribute("aria-pressed", String(!isYearly));
  yearlyBtn.setAttribute("aria-pressed", String(isYearly));

  prices.forEach((price) => {
    const amount = isYearly ? price.dataset.yearly : price.dataset.monthly;
    price.textContent = Number(amount).toLocaleString("en-IN");
  });

  document.querySelectorAll(".period").forEach((label) => {
    label.textContent = "/ month";
  });

  billingNote.textContent = isYearly
    ? "Yearly billing selected — save 20% on paid plans."
    : "Flexible monthly billing. Cancel anytime.";

  proBilled.textContent = isYearly ? "₹7,668 billed annually" : "Billed monthly";
  businessBilled.textContent = isYearly ? "₹19,188 billed annually" : "Billed monthly";

  if (checkoutModal.classList.contains("show")) {
    const currentPlan = selectedPlanName.textContent;
    const amount = isYearly ? Number(getPlanPrice(currentPlan, "yearly")) : Number(getPlanPrice(currentPlan, "monthly"));
    const metaText = amount === 0 ? "Free forever" : isYearly ? "billed annually" : "/ month";
    updateCheckoutSummary(currentPlan, amount, metaText);
  }
}

function getPlanPrice(planName, billingType) {
  const button = document.querySelector(`.open-checkout[data-plan-name="${planName}"]`);
  if (!button) return 0;

  const amount = billingType === "yearly" ? button.dataset.yearly : button.dataset.monthly;
  return Number(amount || 0);
}

function updateCheckoutSummary(planName, amount, metaText) {
  selectedPlanName.textContent = planName;
  selectedPlanPrice.textContent = amount === 0 ? "₹0" : `₹${Number(amount).toLocaleString("en-IN")}`;
  selectedPlanMeta.textContent = metaText;

  payButton.textContent = amount === 0 ? "Start free" : `Pay ₹${Number(amount).toLocaleString("en-IN")} now`;
}

function openCheckoutModal(event) {
  event.preventDefault();
  const trigger = event.currentTarget;
  const planName = trigger.dataset.planName || "Professional";
  const amount = activeBilling === "yearly" ? Number(trigger.dataset.yearly || 0) : Number(trigger.dataset.monthly || 0);
  const metaText = amount === 0 ? "Free forever" : activeBilling === "yearly" ? "billed annually" : "/ month";

  updateCheckoutSummary(planName, amount, metaText);
  checkoutModal.classList.add("show");
  checkoutModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeCheckoutModal() {
  checkoutModal.classList.remove("show");
  checkoutModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function setPaymentMethod(method) {
  paymentMethodButtons.forEach((button) => {
    const isActive = button.dataset.method === method;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  paymentPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === method);
  });
}

monthlyBtn.addEventListener("click", () => setBillingPeriod("monthly"));
yearlyBtn.addEventListener("click", () => setBillingPeriod("yearly"));
checkoutTriggers.forEach((trigger) => trigger.addEventListener("click", openCheckoutModal));
paymentMethodButtons.forEach((button) => {
  button.addEventListener("click", () => setPaymentMethod(button.dataset.method));
});
closeModalButton.addEventListener("click", closeCheckoutModal);
checkoutModal.addEventListener("click", (event) => {
  if (event.target === checkoutModal) {
    closeCheckoutModal();
  }
});

document.getElementById("paymentForm").addEventListener("submit", (event) => {
  event.preventDefault();
  payButton.textContent = "Payment secured";
  payButton.disabled = true;
  payButton.classList.add("success");
  setTimeout(() => {
    closeCheckoutModal();
    const resetMessage = selectedPlanPrice.textContent === "₹0" ? "Start free" : `Pay ${selectedPlanPrice.textContent} now`;
    payButton.textContent = resetMessage;
    payButton.disabled = false;
    payButton.classList.remove("success");
  }, 1400);
});

setPaymentMethod("card");
updateCheckoutSummary("Professional", 799, "/ month");
