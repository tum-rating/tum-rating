const openMobileDrawer = async ({page}) =>{
    await page.getByRole('button').nth(1).click();
}

export {openMobileDrawer}