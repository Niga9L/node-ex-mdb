const keys = require('../keys')

module.exports = function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Создание аккаунта',
        html: `
            <p>Добро пожаловать в магазин</p>
            <p>Вы создали аккаунт с email - ${email}</p>
            <hr/>
            <a href="${keys.BASE_URL}">На сайт</a>
        `
    }
}