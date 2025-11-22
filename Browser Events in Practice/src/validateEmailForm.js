export function validateEmailForm() {
    const form = document.querySelector('.email-form');
    const toField = document.getElementById('to-field');
    const validMark = toField.parentNode.querySelector('.email-form__valid-mark');
    const topicField = document.getElementById('topic-field');
    const acceptTerms = document.getElementById('accept-terms');
    const submitButton = document.querySelector('.email-form__button');

    function validateToField(value) {

        if (value.length < 4) {
            return false;
        }

        const atIndex = value.indexOf('@');
        if (atIndex === -1 || atIndex === 0 || atIndex === value.length - 1) {
            return false;
        }

        if (value.includes(' ')) {
            return false;
        }

        return true;
    }

    toField.addEventListener('input', function() {
        const isValid = validateToField(this.value);
        if (isValid) {
            validMark.classList.remove('hidden');
        } else {
            validMark.classList.add('hidden');
        }
    });

    topicField.addEventListener('focus', function() {
        this.classList.remove('email-form__input_warning');
    });

    topicField.addEventListener('blur', function() {
        if (!this.value || !this.value.trim()) {
            this.classList.add('email-form__input_warning');
        }
    });

    acceptTerms.addEventListener('change', function() {
        submitButton.disabled = !this.checked;
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const customEvent = new CustomEvent('email-form-submit', {
            bubbles: true
        });

        this.dispatchEvent(customEvent);
    });
}
