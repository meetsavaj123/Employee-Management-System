
import re
import time

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import (
    TimeoutException,
    StaleElementReferenceException
)

from pages.login_page import LoginPage

BASE_URL = "http://localhost:4200"


def test_delete_employee(browser):

    wait = WebDriverWait(
        browser, 25,
        ignored_exceptions=(StaleElementReferenceException,)
    )

    # STEP 1: Admin Login Using POM
    login_page = LoginPage(browser)

    login_page.open()
    login_page.login("admin", "Password123!")
    login_page.wait_for_dashboard()

    print("1. Admin Login Successful!")

    # STEP 2: Open Employee Directory
    browser.get(BASE_URL + "/employees")

    search_locator = (
        By.CSS_SELECTOR,
        'input[placeholder^="Search by code"]'
    )

    search = wait.until(
        EC.visibility_of_element_located(search_locator)
    )

    search.send_keys("qa.")

    print("2. Searching Automation Test Employees...")

    # STEP 3: Find Only Test-Created Employee
    def click_delete(d):
        rows = d.find_elements(
            By.CSS_SELECTOR,
            "table.custom-table tbody tr"
        )

        for row in rows:
            try:
                row_text = row.text

                match = re.search(
                    r"qa\.[0-9a-f]{8}@example\.com",
                    row_text,
                    re.IGNORECASE
                )

                if "Automation Tester" in row_text and match:

                    delete_button = row.find_element(
                        By.XPATH,
                        './/*[self::button or self::a]'
                        '[contains(@title,"Delete") or '
                        'contains(normalize-space(.),"Delete")]'
                    )

                    delete_button.click()

                    return match.group(0)

            except StaleElementReferenceException:
                return False

        return False

    employee_email = wait.until(click_delete)

    print("3. Delete Clicked:", employee_email)

    # STEP 4: Handle Confirmation
    try:
        alert = WebDriverWait(browser, 2).until(
            EC.alert_is_present()
        )

        alert.accept()
        print("4. Delete Confirmed!")

    except TimeoutException:
        # Handle custom confirmation dialog
        dialogs = browser.find_elements(
            By.CSS_SELECTOR,
            '[role="dialog"], .modal, .confirm-dialog'
        )

        for dialog in dialogs:
            if dialog.is_displayed():
                dialog.find_element(
                    By.XPATH,
                    './/button[contains(.,"Delete") or '
                    'contains(.,"Confirm") or '
                    'contains(.,"Yes")]'
                ).click()

                print("4. Delete Confirmed!")
                break

    # STEP 5: Verify Employee Removed
    wait.until(
        EC.invisibility_of_element_located((
            By.XPATH,
            '//table//tr[contains(., "' +
            employee_email + '")]'
        ))
    )

    print("5. Employee Removed From Directory!")

    # STEP 6: Refresh and Verify Again
    browser.refresh()

    search = wait.until(
        EC.visibility_of_element_located(search_locator)
    )

    search.send_keys(employee_email)

    # Wait for search results to update
    time.sleep(2)

    rows = browser.find_elements(
        By.CSS_SELECTOR,
        "table.custom-table tbody tr"
    )

    assert not any(
        employee_email.lower() in row.text.lower()
        for row in rows
    ), "Deleted employee still appears!"

    print("6. Employee Absence Verified After Refresh!")
    print("TC10 PASSED: Employee Deleted Successfully!")
