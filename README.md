# foxql-index
inverted index database system simple implementation for foxql.
this project is only use term freq.

[Foxql p2p search engine project repo](https://github.com/boraozer/foxql "Foxql p2p search engine project repo")

### Documentation
``` javascript
const foxqlIndex = require('./index.js');

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

//database.deleteDoc(1);

const results = database.search('test');

console.log(results);`
```
