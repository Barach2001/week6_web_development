// SpendWise Week 6: interactive budget and expense tracker

const STORAGE_KEYS = {
  budget: "spendwise-budget",
  expenses: "spendwise-expenses"
};

// Arrays let us manage any number of expense records.
let expenses = [];
let monthlyBudget = 0;

const elements = {
  budgetForm: document.getElementById("budgetForm"),
  budgetInput: document.getElementById("budgetInput"),
  totalBudget: document.getElementById("totalBudget"),
  totalSpent: document.getElementById("totalSpent"),
  balanceLeft: document.getElementById("balanceLeft"),
  expenseCount: document.getElementById("expenseCount"),
  balanceMessage: document.getElementById("balanceMessage"),
  spendingPercent: document.getElementById("spendingPercent"),
  progressBar: document.getElementById("progressBar"),
  progressFill: document.getElementById("progressFill"),
  budgetFeedback: document.getElementById("budgetFeedback"),
  expenseForm: document.getElementById("expenseForm"),
  expenseName: document.getElementById("expenseName"),
  expenseAmount: document.getElementById("expenseAmount"),
  expenseCategory: document.getElementById("expenseCategory"),
  expenseDate: document.getElementById("expenseDate"),
  expenseList: document.getElementById("expenseList"),
  recordCount: document.getElementById("recordCount"),
  expenseSearch: document.getElementById("expenseSearch"),
  formMessage: document.getElementById("formMessage"),
  listFoot: document.getElementById("listFoot"),
  todayDate: document.getElementById("todayDate"),
  toast: document.getElementById("toast")
};

const formatMoney = (amount) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 2
  }).format(amount);

function loadSavedData() {
  // JSON.parse converts saved browser text back into JavaScript data.
  try {
    const savedBudget = Number(localStorage.getItem(STORAGE_KEYS.budget));
    const savedExpenses = JSON.parse(localStorage.getItem(STORAGE_KEYS.expenses) || "[]");

    monthlyBudget = Number.isFinite(savedBudget) && savedBudget > 0 ? savedBudget : 0;
    expenses = Array.isArray(savedExpenses) ? savedExpenses : [];
  } catch (error) {
    monthlyBudget = 0;
    expenses = [];
    console.warn("Saved SpendWise data could not be loaded.", error);
  }

  elements.budgetInput.value = monthlyBudget || "";
}

function saveData() {
  localStorage.setItem(STORAGE_KEYS.budget, String(monthlyBudget));
  localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(expenses));
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 2300);
}

function getTotalSpent() {
  // A loop processes each expense and adds its amount to the total.
  let total = 0;
  for (const expense of expenses) {
    total += Number(expense.amount) || 0;
  }
  return total;
}

function updateDashboard() {
  const totalSpent = getTotalSpent();
  const balance = monthlyBudget - totalSpent;
  const percent = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;
  const progressWidth = Math.min(Math.max(percent, 0), 100);

  elements.totalBudget.textContent = formatMoney(monthlyBudget);
  elements.totalSpent.textContent = formatMoney(totalSpent);
  elements.balanceLeft.textContent = formatMoney(balance);
  elements.expenseCount.textContent = `${expenses.length} recorded ${expenses.length === 1 ? "expense" : "expenses"}`;
  elements.recordCount.textContent = `${expenses.length} ${expenses.length === 1 ? "record" : "records"}`;
  elements.spendingPercent.textContent = `${Math.round(percent)}%`;
  elements.progressFill.style.width = `${progressWidth}%`;
  elements.progressFill.classList.toggle("over-budget", monthlyBudget > 0 && totalSpent > monthlyBudget);
  elements.progressBar.setAttribute("aria-valuenow", String(Math.round(progressWidth)));

  // Conditional statements decide which feedback the user should see.
  if (monthlyBudget <= 0) {
    elements.balanceMessage.textContent = "Set a budget to get started";
    elements.budgetFeedback.textContent = "Add a monthly budget to see how your expenses compare.";
  } else if (totalSpent > monthlyBudget) {
    elements.balanceMessage.textContent = "You are over budget";
    elements.budgetFeedback.textContent = `You have spent ${formatMoney(totalSpent - monthlyBudget)} more than your budget. Review your expenses.`;
  } else if (totalSpent === monthlyBudget) {
    elements.balanceMessage.textContent = "Budget fully used";
    elements.budgetFeedback.textContent = "You have used your full budget. Avoid adding extra spending if possible.";
  } else if (percent >= 80) {
    elements.balanceMessage.textContent = "Almost at your limit";
    elements.budgetFeedback.textContent = `You have used ${Math.round(percent)}% of your budget. Only ${formatMoney(balance)} remains, so spend carefully.`;
  } else {
    elements.balanceMessage.textContent = "Available to spend";
    elements.budgetFeedback.textContent = `You have used ${Math.round(percent)}% of your budget. ${formatMoney(balance)} is still available.`;
  }

  renderExpenses();
}

