
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from pages.login_page import LoginPage
from pages.employee_form_page import EmployeeFormPage

BASE_URL = "http://localhost:4200"


# Reusable function to open Employee Form
def open_employee_form(browser):

    # Login using Login Page Object
    login_page = LoginPage(browser)
    login_page.open()
    login_page.login("admin", "Password123!")
    login_page.wait_for_dashboard()

    # Open Add Employee Page
    browser.get(BASE_URL + "/employees/add")

    employee_page = EmployeeFormPage(browser)

    employee_page.wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR,
            'input[formcontrolname="employeeCode"]'
        ))
    )

    return employee_page


# TC05 - Employee Form Loads
def test_employee_form_load(browser):

    open_employee_form(browser)

    heading = browser.find_element(
        By.CSS_SELECTOR, "h1.page-title"
    )

    assert heading.text == "Add New Employee"

    print("TC05 PASSED: Employee Form Opened!")


# TC06 - Required Fields Validation
def test_required_fields(browser):

    employee_page = open_employee_form(browser)

    assert not employee_page.is_save_enabled()

    print("TC06 PASSED: Empty Form Submission Blocked!")


# TC07 - Negative Salary Validation
def test_negative_salary(browser):

    employee_page = open_employee_form(browser)

    employee_page.enter_salary(-500)

    assert employee_page.is_salary_invalid()
    assert employee_page.salary_error_visible()

    print("TC07 PASSED: Negative Salary Rejected!")
