
from urllib.parse import urlparse

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from pages.login_page import LoginPage


# TC01 - Valid Admin Login
def test_valid_admin_login(browser):
    login_page = LoginPage(browser)

    login_page.open()
    login_page.login("admin", "Password123!")
    login_page.wait_for_dashboard()

    assert "/dashboard" in browser.current_url

    print("TC01 PASSED: Admin login successful!")


# TC02 - Invalid Login
def test_invalid_login(browser):
    login_page = LoginPage(browser)

    login_page.open()
    login_page.login("wronguser", "wrongpassword")

    wait = WebDriverWait(browser, 15)

    wait.until(
        lambda d: (
            urlparse(d.current_url).path == "/login"
            and d.find_element(
                *LoginPage.LOGIN_BUTTON
            ).text.strip().startswith("Sign In")
        )
    )

    assert urlparse(browser.current_url).path == "/login"

    print("TC02 PASSED: Invalid credentials did not redirect!")


# TC03 - Empty Fields
def test_empty_fields(browser):
    login_page = LoginPage(browser)

    login_page.open()

    button = browser.find_element(
        *LoginPage.LOGIN_BUTTON
    )

    assert not button.is_enabled()

    print("TC03 PASSED: Empty fields disable login!")


# TC04 - Valid Employee Login
def test_valid_employee_login(browser):
    login_page = LoginPage(browser)

    login_page.open()
    login_page.login("john.doe", "Password123!")
    login_page.wait_for_dashboard()

    assert "/dashboard" in browser.current_url

    print("TC04 PASSED: Employee login successful!")
