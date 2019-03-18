module.exports = function stepsWithAllure(name, callback) {
        allure.createStep(name, () => {
            callback()
        })
};