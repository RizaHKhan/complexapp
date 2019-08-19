import axios from 'axios'

export default class RegistrationForm {
    constructor() {
        this._csrf = document.querySelector('[name="_csrf"]').value
        this.allFields = document.querySelectorAll('#registration-form .form-control')
        this.insertValidationElements()
        this.username = document.querySelector('#username-register')
        this.username.previousValue = ''
        this.events()
    }

    //events
    events() {
        this.username.addEventListener('keyup', ()=> {
            this.isDifferent(this.username, this.usernameHandler)
        })
    }

    //methods

    insertValidationElements() {
        this.allFields.forEach(function(el) {
            el.insertAdjacentHTML('afterend','<div class="alert alert-danger small liveValidateMessage"></div>')
        })
    }

    isDifferent(el, handler) {
        if(el.previousValue != el.value) {
            handler.call(this)
        }

        el.previousValue = el.value
    }

    usernameHandler() {
       this.username.errors = false
       this.usernameImmediately()
       clearTimeout(this.username.timer)
       this.username.timer = setTimeout(() => this.usernameAfterDelay(), 3000)
    }

    usernameImmediately() {
        if (this.username.value != '' && !/^([a-zA-Z0-9]+)$/.test(this.username.value)) {
            this.showValidationError(this.username, 'Username can only contain letters and numbers')
        }

        if(this.username.value.length > 30) {
            this.showValidationError(this.username, 'Username cannot exceed 30 characters');
        }

        if(!this.username.errors) {
            this.hideValidationError(this.username)
        }
    }

    showValidationError(el, message) {
        el.nextElementSibling.innerHTML = message
        el.nextElementSibling.classList.add('liveValidateMessage--visible')
        el.errors = true
    }

    hideValidationError(el) {
        el.nextElementSibling.classList.remove('liveValidateMessage--visible')
    }

    usernameAfterDelay() {
        if(this.username.value.length < 3) {
            this.showValidationError(this.username, 'Username must be atleast 3 characters')
        }

        if (!this.username.errors) {
            axios.post('/doesUsernameExist', {_csrf: this._csrf, username: this.username.value}).then((response)=>{
                if(response.data) {
                    this.showValidationError(this.username, 'That username is already taken')
                    this.username.isUnique = false
                } else {
                    this.username.isUnique = true
                }
            }).catch(()=>{
                console.log('Please try again later')
            })

        }
    }
}