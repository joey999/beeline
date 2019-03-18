/**
 * Функция создает step в allure
 * @param {string} name
 * @param {webdriver} browser
 */
async function screen_(name = 'забыл указать имя', browser) {
    await browser.takeScreenshot().then(async function (png) {
        await allure.createAttachment(name, function () {
            return new Buffer(png, 'base64')
        }, 'image/png')();
    })
}

/**
 * JS-скрипт обводки
 * @param {object} rect - object with size of the DOMElement
 */
function cirleClickingObject(rect) {
    console.log(rect.x, rect.y, rect.width, rect.height);
    let newDiv = document.createElement("div");
    newDiv.style.background = 'red';
    newDiv.style.position = "absolute";
    newDiv.style.height = rect.height + 80 + "px";
    newDiv.style.width = rect.width + 80 + "px";
    newDiv.style.border = "2px solid red";
    newDiv.style.background = "none";
    newDiv.style.borderRadius = "50%";
    newDiv.style.top = rect.y - 40 + "px";
    newDiv.style.left = rect.x - 40 + "px";
    newDiv.style.zIndex = 10000;
    newDiv.className = "circle-clicking-object";
    document.body.appendChild(newDiv);
}

/**
 * Функция удаляет обводку из DOM'а
 */
function deleteCircleClickingObjectFromDOM() {
    let el = document.querySelector('.circle-clicking-object');
    document.body.removeChild(el);
}

/**
 * Главная функция скриншота
 * @param {webdriver} browser - webdriver instance
 * @param {string} text - step name for allure
 * @param {webelement} item - object to circle
 * @param {bool} circle - circle turn on/off
 */
async function screenshot(browser, text, item = false, circle = true) {
    const rect = (circle && item) ? await item.getRect() : '';
    if (circle && item) await browser.executeScript(cirleClickingObject, rect);
    await screen_(text, browser);
    if (circle && item) await browser.executeScript(deleteCircleClickingObjectFromDOM);
}

module.exports = screenshot;