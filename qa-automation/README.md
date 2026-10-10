# Employee Management System – QA Automation Testing

A Python-based Selenium WebDriver automation testing project for an Employee Management System developed using Angular, ASP.NET Core Web API, and PostgreSQL.

The project focuses on validating application functionality, user authentication, employee CRUD operations, form validation, search functionality, and role-based access control through automated browser testing.

## Tech Stack

- **Programming Language:** Python 3.12
- **Automation Tool:** Selenium WebDriver
- **Testing Framework:** Pytest
- **Design Pattern:** Page Object Model (POM)
- **Reporting:** pytest-html
- **Version Control:** Git and GitHub
- **Application Under Test:** Angular, ASP.NET Core, PostgreSQL

## Test Coverage

The automation suite contains **21 test cases**, including:

| Module | Automated Tests |
|---|---:|
| Application Launch | 1 |
| Authentication | 4 |
| Employee Form | 3 |
| Employee CRUD | 3 |
| Employee Search | 2 |
| Role-Based Authorization | 1 |
| Dashboard Role Validation | 2 |
| Employee Form Rules | 5 |
| **Total** | **21** |

### Features Tested

- Valid and invalid user login
- Required field validation
- Admin and employee dashboard access
- Employee creation, modification, and deletion
- Employee search with existing and nonexistent records
- Email and employee code validation
- Salary boundary validation
- Department and designation dependency
- Frontend role-based authorization

## Automation Framework

The project uses reusable Selenium components and Page Object Model classes to improve test readability and maintainability.

**Main components:**

- `pages/` – Reusable page objects for login and employee form interactions
- `tests/` – Automated test cases
- `conftest.py` – Shared browser fixture and failure screenshot hook
- `screenshots/` – Screenshots captured during failed tests
- `reports/` – Generated HTML execution reports
- `requirements.txt` – Python package dependencies

## Installation and Setup

**Prerequisites:** Python 3.12, Google Chrome, Node.js, .NET SDK, and PostgreSQL.

1. Clone the Employee Management System repository.
2. Open a terminal inside the `qa-automation` directory.
3. Create a virtual environment using `py -3.12 -m venv .venv`.
4. Activate it using `.\.venv\Scripts\Activate.ps1`.
5. Install dependencies using `python -m pip install -r requirements.txt`.
6. Start the Angular frontend, .NET backend, and PostgreSQL test database.
7. Ensure the application is accessible at `http://localhost:4200`.

## Running Automated Tests

Run individual tests using Pytest.

Example:

`python -m pytest tests/test_login.py -v`

To execute the complete regression suite, run the test files in the verified order, ensuring Employee Create runs before Edit and Delete.

Generate an HTML report using the `--html` and `--self-contained-html` Pytest options.

## Test Execution Results

**Final local regression execution:**

- Total Test Cases: 21
- Passed: 21
- Failed: 0
- Pass Rate: 100%

All 21 automated tests passed in the final local regression execution.

## Important Notes

- Tests are designed for a locally running development/testing environment.
- Employee CRUD tests modify database records and should run against test data only.
- Some CRUD scenarios depend on execution order.
- Browser credentials used for demonstration must not be reused as production credentials.
- The current automation suite validates UI workflows and frontend authorization behavior; backend security testing is outside its present scope.

## Project Outcome

Implemented a 21-test Selenium automation suite covering key Employee Management System workflows, with reusable page objects, Pytest execution, automated HTML reporting, and configured failure screenshot capture.