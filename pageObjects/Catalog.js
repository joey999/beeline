const {By, until} = require('selenium-webdriver');
const screenshot = require('../util/screenFunc');


class Catalog {
    constructor(driver) {
        this.driver = driver;
        screenshot(this.driver, 'Новый каталог');
    }

    /**
     * Метод переходит в субкаталог
     * @param {string} link - subcatalog's link
     */
    async clickSubCatalogLink(link) {
        let selector = `ul.folded-nav a[href="${link}"]`;
        const item = await this.driver.findElement(By.css(selector));
        await this.driver.executeScript('arguments[0].scrollIntoView()', item);
        await screenshot(this.driver, `Переход в подкаталог ${link}`, item);
        await item.click();
        await this.driver.wait(until.elementLocated(By.css('#shopCatalogLoading.hidden')));
    }

    /**
     * Скролл к продукту по id
     * @param {number} id - product's id
     */
    async scrollToProduct(id) {
        const divProduct = await this.driver.wait(
            until.elementLocated(By.css(`div[data-product-slug="${id}"]`))
        );
        await this.driver.executeScript('arguments[0].scrollIntoView()', divProduct);
        await screenshot(this.driver, `Скролл в каталоге к ${id}`);
    }

    /**
     * Скролл к элменту по locator'у
     * @param {string} selector - query selector
     * @param {string} text - text for screenshot cause the wide range of scrolling to DOMs
     */
    async scrollToDOMElement(selector, text = selector) {
        const webelement = await this.driver.findElement(By.css(selector));
        await this.driver.executeScript('arguments[0].scrollIntoView()', webelement);
        await screenshot(this.driver, `Скролл в каталоге к ${text}`);
    }

    /**
     * Скролл к элементу по элементу вебдрайвера
     * @param element - элемент вебдрайвера
     * @param text - коментарий
     * @returns {Promise<void>}
     */
    async scrollToElement(element, text) {
        // console.log(JSON.stringify(selector));
        // await this.driver.sleep(1000);
        await this.driver.executeScript('arguments[0].scrollIntoView()', element);
        return await screenshot(this.driver, text, element);
            // .then(async (mes)=>{
            //     console.log(mes + ' <<<<<,ka,kasdlfksn; <<<');
            // });
        // await screenshot(this.driver, 'Скролл в каталоге', element)
    }

    /**
     * Возвращает цену товара в каталоге
     * @param {number} id - product's id
     * @returns {number}
     */
    async getProductPrice(id) {
        const divProduct = await this.driver.findElement(By.css(`div[data-product-slug="${id}"]`));
        const price = await divProduct.findElement(By.css('div.shop-item_price_item-current')).getText();
        const totalPriceRight = Number.parseFloat(price.match(/\d*/ig).join(''), 10) // cause the value of span
        //return Number.parseFloat(price, 10);
        return +totalPriceRight;
    }

    /**
     * Метод кликает по кнопке купить и возвращет объект Basket
     * @param {number} id - product's id
     * @returns {Promise<Basket>}
     */
    async goToBasketPageByBuyButtonClick(id) {
        const divProduct = await this.driver.findElement(By.css(`div[data-product-slug="${id}"]`));
        const btnBuy = await divProduct.findElement(By.css('button'));
        await screenshot(this.driver, `Переход к корзине по клику купить ${id}`, btnBuy);
        await btnBuy.click();
        await this.driver.wait(until.elementLocated(By.css('#BasketOverlay.hidden')));
        return new Basket(this.driver);
    }

    /**
     * Метод выбора скидки из фильтра каталога и возвращает объект Catalog
     * @returns {Promise<Catalog>}
     */
    async applyPromo() {
        await this.driver.findElement(By.css(`div.catalog-filter-link span`)).click();
        await this.driver.findElement(By.css(`ul.shop-filters-item-params-list li:nth-child(5)`)).click();
        await this.driver.findElement(By.css(`div.__white-button label`)).click();
        return new Catalog(this.driver);
    }

    /**
     * Метод кликает по кнопке "заборать в магазине" и возвращет объект FastbBuy
     * @param id
     * @returns {Promise<FastBuy>}
     */
    async fastBuy(id) {
        const divProduct = await this.driver.findElement(By.css(`div[data-product-slug="${id}"]`));
        const btnFastBuy = await divProduct.findElement(By.css('.office-buy'));
        await screenshot(this.driver, `Быстрая покупка ${id}`, btnFastBuy);
        await btnFastBuy.click();
        await this.driver.wait(until.elementLocated(By.css('.popup-content #office-buy-container')));
        const popupFastBuy = this.driver.findElement(By.css('.popup-content #office-buy-container'));
        await this.driver.executeScript('arguments[0].scrollIntoView()', popupFastBuy);
        await screenshot(this.driver, 'Popup быстрой покупки');
        return new FastBuy(this.driver);
    }

    /**
     * Добавляет к сравнению товар по id
     * @param {number} id - product's id
     */
    async addToCompare(id) {
        const addToCompareBtn = await this.driver.findElement(By.css(`.compare-item-wrapper[data-uniq-id="${id}"]`));
        await screenshot(this.driver, `Добавить ${id} к сравнению`, addToCompareBtn);
        await addToCompareBtn.click();
    }

