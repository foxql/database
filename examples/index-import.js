const foxqlIndex = require('../index.js');

const database = new foxqlIndex();

database.addField([
    'title',
    'content'
]);

database.setRef('documentId');

database.registerAnalyzer('tokenizer', (string)=>{
    return string.toLowerCase().replace(/  +/g, ' ').trim();
}); 

const exportedDatabase = `{
    "documents":{
        "1":{
            "title":"test title",
            "content":"test example content, very simple usage",
            "documentId":1
        }
    },
    "indexs":{
        "title":{
            "test":{
                "1":[0]
            },
            "title":{
                "1":[1]
            }
        },
        "content":{
            "test":{
                "1":[0]
            },
            "example":{
                "1":[1]
            },"content,":{
                "1":[2]
            },"very":{
                "1":[3]
            },"simple":{
                "1":[4]
            },"usage":{
                "1":[5]
            }
        }
    },"stats":{

    },"documentLength":1,
    "documentInfo":{
        "1":{
            "title":{
                "indexPosMap":{
                    "test":[0],
                    "title":[1]
                },"bestTerm":{
                    "keyword":"test",
                    "count":1
                }
                },
    "content":{
        "indexPosMap":{
            "test":[0],
            "example":[1],
            "content,":[2],
            "very":[3],
            "simple":[4],
            "usage":[5]
        },"bestTerm":{
            "keyword":"test",
            "count":1
        }
    }}}}`;

database.import(exportedDatabase);


const results = database.search('test');
console.log(results);