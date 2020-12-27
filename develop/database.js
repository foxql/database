import foxqlIndex from '../index.js';

const database = new foxqlIndex();

database.pushCollection({
    collectionName : 'entrys',
    fields : [
        'title',
        'content'
    ],
    ref : 'documentId',
    schema : {
        title : {
            type : 'string',
            min : 3,
            max : 80,
            required : true
        },
        content : {
            type : 'string',
            min : 7,
            max : 500,
            required : true
        },
        documentId : {
            createField : ['title', 'content']
        }   
    }
});

database.useCollection('entrys').registerAnalyzer('tokenizer', (string)=>{
    return string.toLowerCase().replace(/ +/g, ' ').trim();
});

database.useCollection('entrys').addDoc({
    title : 'test title',
    content : 'test example content, very simple usage',
    documentId : 1
});



window.db = database