
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class EmployeeFormPage:

    SALARY = (
        By.CSS_SELECTOR,
        'input[formcontrolname="salary"]'
    )

    SALARY_ERROR = (
        By.XPATH,
        "//div[contains(@class,'invalid-feedback') "
        "and contains(.,'Salary must be non-negative')]"
    )

    SAVE_BUTTON = (
        By.CSS_SELECTOR,
        'button[type="submit"]'
    )

    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 20)

    def enter_salary(self, value):
        field = self.wait.until(
            EC.element_to_be_clickable(self.SALARY)
        )
        field.clear()
        field.send_keys(str(value))
        field.send_keys(Keys.TAB)

    def is_salary_invalid(self):
        field = self.driver.find_element(*self.SALARY)
        return "ng-invalid" in field.get_attribute("class")

    def salary_error_visible(self):
        error = self.wait.until(
            EC.visibility_of_element_located(
                self.SALARY_ERROR
            )
        )
        return error.is_displayed()

    def is_save_enabled(self):
        button = self.driver.find_element(
            *self.SAVE_BUTTON
        )
        return button.is_enabled()
