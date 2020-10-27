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

database.addDoc({
    title : 'test title',
    content : 'test example content, very simple usage',
    documentId : 1
});


const dump = database.export();
console.log(dump); 