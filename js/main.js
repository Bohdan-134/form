document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('.form');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        // Clear previous error messages and error highlighting
        clearErrors();

        // Validate each input field
        const nameInput = document.getElementById('name');
        const telInput = document.getElementById('tel');
        const textInput = document.getElementById('text');

        // Validation for Name field
        if (nameInput.value.trim() === '') {
            displayError(nameInput, 'Поле "Имя" не должно быть пустым.');
        }

        // Validation for Telephone field
        if (!/^\d{10}$/.test(telInput.value.replace(/\s/g, ''))) {
            displayError(telInput, 'Поле "Телефон" должно содержать 10 цифр без пробелов.');
        }

        // Validation for Telegram field
        if (!/^\S+$/.test(textInput.value)) {
            displayError(textInput, 'Поле "Telegram" должно содержать одно слитное слово.');
        }

        // If no errors, submit the form
        if (!document.querySelectorAll('.error').length) {
            sendMessageToTelegram(nameInput.value, telInput.value, textInput.value);
            // Here you can proceed with form submission or any other action
            // For now, just clear the input fields
            nameInput.value = '';
            telInput.value = '';
            textInput.value = '';
        }
    });

    // Function to display error messages and highlight the input fields
    function displayError(input, message) {
        const parentDiv = input.closest('[data-type]');
        const errorMessage = parentDiv.querySelector('.error-message');
        errorMessage.textContent = message;
        parentDiv.classList.add('error');

        // Remove the error class after 5 seconds
        setTimeout(function () {
            parentDiv.classList.remove('error');
        }, 5000);
    }

    // Function to clear previous error messages and error highlighting
    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(message => message.textContent = '');

        const errorFields = document.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
    }

    // Function to send message to Telegram
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