// ========================================
// ОБРАБОТКА ФОРМЫ ОБРАТНОЙ СВЯЗИ
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    // Маска для телефона
    const phoneInput = form.querySelector('#phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            if (value.length > 0) {
                if (value[0] === '7' || value[0] === '8') {
                    value = '7' + value.substring(1);
                } else if (value[0] !== '7') {
                    value = '7' + value;
                }
                
                if (value.length >= 1) formattedValue = '+' + value.substring(0, 1);
                if (value.length >= 2) formattedValue += ' (' + value.substring(1, 4);
                if (value.length >= 5) formattedValue += ') ' + value.substring(4, 7);
                if (value.length >= 8) formattedValue += '-' + value.substring(7, 9);
                if (value.length >= 10) formattedValue += '-' + value.substring(9, 11);
            }
            
            e.target.value = formattedValue;
        });
        
        // Предотвращение ввода нецифровых символов
        phoneInput.addEventListener('keypress', function(e) {
            if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab'].includes(e.key)) {
                e.preventDefault();
            }
        });
    }
    
    // Валидация формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получение данных формы
        const formData = {
            name: form.name.value.trim(),
            phone: form.phone.value.trim(),
            message: form.message.value.trim()
        };
        
        // Валидация
        const errors = validateForm(formData);
        
        // Удаление предыдущих ошибок
        removeErrors();
        
        if (Object.keys(errors).length > 0) {
            // Показ ошибок
            showErrors(errors);
            return;
        }
        
        // Отправка формы
        submitForm(formData);
    });
    
    // Функция валидации
    function validateForm(data) {
        const errors = {};
        
        // Проверка имени
        if (!data.name) {
            errors.name = 'Пожалуйста, введите ваше имя';
        } else if (data.name.length < 2) {
            errors.name = 'Имя должно содержать минимум 2 символа';
        } else if (!/^[а-яА-ЯёЁa-zA-Z\s-]+$/.test(data.name)) {
            errors.name = 'Имя может содержать только буквы, пробелы и дефисы';
        }
        
        // Проверка телефона
        if (!data.phone) {
            errors.phone = 'Пожалуйста, введите ваш телефон';
        } else {
            const phoneDigits = data.phone.replace(/\D/g, '');
            if (phoneDigits.length !== 11) {
                errors.phone = 'Введите корректный номер телефона';
            }
        }
        
        // Проверка сообщения
        if (!data.message) {
            errors.message = 'Пожалуйста, введите сообщение';
        } else if (data.message.length < 10) {
            errors.message = 'Сообщение должно содержать минимум 10 символов';
        }
        
        return errors;
    }
    
    // Показ ошибок
    function showErrors(errors) {
        Object.keys(errors).forEach(fieldName => {
            const field = form[fieldName];
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.textContent = errors[fieldName];
            errorDiv.style.cssText = `
                color: #e74c3c;
                font-size: 12px;
                margin-top: 5px;
                animation: fadeIn 0.3s ease;
            `;
            
            field.parentElement.appendChild(errorDiv);
            field.style.borderBottomColor = '#e74c3c';
        });
    }
    
    // Удаление ошибок
    function removeErrors() {
        const errorDivs = form.querySelectorAll('.form-error');
        errorDivs.forEach(div => div.remove());
        
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.style.borderBottomColor = '';
        });
    }
    
    // Отправка формы
    function submitForm(data) {
        // Показываем индикатор загрузки
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        
        // Имитация отправки (в реальном проекте здесь будет AJAX запрос)
        setTimeout(() => {
            // Сброс формы
            form.reset();
            
            // Возврат кнопки в исходное состояние
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            
            // Показ уведомления об успехе
            showSuccessMessage();
        }, 2000);
    }
    
    // Показ сообщения об успехе
    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>Спасибо! Ваша заявка успешно отправлена.</p>
            <p>Мы свяжемся с вами в ближайшее время.</p>
        `;
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            text-align: center;
            z-index: 9999;
            animation: zoomIn 0.3s ease;
        `;
        
        const icon = successDiv.querySelector('i');
        icon.style.cssText = `
            font-size: 48px;
            color: #27ae60;
            margin-bottom: 20px;
            display: block;
        `;
        
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9998;
            animation: fadeIn 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(successDiv);
        
        // Автоматическое закрытие через 3 секунды
        setTimeout(() => {
            successDiv.style.animation = 'zoomOut 0.3s ease';
            overlay.style.animation = 'fadeOut 0.3s ease';
            
            setTimeout(() => {
                successDiv.remove();
                overlay.remove();
            }, 300);
        }, 3000);
        
        // Закрытие по клику
        overlay.addEventListener('click', function() {
            successDiv.remove();
            overlay.remove();
        });
    }
    
    // Удаление ошибок при фокусе
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            const errorDiv = this.parentElement.querySelector('.form-error');
            if (errorDiv) {
                errorDiv.remove();
                this.style.borderBottomColor = '';
            }
        });
    });
});

// CSS анимации для JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes zoomIn {
        from {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
        }
        to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }
    
    @keyframes zoomOut {
        from {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style); 