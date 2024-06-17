const openMobileDrawer = async ({page}) =>{
    await page.getByTestId('burger').click();
    await page.waitForTimeout(1000);
}

export {openMobileDrawer}