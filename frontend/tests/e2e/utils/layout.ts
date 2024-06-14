const openMobileDrawer = async ({page}) =>{
    await page.getByRole('button').nth(1).click();
    await page.waitForTimeout(1000);
}

export {openMobileDrawer}