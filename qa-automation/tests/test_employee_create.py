
import uuid

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

from pages.login_page import LoginPage

BASE_URL = "http://localhost:4200"


def test_create_employee(browser):
    wait = WebDriverWait(browser, 25)

    # STEP 1: Login using POM
    login_page = LoginPage(browser)
    login_page.open()
    login_page.login("admin", "Password123!")
    login_page.wait_for_dashboard()

    print("1. Admin Login Successful!")

    # STEP 2: Open Employee Form
    browser.get(BASE_URL + "/employees/add")

    wait.until(EC.visibility_of_element_located((
        By.CSS_SELECTOR,
        'input[formcontrolname="employeeCode"]'
    )))

    print("2. Employee Form Opened!")

    # STEP 3: Generate unique test data
    unique_id = uuid.uuid4().hex[:8]

    employee_data = {
        "employeeCode": f"EMP-{unique_id.upper()}",
        "firstName": "Automation",
        "lastName": "Tester",
        "email": f"qa.{unique_id}@example.com",
        "mobile": "9876543210",
        "address": "123 Test Street",
        "city": "Bhavnagar",
        "state": "Gujarat",
        "country": "India",
        "salary": "50000"
    }

    # STEP 4: Fill employee fields
    for field, value in employee_data.items():
        element = browser.find_element(
            By.CSS_SELECTOR,
            f'[formcontrolname="{field}"]'
        )
        element.clear()
        element.send_keys(value)

    print("3. Employee Details Entered!")

    # STEP 5: Fill date fields
    dates = {
        "dob": "1998-05-15",
        "joiningDate": "2025-07-01"
    }

    for field, value in dates.items():
        element = browser.find_element(
            By.CSS_SELECTOR,
            f'input[formcontrolname="{field}"]'
        )

        browser.execute_script("""
            arguments[0].value = arguments[1];
            arguments[0].dispatchEvent(
                new Event('input', {bubbles: true})
            );
            arguments[0].dispatchEvent(
                new Event('change', {bubbles: true})
            );
        """, element, value)

    # STEP 6: Select department
    dept_locator = (
        By.CSS_SELECTOR,
        'select[formcontrolname="departmentId"]'
    )

    desig_locator = (
        By.CSS_SELECTOR,
        'select[formcontrolname="designationId"]'
    )

    wait.until(
        lambda d: len(
            Select(d.find_element(*dept_locator)).options
        ) > 1
    )

    department_values = [
        option.get_attribute("value")
        for option in Select(
            browser.find_element(*dept_locator)
        ).options
        if option.get_attribute("value")
    ]

    selected = False

    for dept_value in department_values:
        Select(
            browser.find_element(*dept_locator)
        ).select_by_value(dept_value)

        try:
            WebDriverWait(browser, 3).until(
                lambda d: any(
                    option.get_attribute("value")
                    for option in Select(
                        d.find_element(*desig_locator)
                    ).options
                )
            )
            selected = True
            break

        except TimeoutException:
            continue

    assert selected, "No department has a designation"

    # STEP 7: Select designation
    designation = Select(
        browser.find_element(*desig_locator)
    )

    valid_options = [
        option.get_attribute("value")
        for option in designation.options
        if option.get_attribute("value")
    ]

    designation.select_by_value(valid_options[0])

    print("4. Department and Designation Selected!")

    # STEP 8: Save employee
    save_button = wait.until(
        EC.element_to_be_clickable((
            By.CSS_SELECTOR,
            'button[type="submit"]'
        ))
    )

    save_button.click()

    # STEP 9: Verify redirect to directory
    wait.until(
        lambda d: d.current_url.rstrip("/").endswith(
            "/employees"
        )
    )

    assert browser.current_url.rstrip("/").endswith(
        "/employees"
    )

    print("TC08 PASSED: Employee Created Successfully!")
    print("Employee Code:", employee_data["employeeCode"])
    print("Employee Email:", employee_data["email"])
