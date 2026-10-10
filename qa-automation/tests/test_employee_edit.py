
import re

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import (
    StaleElementReferenceException,
    NoSuchElementException
)

from pages.login_page import LoginPage

BASE_URL = "http://localhost:4200"


def test_edit_employee(browser):

    wait = WebDriverWait(
        browser,
        25,
        ignored_exceptions=(
            StaleElementReferenceException,
            NoSuchElementException
        )
    )

    # STEP 1: Login using POM
    login_page = LoginPage(browser)
    login_page.open()
    login_page.login("admin", "Password123!")
    login_page.wait_for_dashboard()

    print("1. Admin Login Successful!")

    # STEP 2: Open Employee Directory
    browser.get(BASE_URL + "/employees")

    search = wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR,
            'input[placeholder^="Search by code"]'
        ))
    )

    search.send_keys("qa.")

    print("2. Searching Automation Test Employee...")

    # STEP 3: Find test employee and click Edit
    def click_test_employee(d):
        rows = d.find_elements(
            By.CSS_SELECTOR,
            "table.custom-table tbody tr"
        )

        for row in rows:
            text = row.text

            match = re.search(
                r"qa\.[0-9a-f]{8}@example\.com",
                text,
                re.IGNORECASE
            )

            if "Automation Tester" in text and match:
                row.find_element(
                    By.CSS_SELECTOR,
                    'a[title="Edit Employee"]'
                ).click()

                return match.group(0)

        return False

    employee_email = wait.until(click_test_employee)

    wait.until(
        EC.url_contains("/employees/edit/")
    )

    edit_url = browser.current_url

    print("3. Edit Employee Page Opened!")
    print("Employee:", employee_email)

    # STEP 4: Wait for employee details
    email_locator = (
        By.CSS_SELECTOR,
        'input[formcontrolname="email"]'
    )

    wait.until(
        lambda d: d.find_element(
            *email_locator
        ).get_attribute("value").lower()
        == employee_email.lower()
    )

    # STEP 5: Update Employee City
    city_locator = (
        By.CSS_SELECTOR,
        'input[formcontrolname="city"]'
    )

    city = browser.find_element(*city_locator)

    old_city = city.get_attribute("value")

    new_city = (
        "Rajkot" if old_city != "Rajkot"
        else "Bhavnagar"
    )

    city.clear()
    city.send_keys(new_city)

    print("4. Old City:", old_city)
    print("5. New City:", new_city)

    # STEP 6: Save Changes
    save_button = wait.until(
        EC.element_to_be_clickable((
            By.CSS_SELECTOR,
            'button[type="submit"]'
        ))
    )

    save_button.click()

    wait.until(
        lambda d: d.current_url.rstrip("/")
        == BASE_URL + "/employees"
    )

    print("6. Employee Updated!")

    # STEP 7: Verify Saved Data
    browser.get(edit_url)

    wait.until(
        lambda d: d.find_element(
            *email_locator
        ).get_attribute("value").lower()
        == employee_email.lower()
    )

    wait.until(
        lambda d: d.find_element(
            *city_locator
        ).get_attribute("value") == new_city
    )

    print("7. Updated City Verified!")
    print("TC09 PASSED: Employee Edit Successful!")
