
import pytest

from pages.login_page import LoginPage

from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException


BASE_URL = "http://localhost:4200"


# Shared browser fixture from conftest.py
@pytest.fixture
def driver(browser):
    return browser


# Reusable function to open Employee Form
def open_employee_form(driver):

    # Login using Page Object Model
    login_page = LoginPage(driver)

    login_page.open()
    login_page.login("admin", "Password123!")
    login_page.wait_for_dashboard()

    # Navigate to Add Employee
    driver.get(BASE_URL + "/employees/add")

    wait = WebDriverWait(driver, 20)

    wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR,
            'input[formcontrolname="email"]'
        ))
    )

    return wait


# TC16 - Invalid Email Validation
def test_invalid_employee_email(driver):
    wait = open_employee_form(driver)

    email = driver.find_element(
        By.CSS_SELECTOR,
        'input[formcontrolname="email"]'
    )

    email.send_keys("invalid-email")
    email.send_keys(Keys.TAB)

    error = wait.until(
        EC.visibility_of_element_located((
            By.XPATH,
            "//div[contains(@class,'invalid-feedback') "
            "and contains(.,'Valid email address is required')]"
        ))
    )

    assert error.is_displayed()
    assert "ng-invalid" in email.get_attribute("class")

    print("TC16 PASSED: Invalid email rejected!")


# TC17 - Department & Designation Dependency
def test_department_designation_dependency(driver):
    wait = open_employee_form(driver)

    department = (
        By.CSS_SELECTOR,
        'select[formcontrolname="departmentId"]'
    )

    designation = (
        By.CSS_SELECTOR,
        'select[formcontrolname="designationId"]'
    )

    # Wait for departments and designations to load
    wait.until(
        lambda d: len(
            Select(d.find_element(*department)).options
        ) > 1
    )

    wait.until(
        lambda d: len(
            Select(d.find_element(*designation)).options
        ) > 1
    )

    department_values = [
        option.get_attribute("value")
        for option in Select(
            driver.find_element(*department)
        ).options
        if option.get_attribute("value")
    ]

    assert len(department_values) >= 2, (
        "At least two departments are needed"
    )

    # Find a department with a designation
    chosen_department = None

    for value in department_values:
        Select(
            driver.find_element(*department)
        ).select_by_value(value)

        try:
            WebDriverWait(driver, 3).until(
                lambda d: len([
                    option for option in Select(
                        d.find_element(*designation)
                    ).options
                    if option.get_attribute("value")
                ]) > 0
            )

            chosen_department = value
            break

        except TimeoutException:
            continue

    assert chosen_department, (
        "No department with designations found"
    )

    # Select a valid designation
    designation_select = Select(
        driver.find_element(*designation)
    )

    valid_values = [
        option.get_attribute("value")
        for option in designation_select.options
        if option.get_attribute("value")
    ]

    designation_select.select_by_value(valid_values[0])

    print("Department and designation selected!")

    # Change department
    other_department = next(
        value for value in department_values
        if value != chosen_department
    )

    Select(
        driver.find_element(*department)
    ).select_by_value(other_department)

    # Verify designation resets
    wait.until(
        lambda d: Select(
            d.find_element(*designation)
        ).first_selected_option.get_attribute("value") == ""
    )

    print("TC17 PASSED: Designation reset correctly!")


# TC18 - Employee Code Required Validation
def test_employee_code_required(driver):
    wait = open_employee_form(driver)

    code = wait.until(
        EC.element_to_be_clickable((
            By.CSS_SELECTOR,
            'input[formcontrolname="employeeCode"]'
        ))
    )

    # Enter a temporary employee code
    code.send_keys("EMP-TEST")

    print("Employee code entered!")

    # Clear using keyboard
    code.send_keys(Keys.CONTROL, "a")
    code.send_keys(Keys.BACKSPACE)

    # Trigger validation
    driver.find_element(
        By.CSS_SELECTOR,
        'input[formcontrolname="firstName"]'
    ).click()

    # Verify field is empty and invalid
    wait.until(
        lambda d: (
            d.find_element(
                By.CSS_SELECTOR,
                'input[formcontrolname="employeeCode"]'
            ).get_attribute("value") == ""
            and "ng-invalid" in d.find_element(
                By.CSS_SELECTOR,
                'input[formcontrolname="employeeCode"]'
            ).get_attribute("class")
            and "ng-touched" in d.find_element(
                By.CSS_SELECTOR,
                'input[formcontrolname="employeeCode"]'
            ).get_attribute("class")
        )
    )

    # Verify required error message
    error = wait.until(
        EC.visibility_of_element_located((
            By.XPATH,
            "//div[contains(@class,'invalid-feedback') "
            "and contains(.,'Employee code is required')]"
        ))
    )

    assert error.is_displayed()

    print("TC18 PASSED: Employee code required validation!")


# TC19 - Email Correction Validation
def test_email_correction(driver):
    wait = open_employee_form(driver)

    email = driver.find_element(
        By.CSS_SELECTOR,
        'input[formcontrolname="email"]'
    )

    # Enter invalid email
    email.send_keys("wrong-email")
    email.send_keys(Keys.TAB)

    assert "ng-invalid" in email.get_attribute("class")

    # Correct email
    email.clear()
    email.send_keys("test@example.com")
    email.send_keys(Keys.TAB)

    wait.until(
        lambda d: "ng-valid" in d.find_element(
            By.CSS_SELECTOR,
            'input[formcontrolname="email"]'
        ).get_attribute("class")
    )

    assert "ng-valid" in email.get_attribute("class")

    print("TC19 PASSED: Valid email accepted!")


# TC20 - Salary Boundary Validation
def test_salary_boundary(driver):
    wait = open_employee_form(driver)

    salary = driver.find_element(
        By.CSS_SELECTOR,
        'input[formcontrolname="salary"]'
    )

    # Negative salary should be rejected
    salary.clear()
    salary.send_keys("-1")
    salary.send_keys(Keys.TAB)

    wait.until(
        lambda d: "ng-invalid" in d.find_element(
            By.CSS_SELECTOR,
            'input[formcontrolname="salary"]'
        ).get_attribute("class")
    )

    print("Negative salary correctly rejected!")

    # Zero salary is allowed
    salary.clear()
    salary.send_keys("0")
    salary.send_keys(Keys.TAB)

    wait.until(
        lambda d: "ng-valid" in d.find_element(
            By.CSS_SELECTOR,
            'input[formcontrolname="salary"]'
        ).get_attribute("class")
    )

    print("TC20 PASSED: Salary boundary validated!")