function renderExpenses() {
  const searchTerm = elements.expenseSearch.value.trim().toLowerCase();
  const visibleExpenses = expenses.filter((expense) =>
    expense.name.toLowerCase().includes(searchTerm) ||
    expense.category.toLowerCase().includes(searchTerm)
  );

  // Clear old rows before building the latest view.
  elements.expenseList.replaceChildren();

  if (visibleExpenses.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    const cell = document.createElement("td");
    cell.colSpan = 4;

    const icon = document.createElement("span");
    icon.className = "empty-icon";
    icon.textContent = "⌁";
    const title = document.createElement("strong");
    title.textContent = searchTerm ? "No matching expenses" : "No expenses yet";
    const message = document.createElement("span");
    message.textContent = searchTerm ? "Try another search term." : "Add your first expense to see it here.";

    cell.append(icon, title, message);
    row.appendChild(cell);
    elements.expenseList.appendChild(row);
    elements.listFoot.textContent = searchTerm ? "No records match your search." : "Your expense records will appear here.";
    return;
  }

  // Loop through the array to create a table row for every matching expense.
  for (const expense of visibleExpenses) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = expense.name;

    const dateCell = document.createElement("td");
    dateCell.textContent = formatDate(expense.date);

    const amountCell = document.createElement("td");
    amountCell.className = "amount-cell";
    amountCell.textContent = formatMoney(expense.amount);

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `Delete ${expense.name}`);
    deleteButton.addEventListener("click", () => deleteExpense(expense.id));

    const categoryTag = document.createElement("span");
    categoryTag.className = "category-tag";
    categoryTag.textContent = expense.category;
    nameCell.appendChild(document.createElement("br"));
    nameCell.appendChild(categoryTag);

    actionCell.appendChild(deleteButton);
    row.append(nameCell, dateCell, amountCell, actionCell);
    elements.expenseList.appendChild(row);
  }

  elements.listFoot.textContent = `Showing ${visibleExpenses.length} of ${expenses.length} expense records.`;
}

function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-KE", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function addExpense(event) {
  event.preventDefault();

  const name = elements.expenseName.value.trim();
  const amount = Number(elements.expenseAmount.value);
  const category = elements.expenseCategory.value;
  const date = elements.expenseDate.value;

  if (!name || !Number.isFinite(amount) || amount <= 0 || !date) {
    elements.formMessage.textContent = "Enter a name, a valid amount, and a date.";
    elements.formMessage.classList.add("error");
    return;
  }

  const newExpense = {
    id: `expense-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    amount,
    category,
    date
  };

  expenses.push(newExpense);
  saveData();
  elements.expenseForm.reset();
  elements.expenseDate.value = getTodayString();
  elements.formMessage.textContent = "Expense added successfully.";
  elements.formMessage.classList.remove("error");
  updateDashboard();
  showToast("Your expense has been added.");
}

function deleteExpense(expenseId) {
  const previousLength = expenses.length;
  expenses = expenses.filter((expense) => expense.id !== expenseId);

  if (expenses.length !== previousLength) {
    saveData();
    updateDashboard();
    showToast("Expense deleted.");
  }
}

function updateBudget(event) {
  event.preventDefault();
  const newBudget = Number(elements.budgetInput.value);

  if (!Number.isFinite(newBudget) || newBudget <= 0) {
    showToast("Please enter a budget greater than zero.");
    return;
  }

  monthlyBudget = newBudget;
  saveData();
  updateDashboard();
  showToast("Monthly budget updated.");
}

function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function initialiseSpendWise() {
  elements.todayDate.textContent = new Intl.DateTimeFormat("en-KE", {
    weekday: "short", day: "numeric", month: "short", year: "numeric"
  }).format(new Date());
  elements.expenseDate.value = getTodayString();
  loadSavedData();
  updateDashboard();

  // Event listeners connect user actions to JavaScript functions.
  elements.budgetForm.addEventListener("submit", updateBudget);
  elements.expenseForm.addEventListener("submit", addExpense);
  elements.expenseSearch.addEventListener("input", renderExpenses);
}

document.addEventListener("DOMContentLoaded", initialiseSpendWise);
