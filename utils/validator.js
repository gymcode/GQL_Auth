module.exports.UserRegistrationValidator = (username, email, password, confirmPassword)=>{
    const errors = {}
    if (username.trim() === "") {
        errors.username = 'Username field must not be empty'
    }
    if (email.trim() === "") {
        errors.email = 'email field must not be empty'
    } else {
        const email_regex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
        if (!email.match(email_regex)) {
            errors.email = "enter a valid email address"
        }
    }
   
    if (password.trim() === "") {
        errors.password = 'password field must not be empty'
    } else if (password !== confirmPassword){
        errors.password = 'Passwords do not match'
    }

    return {
        errors, 
        valid: Object.keys(errors).length < 1
    }
}

module.exports.UserLoginValidator = (email, password)=>{
    const errors = {}
    if (email.trim() === "") {
        errors.email = 'email field must not be empty'
    } else {
        const email_regex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
        if (!email.match(email_regex)) {
            errors.email = 'please enter a valid email address'
        }
    }

    if (password.trim() === "") {
        errors.password = ' password field must not be empty'
    }

    return {
        errors, 
        valid: Object.keys(errors) < 1
    }
}