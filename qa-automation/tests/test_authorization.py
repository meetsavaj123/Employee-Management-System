
from urllib.parse import urlparse

from selenium.webdriver.support.ui import WebDriverWait

from pages.login_page import LoginPage

BASE_URL = "http://localhost:4200"


# TC13 - Role-Based Authorization
def test_employee_cannot_access_departments(browser):

    # Login as regular Employee
    login_page = LoginPage(browser)

    login_page.open()
    login_page.login(
        "john.doe",
        "Password123!"
    )
    login_page.wait_for_dashboard()

    print("1. Employee login successful!")

    # Attempt to open Admin-only page
    browser.get(BASE_URL + "/departments")

    # Verify frontend route guard redirects
    WebDriverWait(browser, 20).until(
        lambda d: urlparse(
            d.current_url
        ).path.rstrip("/") == "/dashboard"
    )

    assert urlparse(
        browser.current_url
    ).path.rstrip("/") == "/dashboard"

    print("2. Admin access blocked!")
    print("TC13 PASSED: Authorization check!")
