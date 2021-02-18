Date.prototype.isValid = function () {
    // An invalid date object returns NaN for getTime() and NaN is the only
    // object not strictly equal to itself.
    return this.getTime() === this.getTime();
};  

function string(data) {
    return typeof data === 'string'
}

function number(data) {
    return typeof data === 'number'
}

function date(data)
{
    if(Object.prototype.toString.call(data) === '[object Date]') {
        return data.isValid();
    }else if(typeof data === 'string') {
        return new Date(data).isValid()
    }

    return false;
}


export {
    string,
    number,
    date
}