const {By, until} = require('selenium-webdriver');
const Catalog = require('./Catalog');
const screenshotWithCircle = require('../util/screenFunc');
const expect = require('chai').expect;

class Gadgets {
    constructor(driver) {
        this.driver = driver;
        this.catalog = new Catalog(this.driver);
    }

    async page(){
        await this.driver.get('https://moskva.beeline.ru/shop/catalog/gadzhety/umnye-chasy-i-braslety/');
        await screenshotWithCircle(this.driver, 'Страница Beeline.ru/shop/catalog/gadzhety/umnye-chasy-i-braslety/');
    }

    /**
     * Цена выбранного продукта
     * @param product - элемент вебдрайвера; продукт каталога
     * @returns {Promise<number>}
     */
    async getProductPrice(product){
        let price = await product.findElement(By.xpath(".//div[@class='shop-item_price_item-current']")).getText();
        // обрезаем все пробелы и символ ₽
        price = price.replace(/\s[₽]/,'').replace(/\s/, '');

        // переводим строку в тип number
        let intPrice = Number(price);

        return intPrice;
    }

    // функция выбирает товар из середины
    async chooseProductInMiddle() {
        // ждём пока страничка полностью прогрузится
        await this.catalog.waitFor();

        // Берём все товары на странице
        let elements = await this.catalog.getAllProducts();

        // считаем количество товаров на странице
        // выбираем индекс товара товар из середины
        let numberOfProductInMiddle = Math.floor(elements.length / 2);


        // проверяем что товар не лежит в корзине, если лежит то берём соседний
        let nameButton = await elements[numberOfProductInMiddle].findElement(By.xpath(".//button")).getText();
        let choosedElement;
        if (nameButton === 'Купить') {
            choosedElement = elements[numberOfProductInMiddle]
        } else {
            choosedElement = elements[numberOfProductInMiddle + 1]
        }

        //пишем в консоль название выбранного товара
        let titleProduct = await choosedElement.findElement(By.xpath(".//div[@class='h3div']")).getText();
        console.log(`================= Товар выбран: '${titleProduct}'`);

        // пишем в консоль тайтл кнопки выбранного товара
        nameButton = await choosedElement.findElement(By.xpath(".//button")).getText();
        console.log('=================== name button: ' + nameButton);

        return choosedElement;
    }

    /**
     * *
     * @param el - продукт каталога (элемент вебдрайвера)
     * @returns {Promise<void>}
     */
    async clickToBuy(el) {
        console.log(' =========== модуль clickToBuy. Жмём на кнопку купить =========');
        let element = await el.findElement(By.xpath(".//button"));

        await screenshotWithCircle(this.driver, "Клик по кнопке купить", element);

        await element.click()

    }

    /**
     *
     * @param element - продукт каталога (элемент вебдрайвера)
     * @returns {Promise<void>}
     */
    async getProductName(element) {

        console.log('================ модуль getProductName; Чтение аттрибута тайтла продукта ===================');
        let text = await element.findElement(By.xpath(".//div[@class='h3div']")).getText();
        console.log(text + ' <<<<<<< ========= ProductName');

        return text;
    }

    /**
     *
     * @param title - название продукта из каталога
     * @returns {Promise<void>}
     */
    async chooseProductByTitle(title){
        let element = await this.driver.wait(
            until.elementLocated(
                By.xpath(`//*[contains(text(),'${title}')]/ancestor::div[@class='shop-item-wrapper']`)),
            10000);
        return element
    }

    /**
     *
     * @param element - элемент вебдрайвера
     * @param text - комментарий
     * @returns {Promise<void>}
     */
    async scrollToProduct(element, text) {
        await this.catalog.scrollToElement(element, text);
    }


    //    validators

    /**
     * проверка статуса кнопки (Купить/В корзине)
     *
     * @param element
     * @param status - string: Купить/В корзине
     * @returns {Promise<void>}
     */
    async checkButtonStatus(element, status){
        let button = await element.findElement(By.xpath(".//button"));
        let statusButton = await button.getText();

        await screenshotWithCircle(this.driver, 'Проверка статуса кнопки "Купить', button);
        expect(status).to.equal(statusButton)

    }

    /**
     * Проверка количества продуктов на странице
     * @param countProducts - number; ожидаемое количество продуктов в каталоге
     * @returns {Promise<void>}
     */
    async checkCountsElementsOnPage(countProducts){
        let elements = await this.catalog.getAllProducts().length;

        const checkWithAllureStep = allure.createStep("Проверка количества продуктов на странице", (expectCountProduct, actualCountProduct) => {
            expect(expectCountProduct).to.equal(actualCountProduct)
        });

        checkWithAllureStep(countProducts, elements)
    }

    /**
     * Проверка УРЛ
     * @param addr
     * @returns {Promise<string>}
     */
    async checkURL(addr) {
        screenshotWithCircle(this.driver,'Проверка редиректа в корзину');
        return await this.driver.getCurrentUrl()
            .then((currentURL) => {
                expect(currentURL).to.equal(addr, 'Кнопка покупки некорректно редиректит')
            });
    }
}

module.exports = Gadgets;