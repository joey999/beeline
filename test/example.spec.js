"use strict"
const describeWithBrowser = require("../util/browser");
const webdriver = require('selenium-webdriver');
const StartPage = require('../pageObjects/Start');
const Gadgets = require('../pageObjects/Gadgets');
const Basket = require('../pageObjects/Basket');


let browser;


describeWithBrowser(
    "EShop B2C",
    b => (browser = b),
    () => {

        describe("Example tests", () => {
            let page;
            beforeEach(async () => {

            });
            before(async () => {
            });

            // ╔══╗╔══╗╔╗╔╦╗╔╗
            // ║╔╗║║╔╗║║║║║║║║
            // ║║║║║║║║║║║║╚╝║
            // ║║║║║║║║║║╔║╔╗║
            // ║╚╝╠╝╚╝╚╣╚╝║║║║
            // ╚══╩════╩══╩╝╚╝
            // ╔════╦══╦══╗╔══╦═══╗
            // ╚═╗╔═╣╔╗║╔╗║║╔╗║╔═╗║
            // ──║║─║║║║╚╝╚╣╚╝║╚═╝║
            // ──║║─║║║║╔═╗║╔╗║╔══╝
            // ──║║─║╚╝║╚═╝║║║║║
            // ──╚╝─╚══╩═══╩╝╚╩╝
            xit('Переход в раздел гаджетов из основного меню', async () => {
                console.log('======== Переход в раздел гаджетов из основного меню ========');
                const startPage = new StartPage(browser);//создаем экзэмпляр класса страницы
                await startPage.gadgetsMenuButton();//вызов функции перехода к каталогу гаджетов

                //  Проверяем что попали в раздел гаджетов
                await startPage.checkTitle('Умные часы и браслеты');

            });

            xit('Проверка редиректа в корзину', async () => {
                console.log("Проверка редиректа в корзину");
                const gadgetsPage = new Gadgets(browser);
                await gadgetsPage.page();

                let choosedProduct = await gadgetsPage.chooseProductInMiddle();
                await gadgetsPage.scrollToProduct(choosedProduct, 'Скроллим до выбранного товара');

                await gadgetsPage.clickToBuy(choosedProduct);
                //
                // //Проверяем URL
                await gadgetsPage.checkURL('https://moskva.beeline.ru/shop/basket/#?step=orderList');
            });

            xit('Добавление одного гаджета в корзину', async () => {
                console.log('============== Добавление одного гаджета в корзину =================');
                const gadgetsPage = new Gadgets(browser);
                await gadgetsPage.page();

                let choosedProduct = await gadgetsPage.chooseProductInMiddle();
                let nameOfProduct = [];
                nameOfProduct.push(await gadgetsPage.getProductName(choosedProduct));

                await gadgetsPage.scrollToProduct(choosedProduct, 'Скролл до выбранного товара');
                await gadgetsPage.clickToBuy(choosedProduct);

                const basketPage = new Basket(browser);
                await basketPage.checkPresence(nameOfProduct);

            });
            xit('Добавление двух гаджетов в корзину', async () => {
                console.log("==================================== Добавление двух гаджетов в корзину ====================");
                const gadgetsPage = new Gadgets(browser);
                await gadgetsPage.page();

                let choosedProduct = await gadgetsPage.chooseProductInMiddle();

                let nameOfProduct = [];
                nameOfProduct.push(await gadgetsPage.getProductName(choosedProduct));

                await gadgetsPage.scrollToProduct(choosedProduct, 'Скролл до выбранного товара');
                await gadgetsPage.clickToBuy(choosedProduct);

                const basketPage = new Basket(browser);
                await basketPage.goBackFromBasket();

                choosedProduct = await gadgetsPage.chooseProductInMiddle();
                nameOfProduct.push(await gadgetsPage.getProductName(choosedProduct));
                //
                await gadgetsPage.scrollToProduct(choosedProduct, 'Скролл до выбранного товара');
                await gadgetsPage.clickToBuy(choosedProduct);
                //
                //
                await basketPage.checkPresence(nameOfProduct);
            });
            it('Проверка количества отображаемых гаджетов на странице', async () => {
                console.log('============== Проверка количества отображаемых гаджетов на странице ==========');
                const gadgetsPage = new Gadgets(browser);
                await gadgetsPage.page();

                // На странице должно быть 24 элемента
                await gadgetsPage.checkCountsElementsOnPage(24)
            });

            xit("Добавленный в корзину гаджет имеет название кнопки - 'В корзине'", async() => {
                console.log("======== Добавленный в корзину гаджет имеет название кнопки - 'В корзине' =====");
                const gadgetsPage = new Gadgets(browser);
                await gadgetsPage.page();

                let choosedProduct = await gadgetsPage.chooseProductInMiddle();
                let nameOfProduct = await gadgetsPage.getProductName(choosedProduct);

                await gadgetsPage.scrollToProduct(choosedProduct, 'Скролл до выбранного товара');
                await gadgetsPage.clickToBuy(choosedProduct);

                const basketPage = new Basket(browser);
                await basketPage.goBackFromBasket();

                choosedProduct = await gadgetsPage.chooseProductByTitle(nameOfProduct);
                await gadgetsPage.scrollToProduct(choosedProduct, 'Скролл до добавленного в корзину товара')

                await gadgetsPage.checkButtonStatus(choosedProduct, 'В корзине')


            });
            xit("Оформление заказа с двумя гаджетами в корзине", async () => {
                console.log("==================== Оформление заказа с двумя гаджетами в корзине ==================");
                const gadgetsPage = new Gadgets(browser);
                await gadgetsPage.page();

                let choosedProduct = await gadgetsPage.chooseProductInMiddle();

                let nameOfProduct = [];
                nameOfProduct.push(await gadgetsPage.getProductName(choosedProduct));

                await gadgetsPage.scrollToProduct(choosedProduct, 'Скролл до выбранного товара');
                await gadgetsPage.clickToBuy(choosedProduct);

                const basketPage = new Basket(browser);
                await basketPage.goBackFromBasket();

                choosedProduct = await gadgetsPage.chooseProductInMiddle();
                nameOfProduct.push(await gadgetsPage.getProductName(choosedProduct));
                //
                await gadgetsPage.scrollToProduct(choosedProduct, 'Скролл до выбранного товара');
                await gadgetsPage.clickToBuy(choosedProduct);

                await basketPage.clickCheckoutOrderButton();
                await basketPage.checkButtonExist('Заказать');

            });

            xit('Проверка суммы добавленных товаров в корзину', async () => {
                console.log(' ================== Проверка суммы добавленных товаров в корзину ================');
                const gadgetsPage = new Gadgets(browser);
                await gadgetsPage.page();

                let choosedProduct = await gadgetsPage.chooseProductInMiddle();

                let priceOfProduct;
                priceOfProduct = await gadgetsPage.getProductPrice(choosedProduct);

                await gadgetsPage.scrollToProduct(choosedProduct, 'Скролл до выбранного товара');
                await gadgetsPage.clickToBuy(choosedProduct);

                const basketPage = new Basket(browser);
                await basketPage.goBackFromBasket();

                choosedProduct = await gadgetsPage.chooseProductInMiddle();
                priceOfProduct += await gadgetsPage.getProductPrice(choosedProduct);

                await gadgetsPage.scrollToProduct(choosedProduct, 'Скролл до выбранного товара');
                await gadgetsPage.clickToBuy(choosedProduct);

                await basketPage.clickCheckoutOrderButton();

                await basketPage.checkSumOfProducts(priceOfProduct)
            });

            xit('Проверка суммы в корзине после удаления товара', async () => {
                console.log(' ================== Проверка суммы в корзине после удаления товара ================');
                const gadgetsPage = new Gadgets(browser);
                await gadgetsPage.page();

                let choosedProduct = await gadgetsPage.chooseProductInMiddle();

                let priceOfProduct;
                priceOfProduct = await gadgetsPage.getProductPrice(choosedProduct);

                await gadgetsPage.scrollToProduct(choosedProduct, 'Скролл до выбранного товара');
                await gadgetsPage.clickToBuy(choosedProduct);

                const basketPage = new Basket(browser);
                await basketPage.goBackFromBasket();

                choosedProduct = await gadgetsPage.chooseProductInMiddle();
                let nameOfProduct = await gadgetsPage.getProductName(choosedProduct);

                await gadgetsPage.scrollToProduct(choosedProduct, 'Скролл до выбранного товара');
                await gadgetsPage.clickToBuy(choosedProduct);

                await basketPage.deleteFromBasket(nameOfProduct);

                await basketPage.clickCheckoutOrderButton();

                await basketPage.checkSumOfProducts(priceOfProduct)
            });


        });

        afterEach("take screenshot on failure", async function () {
            if (this.currentTest.state !== "passed") {
                await browser.takeScreenshot().then(async function (png) {
                    await allure.createAttachment('СКРИНШОТ ОШИБКИ', function () {
                        return new Buffer(png, 'base64')
                    }, 'image/png')();
                })
            }
        });
    }
);
