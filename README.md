# foxql-index
inverted index database system simple implementation for foxql.
this project is only use term freq.

[Foxql p2p search engine project repo](https://github.com/boraozer/foxql "Foxql p2p search engine project repo")

### Documentation

#### Install npm
```
npm i @foxql/foxql-index
```

#### Basic usage
``` javascript
const foxqlIndex = require('@foxql/foxql-index');

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
```

#### Add Analyzer methods
``` javascript

database.useCollection('entrys').registerAnalyzer('tokenizer', (string)=>{
    return string.toLowerCase().replace(/  +/g, ' ').trim();
}); 

```

#### Add document
``` javascript 
database.useCollection('entrys').addDoc({
    title : 'test title',
    content : 'test example content, very simple usage',
    documentId : 1
});
```

#### Search document
``` javascript 
const results = database.useCollection('entrys').search("test query");
console.log(results);
```


#### Export Database
``` javascript
const dump = database.export();
```

#### Import Database
``` javascript
const dump = database.export();
database.import(dump);
```

#### Change analyzer methods sort
``` javascript
database.useCollection('entrys').registerAnalyzer('tokenizer', (string)=>{
    return string.toLowerCase().replace(/  +/g, ' ');
}); 
database.useCollection('entrys').registerAnalyzer('tokenizer2', (string)=>{
    return string.trim();
}); 

//if want aboving change methods sort

database.useCollection('entrys').analyzerSteps = [
    'tokenizer2',
    'tokenizer'
];
    
```

#### Delete document
``` javascript
database.useCollection('entrys').deleteDoc('ref id');
```

#### Get document by ref
``` javascript
database.useCollection('entrys').getDoc('ref id');
```