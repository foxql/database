import foxqlIndex from '../index.js';

const database = new foxqlIndex();

database.pushCollection({
    collectionName : 'entrys',
    fields : [
        'title',
        'content'
    ],
    ref : 'documentId'
});

database.useCollection('entrys').registerAnalyzer('tokenizer', (string)=>{
    return string.toLowerCase().replace(/  +/g, ' ').trim();
});

database.useCollection('entrys').addDoc({
    title : 'test title',
    content : 'test example content, very simple usage',
    documentId : 1
});

const dump = database.export();

database.import(dump);



window.db = database