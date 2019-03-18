const {By, until} = require('selenium-webdriver');
const Catalog = require('./Catalog');
const screenshotWithCircle = require('../util/screenFunc');
const expect = require('chai').expect;

class Start {
    constructor(driver) {
        this.driver = driver;
        screenshotWithCircle(this.driver, 'Стартовая страница Beeline.ru/shop');//вызов скриншота без обоводки
    }

    /**
     * Кнопка Гаджеты на главном меню
     * @returns {Promise<void>}
     */
    async gadgetsMenuButton() {

        let selector = 'li[data-slug=gadzhety] a';
        const item = await this.driver.findElement(By.css(selector));
        await screenshotWithCircle(this.driver, 'Переход в каталог гаджетов', item);// скриншот с
        //обводкой webelent'a item
        await item.click(); // клик по item
        // await this.driver.wait(until.elementLocated(By.css('div.layout-section.shop-section'))); // опциональное ожидание загрузки элемента

    }


    // validators

    /**
     * Проверка тайтла
     * @param expectTitle - string;
     * @returns {Promise<*|void>}
     */
    async checkTitle(expectTitle) {
        return await this.driver.wait(until.elementLocated(By.id("catalogHeader")), 10000)
            .then(async (elem) => {
                await screenshotWithCircle(this.driver, 'Проверка тайтла', elem);
                return expect(await elem.getText()).to.equal(expectTitle, 'НЕВЕРНЫЙ ТАЙТЛ!!! ')
            });
    }
}

module.exports = Start;