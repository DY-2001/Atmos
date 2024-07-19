const isValidPassword = password => {
    const re = /^(?=.*[a-z])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(String(password));
}

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const registerValidation = ({userName, email, password}) => {
    if (!userName) {
        return 'Username is required';

    } else if (userName.length < 3) {
        return 'Username must be at least 3 characters';

    } else if (userName.length > 20) {
       return 'Username must be less than 20 characters';
    }

    if (!email) {
       return 'Email is required';
    } else if (!isValidEmail(email)) {
       return 'Email is invalid';
    }

    if (!password) {
        return 'Password is required';
     }
    else if (!isValidPassword(password)) {
        return 'Password should be atleast 8 characters long and should contain atleast one lowercase letter';
    }
    return '';
}

const loginValidation = ({email, password}) => {
    if (!email) {
        return 'Email is required';
    } else if (!isValidEmail(email)) {
        return 'Email is invalid';
    }
    if (!password) {
        return 'Password is required';
    }
    return '';
}

module.exports = { registerValidation, loginValidation };