
# Автотесты

## Установка
1. Установите [node.js version 8+]. Данный проект использует современные средства JavaScript, которые не будут работать в старых версиях.
2. Склонируйте репозиторий `git clone тут будет место где лежит шаблон`.
3. Установите все зависимости `npm install`.
4. Запуск тестов осуществляется командой `npm test`. Эта команда запускает Selenium server и прогоняет тесты.
5. Запустите `npm run report` чтобы собрать `html` отчет по результатам тестирования. Он запуститься в браузере.

## Стек разработки 
* [NodeJS]
* [Mocha]
* [Chai]
* [Selenium-webdriver]
* [Allure]

## Описание структуры
Главный принцип, который лежит в основе указанной далее структуры -- попытка максимально разгрузить исполняемые скрипты тестов от кода. Структура автотестов имеет 4 уровня вложенности. Их описание представлено ниже от верхнего до нижнего уровня.

### 0-ой уровень - util/browser.js
```
const  webdriver  =  require('selenium-webdriver');
module.exports  =  function  describeWithBrowser(na me, callback, body) {
	let  browser;
	describe(name, () => {
		// использование beforeEach здесь,приведет к тому, что новый browser 
		//будет получен для каждого тестового примера
		beforeEach(async () => {
			browser  =  new webdriver.Builder()
				.usingServer()
				.withCapabilities({ browserName: 'chrome' }).build();
			await browser.get('http://moskva.beeline.ru/shop/');
			await browser.manage().addCookie({ name: 'ABTest', value: 'new' });
			callback(browser);
		});
		body();
		// закрываем browser, когда нам он больше не нужен,
		// чтобы избежать мертвых сессий.
		afterEach(() => {
			return browser.quit();
		});
	});
};
```
### I-ый уровень - JS-сценарии из tests/
Представляют из себя максимально простой по структуре и содержанию файл, где в it'ах дергается единственный (или возможно нет) метод. Представлю примерную структуру ниже:
```
const  describeWithBrowser  =  require("../util/browser");
describeWithBrowser(
	"EShop B2C", // имя раздела тестов
	b  => (browser  =  b), 
	() => {
		describe("Catalog", () => {
			beforeEach(async () => {});
			before(async () => {});
			
			it('Имя теста', async () => {
				await testingSomething({
					browser: browser
					// и другие параметры
				})
			});
		});
		afterEach("take screenshot on failure", async  function() {
			if (this.currentTest.state  !==  "passed") {
				screenshot(browser, `Скриншот ошибки`);
			}
		});
	}
);
```
### II-ый уровень - JS-методы из testsCases/
Данный уровень содержит логику протекания тестов. Каждый js-файл содержит одну мастер-функцию, которая принимает в качестве аргумента объект c параметрами.  Подразумевает интуитивно понятный код  (pay attention названиям методов и переменных ). Под собой может иметь n-ное множество условных циклов, однако ветвление не приветствуется (в качестве решения данной проблемы предлагается разделить сложный тест-кейс на два).
Именно в данных мастер-методах и происходят все сравнения с эталонными данными при помощи [Chai] (expect/should).
```
const  SomePage  =  require('../../pageObjects/SomePage');
async  function  testingSomething({
	browser,
	someArg = 21 
}) {
	const  somePage  =  new  SomePage(browser);
	const  anotherPage  =  await somePage.somePageFunc(someArg);
	const pageNum = await anotherPage.getPageNum();
	pageNum.should.equal(someArg, `Подпись в случае неудачи`);
	...
	
}
module.exports  =  testingSomething;
```
### III-ый уровень - JS-классы из pageObjects/
Самый "глубокий" уровень -  класс-объекты страниц c реализацией их методов с прямым обращением к методам selenium-webdriver
```
const { By, until } =  require('selenium-webdriver');
const  Catalog  =  require('./Catalog');
const  screenshotWithCircle  =  require('../util/screenFunc');

class  SomePage {
	constructor(driver) {
		this.driver  =  driver;
		screenshotWithCircle(this.driver, 'Просто скриншот');
	}
	async  somePageFunc(arg) {
		let  selector  =  `li[data-slug=${arg}] a`;// some selector
		const  webelement  =  await  this.driver.findElement(By.css(selector));
		await  screenshotWithCircle(this.driver, 'Скриншот', webelement);
		await webelement.click();
		return  new  Catalog(this.driver);
	}
}
module.exports  =  Start;
```


