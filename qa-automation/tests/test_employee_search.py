
import pytest

from pages.login_page import LoginPage

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import StaleElementReferenceException


BASE_URL = "http://localhost:4200"

SEARCH = (
    By.CSS_SELECTOR,
    'input[placeholder^="Search by code"]'
)


# Shared browser fixture from conftest.py
@pytest.fixture
def driver(browser):
    return browser


# Get employee records from table
def employee_rows(driver):
    rows = driver.find_elements(
        By.CSS_SELECTOR,
        "table.custom-table tbody tr"
    )

    return [
        row for row in rows
        if len(row.find_elements(By.TAG_NAME, "td")) >= 3
    ]


# Open Employee Directory
def open_directory(driver):

    wait = WebDriverWait(
        driver,
        25,
        ignored_exceptions=(StaleElementReferenceException,)
    )

    # Login using Page Object Model
    login_page = LoginPage(driver)

    login_page.open()
    login_page.login("admin", "Password123!")
    login_page.wait_for_dashboard()

    print("Admin Login Successful!")

    # Navigate to Employee Directory
    driver.get(BASE_URL + "/employees")

    wait.until(
        EC.visibility_of_element_located(SEARCH)
    )

    wait.until(
        lambda d: len(employee_rows(d)) > 0
    )

    print("Employee Directory Opened!")

    return wait


# TC11 - Search Existing Employee
def test_search_existing_employee(driver):
    wait = open_directory(driver)

    # Get existing employee code
    first_row = employee_rows(driver)[0]

    code = first_row.find_elements(
        By.TAG_NAME, "td"
    )[0].text.strip()

    assert code, "Employee code is empty"

    print("Searching Employee:", code)

    # Enter employee code in search box
    search = wait.until(
        EC.element_to_be_clickable(SEARCH)
    )

    search.clear()
    search.send_keys(code)

    # Verify filtered results
    def matching_results(d):
        rows = employee_rows(d)

        if not rows:
            return False

        return all(
            code.lower() in row.text.lower()
            for row in rows
        )

    try:
        wait.until(matching_results)

    except Exception:
        print("Search value:", code)
        print("Visible employee rows:")

        for row in employee_rows(driver):
            print(row.text)

        raise

    assert matching_results(driver)

    print("TC11 PASSED: Employee search successful!")


# TC12 - Search Nonexistent Employee
def test_search_nonexistent_employee(driver):
    wait = open_directory(driver)

    search = driver.find_element(*SEARCH)

    search.clear()
    search.send_keys(
        "ZZZ_NONEXISTENT_EMPLOYEE_99999"
    )

    # Wait for empty search results
    wait.until(
        lambda d: len(employee_rows(d)) == 0
    )

    assert len(employee_rows(driver)) == 0

    print("TC12 PASSED: Nonexistent employee not found!")
