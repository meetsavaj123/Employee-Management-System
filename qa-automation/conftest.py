
import re
import time
from pathlib import Path

import pytest
from selenium import webdriver


@pytest.fixture
def browser():
    options = webdriver.ChromeOptions()

    options.add_experimental_option("prefs", {
        "credentials_enable_service": False,
        "profile.password_manager_enabled": False
    })

    driver = webdriver.Chrome(options=options)
    driver.maximize_window()

    yield driver

    # Keep Chrome open for demonstration
    print("\nChrome stays open for 12 seconds...")
    time.sleep(12)

    driver.quit()


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()

    if report.when != "call" or not report.failed:
        return

    driver = item.funcargs.get("browser")

    if driver is None:
        return

    screenshot_folder = (
        Path(__file__).resolve().parent / "screenshots"
    )
    screenshot_folder.mkdir(exist_ok=True)

    test_name = re.sub(
        r"[^a-zA-Z0-9_.-]",
        "_",
        item.nodeid
    )

    screenshot_path = screenshot_folder / (
        f"{test_name}.png"
    )

    try:
        driver.save_screenshot(str(screenshot_path))
        print(f"\nFailure screenshot: {screenshot_path}")
    except Exception as error:
        print(f"\nScreenshot could not be saved: {error}")