## Структура проекта

*  **allure-report/** -- какталог отчета allure
*  **allure-results/** -- каталог с xml-файлами allure и вложениями
	* **history**/ -- каталог хранения истории и тенденций тестирования для графиков allure
	* **environment.properties** -- настройки содержания раздела ENVIRONMENT главной страницы отчета allure
	*  **screenshot_1.png**
*  **history-temp/** -- каталог для хранения дампа истории (полноценная поддержка которой с JS ожидается только в allure 3)
*  **pageObjects/** -- каталог с объектами страницы. 
	* **ExamplePage.js** 
*  **tests/** --
	* **mocha.opts** -- настройки mocha
	* **testScript.js** -- исполняемый скрипт теста
	*  **...**
*  **testCases/** -- каталог, содержащий методы тестирования
	* **testCaseSuite.js** --  файл конкретного тест-сьюта
	* **...**
* **util/** -- каталог, содержащий вспомогательные методы тестирования
	* **before.js** -- опциональный скрипт, который вызывается из tests/testScript.js в функции before. Используется, например, для парсинга необходимых данных перед проходом всех тестов.
	* **browser.js** -- функция, которая содержит описание поведения js-файлов из **tests/**
	* **screenFunc.js** -- метод, делающий скриншот
***
### util/screenFunc.js
js-скрипт, вызываемый только в методах pageObjects для прикрепления к отчету скриншота. Имеет 4 аргумента:
* объект webdriver (обязательный)
* текст, который будет отображен в скриншоте (обязательный)
* webelement (для обводки объекта, по которому просиходит клик)
* bool - параметр, который отвечает за включение-выключение обводки элемента клика, по умолчанию: true, (опционально)

С примерами вызовов можно ознакомиться ниже.
***
### PageObjects/

pageObject, объект страницы - это удобный способ создания многоразовых действий для взаимодействия со страницей. Пример реализации c использованием конструкции class (но в целом, возможно, использование  конструкции функциональных классов). Класс содержит прямые методы взаимодействия с страницей. Именно в методах классов объектов происходит использование методов selenium (и больше нигде). Продемонстрируем пример класса для стартовой страницы [Интернет-магазина Билайн](beeline.ru/shop): 
![Скриншот beeline.ru/shop](https://raw.githubusercontent.com/dmred/screens/master/startPage.png "Стартовая страница интернет магазина")

**Кейс:** переход на страницу каталога телефонов со стартовой страницы
Ниже приведен пример класса стартовой страницы тестирования  с методом goToTelephonesCatalogPageFromMenu, реализующий наш переход.
```
const { By, until } =  require('selenium-webdriver');
const  Catalog  =  require('./Catalog');
const  screenshotWithCircle  =  require('../util/screenFunc');

class  Start {
	constructor(driver) {
		this.driver  =  driver;
		screenshotWithCircle(this.driver, 'Стартовая страница Beeline.ru/shop');//вызов скриншота без обоводки
	}
	async  goToTelephonesCatalogPageFromMenu() {
		let  selector  =  'li[data-slug=telefony] a';
		const  item  =  await  this.driver.findElement(By.css(selector));
		await  screenshotWithCircle(this.driver, 'Переход в каталог смартфонов', item);// скриншот с 
		//обводкой webelent'a item
		await item.click(); // клик по item
		await  this.driver.wait(until.elementLocated(By.css('div.layout-section.shop-section'))); // опциональное ожидание загрузки элемента
		return  new  Catalog(this.driver); // возвращаем новый экзэмпляр Catalog
	}
}
module.exports  =  Start;
```
в результате вызова метода goToTelephonesCatalogPageFromMenu()  мы получаем экзэмпляр класса Catalog и к отчету alure уже прикреплены два скриншота:
* скриншот из конструктора startPage
* сриншот из вызова goToTelephonesCatalogPageFromMenu 

![отчет allure](https://raw.githubusercontent.com/dmred/screens/master/attachmentsExample.png)


[node.js version 8+]: https://nodejs.org/en/download/
[NodeJS]: https://nodejs.org/en/
[Mocha]: https://mochajs.org/
[Chai]: http://www.chaijs.com/
[Selenium-webdriver]: http://seleniumhq.github.io/selenium/docs/api/javascript/
[Allure]:http://allure.qatools.ru/
