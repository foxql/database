function string(data) {
    return typeof data === 'string'
}

function number(data) {
    return typeof data === 'number'
}

function date(data)
{
    return Object.prototype.toString.call(data) === '[object Date]'
}


export {
    string,
    number,
    date
}