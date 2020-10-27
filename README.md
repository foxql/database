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
const foxqlIndex = require('foxql-index');

const database = new foxqlIndex();

database.addField([
    'title',
    'content'
]);

database.setRef('documentId');
```

#### Add Analyzer methods
``` javascript

database.registerAnalyzer('tokenizer', (string)=>{
    return string.toLowerCase().replace(/  +/g, ' ').trim();
}); 

```

#### Add document
``` javascript 
    database.addDoc({
        title : 'test title',
        content : 'test example content, very simple usage',
        documentId : 1
    });
```

#### Search document
``` javascript 
    const results = database.search("test query");
    console.log(results);
```


#### Export database
``` javascript
    const dump = database.export();
```

#### Import database
``` javascript
    const dump = database.export();
    database.import(dump);
```

#### Change analyzer methods sort
``` javascript
    database.registerAnalyzer('tokenizer', (string)=>{
        return string.toLowerCase().replace(/  +/g, ' ');
    }); 
    database.registerAnalyzer('tokenizer2', (string)=>{
        return string.trim();
    }); 

    //if want aboving change methods sort

    database.analyzerSteps = [
        'tokenizer2',
        'tokenizer'
    ];
    
```