
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait

# Replace with your actual frontend URL
APP_URL = "http://localhost:4200"


def test_application_launch():
    driver = webdriver.Chrome()

    try:
        # Open the Employee Management System
        driver.get(APP_URL)

        # Wait until the application displays visible text
        wait = WebDriverWait(driver, 15)

        wait.until(
            lambda d: d.find_element(
                By.TAG_NAME, "body"
            ).text.strip() != ""
        )

        print("Application opened successfully!")

    finally:
        # Close the browser
        driver.quit()
