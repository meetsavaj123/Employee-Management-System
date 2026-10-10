
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class LoginPage:

    URL = "http://localhost:4200/login"

    USERNAME = (
        By.CSS_SELECTOR,
        'input[formcontrolname="username"]'
    )

    PASSWORD = (
        By.CSS_SELECTOR,
        'input[formcontrolname="password"]'
    )

    LOGIN_BUTTON = (
        By.CSS_SELECTOR,
        'button[type="submit"]'
    )

    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 20)

    def open(self):
        self.driver.get(self.URL)
        self.wait.until(
            EC.visibility_of_element_located(
                self.USERNAME
            )
        )

    def login(self, username, password):
        self.driver.find_element(
            *self.USERNAME
        ).send_keys(username)

        self.driver.find_element(
            *self.PASSWORD
        ).send_keys(password)

        self.wait.until(
            EC.element_to_be_clickable(
                self.LOGIN_BUTTON
            )
        ).click()

    def wait_for_dashboard(self):
        self.wait.until(
            EC.url_contains("/dashboard")
        )
