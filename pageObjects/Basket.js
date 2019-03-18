const {By, until} = require('selenium-webdriver');
const Catalog = require('./Catalog');
const screenshotWithCircle = require('../util/screenFunc');
const expect = require('chai').expect;

class Basket {
    constructor(driver) {
        this.driver = driver;
        // this.driver.get('https://moskva.beeline.ru/shop/basket/');
        // this.catalog = new Catalog(this.driver);

    }

    /**
     * функция вызова страницы корзины
     * @returns {Promise<void>}
     */
    async page() {
        await this.driver.get('https://moskva.beeline.ru/shop/basket/');
        return await screenshotWithCircle(this.driver, 'Страница корзины - https://moskva.beeline.ru/shop/basket/');//вызов скриншота без обоводки
    }


    /**
     * Кнопка Вернуться в магазин
     * @returns {Promise<void>}
     */
    async goBackFromBasket() {
        console.log('==================== Жмём на кнопку "Вернуться в магазин" ================');
        // await this.driver.sleep(100000);
        const element = await this.driver.wait(
            until.elementLocated(By.css("div[class='header-shop-link']")),
            10000
        ).then(async (el) => {
            await screenshotWithCircle(this.driver, 'Жмём по кнопке - Вернуться в магазин ', el);
            return el
        });

        await element.click();

        //ждём когда страница програузится
        await this.waitFor();

    }

    /**
     * Кнопка Оформить заказ
     * @returns {Promise<*>}
     */
    async clickCheckoutOrderButton() {
        console.log('======================== Нвжимаем кнопку Оформить заказ ================');
        let buttonOrder = await this.driver.wait(until.elementLocated(By.xpath("//button[text()='Оформить заказ']")), 15000);
        await screenshotWithCircle(this.driver, 'Жмём Оформить заказ', buttonOrder);

        return await buttonOrder.click()
            .then(()=>{console.log('======================== Успешно ===================')})
            .catch((err) => {return assert.throw('Кнопка не найдена !!!! \n' + err)})

    }


    /**
     * Скролл до элемента
     * @param element - элемент вебдрайвера
     * @param text - комментарий к скриншоту
     * @returns {Promise<void>}
     */
    async scrollToElement(element, text) {
        await this.driver.executeScript('arguments[0].scrollIntoView()', element);
        await screenshotWithCircle(this.driver, text, element);
    }

    // validators
    /**
     * Проверка существования кнопки на странице
     * @param nameButton - string; Название кнопки
     * @returns {Promise<void>}
     */
    async checkButtonExist(nameButton) {
        let toOrderButton = await this.driver.wait(
            until.elementLocated(By.xpath(`//button[text()='${nameButton}']`)),
            10000
        ).catch((err) => {
            return console.error('Кнопка отсутствует!!!!1 ' + err)
        });
        await this.scrollToElement(toOrderButton, `Скролл до кнопки '${nameButton}'`)
    }

    /**
     * Проверка суммы выбранныз продуктов в корзине
     * @param expectSumm - number; ожидаемая сумма заказа
     * @returns {Promise<void>}
     */
    async checkSumOfProducts(expectSumm){
        // await this.driver.sleep(100000);
        let actualSumElement = this.driver.wait(
            until.elementLocated(By.xpath("//div[@class='shop-basket-item-cost_current']")),
            10000);
        await this.scrollToElement(actualSumElement, `Проверка итоговой суммы заказа. Ожидаемая сумма '${expectSumm}'`);

        let actualSum = await actualSumElement.getText();
        actualSum = Number(actualSum.replace(' ', ''));

        //Сравнение ожидаемого результата с фактическим
        expect(expectSumm).to.equal(actualSum);
    }

    /**
     * Проверка товаров в корзине
     * @param productName - одномерный массив из тайтлов продуктов
     * @returns {Promise<void>}
     */
    async checkPresence(productName) {
        console.log('=========== модуль checkPresence. Проверка товаров в корзине');
        console.log(productName + '  <<<<<<<<======= Ожидаемые товары');
        let elements = await this.driver.wait(until.elementsLocated(By.xpath("//div[contains(@class, 'orders-list')]/.//h3")), 15000);

        // собираем все тайтлы из корзины
        let lengthOfElements = elements.length;
        let index;
        let namesOfElements = [];
        for (index = 0; index < lengthOfElements; ++index) {
            namesOfElements.push(await elements[index].getText());
            console.log(namesOfElements + '  <<<< ========= Товары в корзине');

        }

        await screenshotWithCircle(this.driver, 'Элементы в корзине');

        const checkBasket = allure.createStep("Проверка корзины", (expectProducts, actualProducts) => {
            expect(expectProducts).to.have.members(actualProducts, ' <<======== В КОРЗИНЕ НЕСООТВЕТСТВИЕ ТОВАРОВ');
        });

        checkBasket(namesOfElements, productName)


    }

    /**
     * Ождиание окончания загрузки
     * @param selector
     */
    async waitFor(selector = 'div.load') {

        console.log('=======================>> Модуль waitFor << ====================');
        const waitArray = await this.driver.findElements(By.css(selector))
            .then(async () => {
                for (let i = 0; i < waitArray.length; i++) {
                    await this.driver.wait(until.elementIsNotVisible(waitArray[i]));
                }
            })
            .catch((err) => {
                console.log(JSON.stringify(err) + ' << ================ Ждать нечего')
            })
    }

    /**
     * Функция нажатия на крестик в корзине напротив продукта
     * @param nameOfProduct - string; Тайтл продукта
     * @returns {Promise<void>}
     */
    async deleteFromBasket(nameOfProduct) {
        console.log(`================== Удаляем продукт ${nameOfProduct} из корзины ======================`);
        let element = await this.driver.wait(until.elementLocated(
            By.xpath(`//*[text()='${nameOfProduct}']/ancestor::td[@data-ng-if='!item.deleted']/following-sibling::td[contains(@class, 'close')]/.//*[@class='modify-link-after']`)
        ));
        await element.click()
            .then(()=>{console.log('================== Успешно ===================')})
            .catch((err) => {console.error('Удаление невозможно!!! \n' + err)})
    }
}

module.exports = Basket;