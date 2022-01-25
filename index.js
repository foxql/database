import indexs from './src/core/invertedIndex';
import  version from './src/version';
import { encode, decode } from './src/utils/lz77';
import {compress, decompress} from 'lzutf8';
class database {

    constructor()
    {
        this.collections = {}
        this.version = version;
    }

    pushCollection({collectionName, fields, ref, schema})
    {
        let collection = new indexs();
        collection.addField(fields);
        collection.setRef(ref);
        collection.setSchema(schema);

        this.collections[collectionName] = collection;
    }

    useCollection(collectionName)
    {
        return this.collections[collectionName] || false;
    }

    export()
    {
        let dump = {
            collections : {},
            version : this.version
        };
        const collections = this.collections;
        for(let collectionName in collections){
            const indexs = collections[collectionName];
            dump.collections[collectionName] = indexs.export();
        }
        
        return compress(JSON.stringify(dump), {outputEncoding: "StorageBinaryString"})
    }

    import(dumpString)
    {
        const jsonString = decompress(dumpString, {inputEncoding: "StorageBinaryString"})
        const dumpObject = JSON.parse(jsonString);

        const dumpCollections = dumpObject.collections;

        for(let collectionName in dumpCollections) {

            if(this.collections[collectionName] === undefined) {
                continue;
            }

            const documents = Object.values(dumpCollections[collectionName]);
            const targetCollection = this.useCollection(collectionName);

            documents.forEach(doc => {
                targetCollection.addDoc(doc)
            })
        }

        return true;
    }
}

export default database;