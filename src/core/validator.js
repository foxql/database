import hash from 'hash.js';
import * as typeCheck from '../utils/typeCheck';

function tokenizer(string)
{
    return string.toLowerCase().replace(/[^\w\s]/gi, '').replace(/ +/g, '').trim();
}


function typeControl(type, data)
{
    const method = typeCheck[type] || false;
    if(!method) return false;

    return method(data);
}

const methods = {
    min : (min, data)=> { return data.length < min ? false : true },
    max : (max, data)=>{ return data.length > max ? false : true },
    size : (size, data) => { return data.length !== size },
    type : (type, data)=> { 
        if(Object.prototype.toString.call(type) === '[object Array]') {
            let typeControlLoopLength = type.length;
            let typeControlFailCount = 0;
            for(let typeName in type) {
                const targetTypeControl = typeControl(type[typeName], data);
                if(!targetTypeControl) {
                    typeControlFailCount++;
                }
            }
            return typeControlFailCount >= typeControlLoopLength ? false : true;
        }

        return typeControl(type, data)
    },
    makeFrom : (fields, data) => {
        let generatedRef = '';
        
        fields.forEach( field => {
            const value = data[field];
            if(typeof value === 'string') {
                generatedRef += tokenizer(data[field])
            }
            
        });

        return hash.sha256().update(generatedRef).digest('hex')
    }
};


const exceptionalMethodMap = {
    makeFrom : true
};






export default function validate(document, constraint, refName) {

    let fail = false;
    let generatedRef = false;
    let generatedFields = [];

    for(let field in constraint) {
        const rules = constraint[field];
        if(document[field] === undefined && rules.makeFrom == undefined) {
            fail = true
            break;
        }
        const documentValue = document[field] === undefined ? false : document[field];
        for(let method in rules) {

            const ruleValue = rules[method];

            if(exceptionalMethodMap[method] !== undefined ) {
                if(method == 'makeFrom') {
                    const generatedHash = methods[method](ruleValue, document);
                    if(refName == field) {
                        generatedRef = generatedHash
                    }else {
                        generatedFields.push({
                            field : field,
                            value :  generatedHash
                        });
                    }
                    
                }
                continue
            }
        
            if(!methods[method](ruleValue, documentValue)){
                fail = true;
                break;
            }
        }
    }


    return {
        fail : fail,
        generatedRef : generatedRef,
        generatedFields : generatedFields
    };
}