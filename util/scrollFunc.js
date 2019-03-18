async function scroll(driver, element) {
    // console.log(JSON.stringify(selector));
    // await this.driver.sleep(1000);
    await this.driver.executeScript('arguments[0].scrollIntoView()', element)
        .then(async (mes)=>{
            console.log(mes + ' <<<<<,ka,kasdlfksn; <<<');
            return await screenshot(this.driver, text, element);
        });
    // await screenshot(this.driver, 'Скролл в каталоге', element)
}

(browser, text, item = false, circle = true) {
    const rect = (circle && item) ? await item.getRect() : '';
    if (circle && item) await browser.executeScript(cirleClickingObject, rect);
    await screen_(text, browser);
    if (circle && item) await browser.executeScript(deleteCircleClickingObjectFromDOM);
}

module.exports = scroll;