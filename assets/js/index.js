
// Hàm sử lí validation
function Validation(options) {

    // function getParent(inputElement, selector) { 

    //     while(inputElement.parentNode) {
    //         if(inputElement.parentNode.matches(selector)) {
    //             return inputElement.parentNode;
    //         }
    //         inputElement = inputElement.parentNode;
    //     }
    // }

    // Hàm xử lý validate
    function validate(inputElement, rule) {
        // Lấy giá trị của input;
        var inputValue = inputElement.value;
        
        // Lấy tag html để inner message error
        const elementParent = inputElement.closest(options.formGroup);
        const messageElement = elementParent.querySelector(options.messageElement);

        // Kiểm tra nếu chưa nhập vào input thì lấy message lỗi
        const errorMessage = rule.test(inputValue);
        if(errorMessage) {
            messageElement.innerHTML = errorMessage;
            inputElement.parentNode.classList.add(options.styleError);
        } else {
            messageElement.innerHTML = '';
            inputElement.parentNode.classList.remove(options.styleError);
        }
        return !errorMessage;
    }

    // Lấy form cần xử lý
    const formElement = document.querySelector(options.form);
    if(formElement) {
        // Khi submit form
        formElement.onsubmit = function(e) {
            e.preventDefault();     // Bỏ hành vi mặc định của form

            // Đặt cờ hiệu mặc định form đang valid
            let isFormValid = true;

            // Lặp qua từng rule và validate
            options.rules.forEach(function(rule) {
                const inputElement = formElement.querySelector(rule.selector);
                let isValid = validate(inputElement, rule);
                // Kiểm tra nếu có 1 input chưa nhập thì gán false
                if(!isValid) {
                    isFormValid = false;
                }
            });

            if(isFormValid) {
                // Trường hợp xử lý submit bằng JavaScript
                if(typeof options.onsubmit === 'function') {
                    // Select tất cả các field có attribute là [name] và nó không có attribute là [disabled] 
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
                    // enable đang là NodeList sử dụng Array.from để convert sang array
                    var formValues = Array.from(enableInputs).reduce(function (value, input) {
                        value[input.name] = input.value
                        return value;
                    }, {});

                    options.onsubmit(formValues);
                }
                // Trường hợp xử lý submit bằng hành vi mặc định
                else {
                    formElement.submit();
                }
            }
        }
        // Lặp qua các rule
        options.rules.forEach(function(rule) {
            // Lấy input cần xử lý
            const inputElement = formElement.querySelector(rule.selector);

            if(inputElement) {
                // Sự kiện blur khỏi input
                inputElement.onblur = function() {
                    validate(inputElement, rule);
                }
                // Sự kiện input khi người dùng nhập value
                inputElement.oninput = function() {
                    const messageElement = inputElement.parentNode.querySelector(options.messageElement);
                    messageElement.innerHTML = '';
                    inputElement.parentNode.classList.remove(options.styleError);
                }
            }
        })
    }
}


Validation.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này';
        }
    }
}

Validation.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if(value.length <= 0) {
                return 'Vui lòng nhập trường này';
            }
            return regex.test(value) ? undefined : message || 'Email không hợp lệ';
        }
    }
}

Validation.isPassword = function(selector, minLength, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= minLength ? undefined : message || `Nhập tối thiểu ${minLength} ký tự`;
        }
    }
}

Validation.isPasswordConfirm = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            if(value.length <= 0) {
                return 'Vui lòng nhập trường này';
            }
            return value === getConfirmValue() ? undefined : message || 'Vui lòng nhập trường này';
        }
    }
}

Validation({
    form: '#form-1',
    formGroup: '.form-group',
    messageElement: '.form-message',
    styleError: 'invalid',
    rules: [
        Validation.isRequired('#fullname'),
        Validation.isEmail('#email'),
        Validation.isPassword('#password', 8),
        Validation.isPasswordConfirm('#password_confirmation', function() {
            return document.querySelector('#form-1 #password').value;
        }, 'Mật khẩu nhập lại không chính xác')
    ],
    onsubmit: function(data) {
        console.log(data);
    }
});
