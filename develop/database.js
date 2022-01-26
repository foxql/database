import foxqlIndex from '../index.js';

const database = new foxqlIndex();

database.pushCollection({
    collectionName : 'entrys',
    fields : [
        'title',
        'content',
        'entryKey',
        'parentDocumentId',
        'createDate'
    ],
    ref : 'documentId',
    schema : {
        title : {
            type : 'string',
            min : 3,
            max : 80
        },
        content : {
            type : 'string',
            min : 7,
            max : 500
        },
        documentId : {
            makeFrom : ['title', 'content', 'parentDocumentId']
        },
        entryKey : {
            makeFrom : ['title']
        },
        createDate : {
            type : 'date'
        }
    }
});

database.useCollection('entrys').registerAnalyzer('tokenizer', (string)=>{
    return string.toLowerCase().replace(/ +/g, ' ').trim();
});

database.useCollection('entrys').addDoc({
    title : 'test title',
    content : 'test example content, very simple usage',
    createDate : new Date(),
    parentDocumentId : null
});



window.db = database