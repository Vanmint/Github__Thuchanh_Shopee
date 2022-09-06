
// Đối tương Validator
function Validator (options) {

    function getParent (element, selector){
        while (element.parentElement) {
            if (element.parentElement.matches (selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};
    // hàm thực hiện hiện ra lỗi hoặc bỏ đi
    function validate (inputElement, rule) {
        var errorMessage;

        // Từ inputElement tìm dc element cha => tìm element options.errorSelector
        var errorElement = getParent (inputElement, options.formGroupSelector).querySelector (options.errorSelector);
        
        // lấy ra các rules của selectorr
        var rules = selectorRules [rule.selector];

        // lặp qua từng rule và kiểm traa
        // nếu có lỗi thì dừng việc kiểm tra
        for (var i=0; i <rules.length; ++i){
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if (errorMessage) break;
        }
        

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        return !errorMessage;
    }

    // Lấy element của form cần validate
    var formElement= document.querySelector (options.form);

    if (formElement) {
        // khi submit formm
        formElement.onsubmit = function (e){
            e.preventDefault ();

            // Nếu không có lỗi thì true
            var isFormValid = true

            // Thực hiện lặp qua từng rules và  validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector (rule.selector);
                var isValid = validate (inputElement, rule);

                // Nếu có 1 ông không isValid
                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid){
                // Trường hợp submit với JS
                if (typeof options.onsubmit === 'function'){
                // lấy ra các thẻ input ở trạng thái enable
                var enableInputs = formElement.querySelectorAll ('[name]');

                var forValues = Array.from (enableInputs).reduce (function (values, input) {
                    values[input.name] = input.value;
                    return values;
                }, {});
                options.onsubmit (forValues);

                } else {
                    formElement.submit();
                }

            }

        }

        // Xử lý lặp qua mỗi rules và cách xử lý (lắng nghe sự kiện blurr, input, ...)
        options.rules.forEach(function (rule) {

            // Lưu lại các rules cho mỗi inputt
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push (rule.test);
            } else  {
                selectorRules[rule.selector]= [rule.test];
            };

            var inputElement = formElement.querySelector (rule.selector);
            

            if (inputElement) {
                // xử lý blur khỏi input
                inputElement.onblur = function () {
                    // lấy được value qua inputElement.value (value ng dùng nhập vào)
                    // dùng test funs qua rule.test để kiểm tra xem người dùng đã nhập value chưa
                    validate (inputElement, rule);
                } 

                //  xử lý mỗi khi ng dùng nhập vào
                inputElement.oninput = function () {
                    var errorElement = inputElement.getParent (inputElement, options.formGroupSelector).querySelector (options.errorSelector);

                    errorElement.innerText = '';
                    inputElement.getParent (inputElement, options.formGroupSelector).classList.remove ('invalid')
                }

            }
        });
    }
}


// Định nghĩa các rule
// Nguyên tắc của các rules:
// 1.khi có lỗi => trả ra meg có lỗi
// 2.khi hợp lệ => không trả ra cái gì cả (undefined)
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này'
        }
    }
}, 

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message ||'Trường này phải là email'

        }
    }
},

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự`
        }
    }
},

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue () ? undefined : message || 'Giá trị nhập vào không chính xác'
        }
    }
}

// Click/close đăng kí

const registerBtn = document.querySelector('.registerBtn');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector ('.form-controls-back')
const modalContainer = document.querySelector('#form-1')


function showRegister(){
    modal.classList.add('open')

}

function hideRegister(){
    modal.classList.remove('open')
}

// registerBtn.addEventListener('click', showRegister);


modalClose.addEventListener('click', hideRegister);
 
modal.addEventListener('click', hideRegister);

modalContainer.addEventListener('click', function(event){
    event.stopPropagation()
});