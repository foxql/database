import indexs from './src/foxql-index.js';

class database {

    constructor()
    {
        this.collections = {}
        this.analyzers = {}
    }

    pushCollection({collectionName, fields, ref})
    {
        let collection = new indexs();
        collection.addField(fields);
        collection.setRef(ref);

        this.collections[collectionName] = collection
    }

    useCollection(collectionName)
    {
        return this.collections[collectionName] || false;
    }

    export()
    {
        let dump = {};
        const collections = this.collections;
        for(let collectionName in collections){
            const indexs = collections[collectionName];
            dump[collectionName] = indexs.export();
        }

        return dump;
    }

    import(dumpObject)
    {
        for(let collectionName in dumpObject) {

            const collection = new indexs();

            collection.import(
                dumpObject[collectionName]
            );

            this.collections[collectionName] = collection
        }
    }
}

export default database;