    /**
     * Метод забирает href у кнопки "К сравнению" и возвращет объект Compare
     * @param id
     * @returns {Promise<Compare>}
     */
    async goToCompare(id) {
        const urlElememnt = await this.driver.findElement(By.css(`.compare-item-wrapper[data-uniq-id="${id}"] a`));
        const url = await urlElememnt.getAttribute('href');
        await this.driver.get(url);
        return new Compare(this.driver);
    }

    /**
     * Метод возвращает номер текущей страницы
     * @returns {number}
     */
    async getCurPage() {
        const curPage = await this.driver.findElement(By.css(`.shop-catalog-paging__item--active`));
        //return Number.parseFloat(await curPage.getText(), 10);
        return +await curPage.getText();
    }


    /**
     * Переход на следующую страницу
     * @param {string} mode - arrow mode or number mode
     */
    async goToNextPage(mode = 'arrow') {
        if (mode === 'arrow') {
            console.log(this);
            await this.scrollToDOMElement(`.shop-catalog-paging__item:nth-last-child(1)`, 'номерам страниц');
            const nextPageBtn = await this.driver.findElement(By.css(`.shop-catalog-paging__item:nth-last-child(1)`));
            await screenshot(this.driver, `Нажатие ${mode} для перехода на следующую страницу`, nextPageBtn);
            await nextPageBtn.click();
            await this.waitFor(`div.load`);
        }
    }

    /**
     * Переход на предыдущую страницу
     * @param {string} mode  -||-
     */
    async goToPrevPage(mode = 'arrow') {
        if (mode = 'arrow') {
            const prevPageBtn = await context.driver.findElement(By.css(`.shop-catalog-paging__item:nth-child(1)`));
            await screenshot(context.driver, `Нажатие ${mode} для перехода на предыдущую страницу`, prevPageBtn);
            await prevPageBtn.click();
            await this.waitFor(`div.load`);
        }

    }

    /**
     * Метод возвращает количество страниц каталога
     * @param
     * @returns {numOfPages}
     */
    async getNumOfPages() {
        const numOfPages = await this.driver.findElement(By.css(`.shop-catalog-paging__item:nth-last-child(2)`));
        //return Number.parseFloat(await numOfPages.getText(), 10);
        return +await numOfPages.getText();
    }

    // async countOfGadgetsOnPage() {
    //     let locator = "//*[text()='Купить']";
    //     const elements = await this.driver.wait(
    //         until.elementsLocated(By.xpath(locator)),
    //         10000);
    //
    //
    //     let count = await elements.length;
    //     console.log(count + '    < ============ in countOfGadgetsOnPage function');
    //
    //     await this.driver.sleep(100000);
    //     return +elements
    // }

    // async getCountOfProducts() {
    //     const numOfProducts = await this.driver.wait(
    //         until.elementsLocated(By.css(`div[class='shop-items-list'] button`)),
    //         10000);
    //
    //     // await numOfProducts.forEach(function (prod) {
    //     //     console.log(prod.getText());
    //     //     callback(prod)
    //     // });
    //
    //     let countProd = await numOfProducts.length;
    //
    //     countProd % 2 === 0 ? countProd = countProd / 2 : countProd = (countProd - 1) / 2;
    //
    //
    //     console.log(countProd);
    //     let text = await numOfProducts[countProd].getText();
    //     console.log(text);
    //
    //     text === 'В корзине' ? countProd = countProd - 1 : true;
    //
    //     await this.driver.executeScript('arguments[0].scrollIntoView()', numOfProducts[countProd]);
    //
    //     await numOfProducts[countProd].click();
    //     await this.driver.sleep(10000);
    //
    //     await this.driver.wait(
    //         until.elementLocated(By.css("div[class='header-shop-link']")),
    //         10000).click();
    //     // for (let link of numOfProducts){
    //     //
    //     //   let text = await link.getText();
    //     //   if (text === 'Умные часы JET Sport SW4 Red') {console.log('ALARM ITS WOOOOORK!!!!!111111111 ============')} else {console.log('NOT ----======----')}
    //     //
    //     // }
    //     return +await numOfProducts
    // }

    /**
     * Возвращает список элементов вебдрайвера; Все продукты каталога
     * @returns {Promise<void>}
     */
    async getAllProducts() {
        console.log('============== модуль getAllProduct. Получаем весь список товаров на странице в каталоге ==========');
        let locator = "//div[contains(@class, 'shop-item-with-bd-platesclass')]";
        let elements = await this.driver.wait(
            until.elementsLocated(By.xpath(locator)),
            10000);
        return elements
    }

    /**
     * Ождиание окончания загрузки
     * @param selector
     */
    async waitFor(selector = 'div.load') {

        console.log('======================>> Модуль waitFor in catalog. Ожидание загрузки страницы... << ====================');
        const waitArray = await this.driver.findElements(By.css(selector))
            .then( async () => {
                for (let i = 0; i < waitArray.length; i++) {
                    await this.driver.wait(until.elementIsNotVisible(waitArray[i]));
            }})
            .catch(() => {console.log('============ Ожидание завершено =============')})
    }

    async goToPageFromPage(from, to) {
        if (to >= from) {
            for (let i = 0; i < to - from; i++) await this.goToNextPage();
        } else
            for (let i = 0; i < from - to; i++) await this.goToPrevPage();

        await screenshot(this.driver, `Перешли с страницы ${from} на страницу ${to}`);
    }

    //TODO: написать методы для проверки всего на странице
}

module.exports = Catalog;
