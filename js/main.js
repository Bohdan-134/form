document.addEventListener("DOMContentLoaded", function () {

    if (localStorage.getItem('formSubmitted')) {
        disableForm();
    }

    const form = document.querySelector('.form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        clearErrors();

        const nameInput = document.getElementById('name');
        const telInput = document.getElementById('tel');
        const textInput = document.getElementById('text');

        if (nameInput.value.trim() === '') {
            displayError(nameInput, 'Поле "Имя" не должно быть пустым.');
        }

        if (!/^\d{10}$/.test(telInput.value.replace(/\s/g, ''))) {
            displayError(telInput, 'Поле "Телефон" должно содержать 10 цифр без пробелов.');
        }

        if (!/^\S+$/.test(textInput.value)) {
            displayError(textInput, 'Поле "Telegram" должно содержать одно слитное слово.');
        }

        if (!document.querySelectorAll('.error').length) {
            localStorage.setItem('formSubmitted', true);
            sendMessageToTelegram(nameInput.value, telInput.value, textInput.value);
            form.reset();
        }
    });

    function displayError(input, message) {
        const parentDiv = input.closest('[data-type]');
        const errorMessage = parentDiv.querySelector('.error-message');
        errorMessage.textContent = message;
        parentDiv.classList.add('error');

        setTimeout(function () {
            parentDiv.classList.remove('error');
        }, 5000);
    }

    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(message => message.textContent = '');

        const errorFields = document.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
    }

    function sendMessageToTelegram(name, tel, text) {
        const TOKEN = "7164043612:AAFxTS0F8W2uHaCbkPDUbMjp8R7ZGKyYtJE";
        const CHAT_ID = "-4108684630";

        const message = 
            `<b>Новое сообщение с формы:</b>\n` +
            `<b>Имя:</b> ${name}\n` +
            `<b>Телефон:</b> <a href="tel:${tel}">${tel}</a>\n` +
            `<b>Telegram:</b> ${text}
        `;

        const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: message,
                chat_id: CHAT_ID,
                parse_mode: 'HTML',
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при отправке сообщения');
            }
            window.location.href = 'succes.html';
            console.log('good');
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при отправке сообщения в Telegram');
        });
    }
});