
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from pages.login_page import LoginPage

ADD_EMPLOYEE = (
    By.CSS_SELECTOR,
    'a[href="/employees/add"]'
)


def login(browser, username):
    page = LoginPage(browser)
    page.open()
    page.login(username, "Password123!")
    page.wait_for_dashboard()

    WebDriverWait(browser, 15).until(
        EC.visibility_of_element_located((
            By.XPATH,
            "//h1[normalize-space()='Executive Dashboard']"
        ))
    )


# TC14 - Admin Dashboard
def test_admin_dashboard(browser):
    login(browser, "admin")

    button = WebDriverWait(browser, 15).until(
        EC.visibility_of_element_located(
            ADD_EMPLOYEE
        )
    )

    assert button.is_displayed()

    print("TC14 PASSED: Admin can see Add Employee!")


# TC15 - Employee Dashboard
def test_employee_dashboard(browser):
    login(browser, "john.doe")

    buttons = browser.find_elements(
        *ADD_EMPLOYEE
    )

    assert not any(
        button.is_displayed() for button in buttons
    )

    print("TC15 PASSED: Add Employee hidden!")
