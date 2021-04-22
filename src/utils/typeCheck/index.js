Date.prototype.isValid = function () {
    return this.getTime() === this.getTime();
};  

function string(data) {
    return typeof data === 'string'
}

function number(data) {
    return typeof data === 'number'
}

function empty(data)
{
    return data === null;
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
    date,
    empty
}