# SpendWise — Week 6: Make It Interactive

SpendWise is a personal budget and expense tracker built with HTML, CSS, and vanilla JavaScript. This Week 6 version makes the dashboard interactive: users can set a monthly budget, add and delete expenses, search records, and see their totals and budget status update on the page.

## Project files

- `index.html` — page structure, budget summary, expense form, and transaction table.
- `style.css` — responsive layout, colours, typography, and component styling.
- `script.js` — expense data, calculations, conditions, loops, DOM updates, events, and browser storage.

## Improvements made this week

- Added a monthly budget form.
- Added an expense form with name, amount, category, and date.
- Added live summary cards for budget, spending, and remaining balance.
- Added a spending progress bar and conditional budget feedback.
- Added an expense table with delete buttons and search.
- Added browser `localStorage` so the budget and expense records remain after refreshing the page.
- Added responsive styling for smaller screens.

## How conditionals are used

The `if / else if / else` statements in `updateDashboard()` check the budget and total expenses. They display different messages when no budget has been set, when spending is over budget, when the full budget has been used, when 80% or more has been used, or when spending is within the safer range.

Validation conditions in `addExpense()` and `updateBudget()` also prevent empty names and invalid or zero amounts from being saved.

## How arrays are used to store data

The `expenses` array stores expense objects. Each object contains an ID, name, amount, category, and date. The `push()` method adds a new expense, while `filter()` creates the remaining list when an expense is deleted or the user searches. This allows the application to manage many records instead of using separate variables for each expense.

## How loops process records

The `for...of` loop in `getTotalSpent()` visits every expense and adds its amount to the total. Another `for...of` loop in `renderExpenses()` creates a table row for each matching expense and displays it on the page.

## How the DOM is updated

JavaScript selects page elements with `document.getElementById()`. The `updateDashboard()` function changes the summary text, progress percentage, progress bar width, and budget feedback. The `renderExpenses()` function creates table rows with `document.createElement()`, fills them with `textContent`, and adds them to the table. The page is updated directly instead of only printing results in the console.

## How user interactions are handled through events

- The budget form listens for the `submit` event and calls `updateBudget()`.
- The expense form listens for the `submit` event and calls `addExpense()`.
- Each delete button listens for a `click` event and calls `deleteExpense()`.
- The search input listens for an `input` event and calls `renderExpenses()`.

The form submission handlers use `event.preventDefault()` so the browser does not reload the page before JavaScript processes the data.

## Challenges and how they were resolved

- **Keeping totals correct after changes:** the dashboard recalculates totals from the current expenses array whenever an expense is added or deleted.
- **Showing the right budget message:** conditional statements check the budget status and choose the appropriate feedback.
- **Displaying changing records:** the table is cleared and rebuilt from the array after each change, so it stays in sync with the data.
- **Keeping data after refresh:** the application saves the budget and expense array in `localStorage` and loads them when the page starts.
- **Displaying user-entered text safely:** expense names are inserted with `textContent` rather than interpreting them as HTML.

## How to run the project

1. Download or clone this repository.
2. Keep `index.html`, `style.css`, and `script.js` in the same folder.
3. Open `index.html` in a modern web browser.
4. Enter a monthly budget, then add expenses and try searching or deleting a record.

No framework or package installation is required. Google Fonts is used for typography when an internet connection is available; the application itself runs with local HTML, CSS, and JavaScript.

## Testing checklist

- [ ] Set a monthly budget and confirm the budget card updates.
- [ ] Add an expense and confirm the table and totals update.
- [ ] Add more than one expense and confirm the total is calculated correctly.
- [ ] Search by expense name or category.
- [ ] Delete an expense and confirm the totals update.
- [ ] Test the under-budget, near-limit, fully-used, and over-budget messages.
- [ ] Refresh the browser and confirm saved data is restored.
- [ ] Check the layout on a mobile-sized screen.

## Submission

Repository: https://github.com/Barach2001/week6_web_development

After testing, submit the public repository URL through the LMS.
