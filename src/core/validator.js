import hash from 'hash.js';
import * as typeCheck from '../utils/typeCheck';

function tokenizer(string)
{
    return string.toLowerCase().replace(/[^\w\s]/gi, '').replace(/ +/g, '').trim();
}


const methods = {
    min : (min, data)=> { return data.length < min ? false : true },
    max : (max, data)=>{ return data.length > max ? false : true },
    size : (size, data) => { return data.length !== size },
    type : (type, data)=> { 
        const method = typeCheck[type] || false;
        if(!method) return false;

        return method(data);
    },
    required : (field, data) => { return data[field] ? false : true },
    createField : (fields, data) => {
        let generatedRef = '';
        
        fields.forEach( field => {
            generatedRef += tokenizer(data[field])
        });

        return hash.sha256().update(generatedRef).digest('hex')
    }
};


const exceptionalMethodMap = {
    createField : true
};






export default function validate(document, constraint, refName) {

    let fail = false;
    let generatedRef = false;
    let generatedFields = [];

    for(let field in constraint) {
        const rules = constraint[field];
        const documentValue = document[field] || false;
        
        for(let method in rules) {

            const ruleValue = rules[method];

            if(exceptionalMethodMap[method] !== undefined ) {
                if(method == 'createField') {
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