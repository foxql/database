class database{

    constructor()
    {
        this.documents = {};
        this.indexs = {};
        this.ref = 'id';    
        this.analyzers = {};
        this.indexSeperator = ' ';
        this.documentLength = 0;
        this.analyzerSteps = [];
        this.documentInfo = {};
    }

    registerAnalyzer(name, method){
        this.analyzers[name] = method;
        this.analyzerSteps.push(name)
    }

    addField(fields){fields.forEach(field => this.indexs[field] = {});}

    setRef(ref){this.ref = ref;}

    startAnalyzer(string)
    {
        this.analyzerSteps.forEach(name => {
            const method = this.analyzers[name]
            string = method(string);
        });
        return string;
    }

    addDoc(doc)
    {
        const docRef = doc[this.ref] || false;
        if(!docRef){return false;}

        for(let field in doc){
            if(!this.checkField(field) || field == this.ref){continue;}
            this.pushIndex(field,this.startAnalyzer(doc[field]),docRef);
        }

        this.documents[docRef] = doc;
        this.documentLength++;
        return true;
    }

    createStringIndexMap(string)
    {
        let indexPosMap = {};
        string.split(this.indexSeperator).forEach((value, index) => {
            if(indexPosMap[value] == undefined){
                indexPosMap[value] = [index];
            }else{
                indexPosMap[value].push(index);
            }
        });

        return indexPosMap;
    }

    findStringInMaxTerm(string)
    {
        let result = {
            keyword : null,
            count : 0
        };

        let processMap = {};

        string.split(this.indexSeperator).forEach(keyword => {
            if(processMap[keyword] == undefined){
                processMap[keyword] = 0;
            }
            processMap[keyword] ++;
        });

        const oneDimensionalMapResult = [];

        for(let keyword in processMap){
            oneDimensionalMapResult.push({
                keyword : keyword,
                count : processMap[keyword]
            });
        }

        oneDimensionalMapResult.sort((a, b) => parseFloat(b.count) - parseFloat(a.count));

        return oneDimensionalMapResult[0];
    }

    pushIndex(field, string, ref)
    {
        let indexPosMap = this.createStringIndexMap(string);

        if(this.documentInfo[ref] === undefined){
            this.documentInfo[ref] = {};
        }

        this.documentInfo[ref][field] = {
            indexPosMap : indexPosMap,
            bestTerm : this.findStringInMaxTerm(string)
        };

        for(let index in indexPosMap){
            if(this.indexs[field][index] == undefined){
                this.indexs[field][index] = {};
            }
            this.indexs[field][index][ref] = indexPosMap[index];
        }
    }

    checkField(field){return this.indexs[field] ? true : false;}

    deleteDoc(ref)
    {
        const targetDoc = this.getDoc(ref);
        if(!targetDoc) return false;

        for(let field in targetDoc){
            if(!this.checkField(field) || field == this.ref){continue;}

                const targetIndexs = this.createStringIndexMap(
                    this.startAnalyzer(targetDoc[field])
                );
                for(let index in targetIndexs){
                    delete this.indexs[field][index][ref];
                    if(Object.keys(this.indexs[field][index]).length <=0){
                        delete this.indexs[field][index];
                    }
                }
        }

        delete this.documents[ref];
        this.documentLength--;        
        return true;
    }

    getDoc(ref){ return this.documents[ref] || false }

    search(query)
    {
        let resultMap = {};
        const splitQuery = this.startAnalyzer(query).split(this.indexSeperator);
        splitQuery.forEach(term => {
            for(let field in this.indexs){
                const indexs = this.indexs[field][term] || false;
                if(!indexs){continue;}
                const findingRefs = Object.keys(indexs);

                if(findingRefs.length <= 0){continue}

                findingRefs.forEach(ref => {
                    const doc = this.documents[ref];
                    const info = this.documentInfo[ref][field];
                    if(resultMap[ref] == undefined){
                        resultMap[ref] = {
                            document : doc,
                            score : 0
                        };
                    }

                    if(info.indexPosMap[term].length > 0){
                        resultMap[ref].score += info.indexPosMap[term].length  / info.bestTerm.count; 
                    }
                });
            }
        });

        let oneDimensionalResult = [];
        for(let key in resultMap){
            oneDimensionalResult.push(resultMap[key]);
        }

        oneDimensionalResult.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
        
        return oneDimensionalResult;
    }

    export()
    {
        return JSON.stringify({
            documents : this.documents,
            indexs : this.indexs,
            stats : this.stats,
            documentLength : this.documentLength,
            documentInfo : this.documentInfo
        });
    }

    import(dumpString)
    {
        const dumpObject = JSON.parse(dumpString);
        this.documents = dumpObject.documents;
        this.indexs = dumpObject.indexs;
        this.stats = dumpObject.stats; 
        this.documentLength = dumpObject.documentLength;
        this.documentInfo = dumpObject.documentInfo;
        return true;
    }
}


module.exports = database;