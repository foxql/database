/**
 * Source Url
 * https://github.com/antonylesuisse/lzwjs/blob/master/lzw.js
 * https://github.com/antonylesuisse/lzwjs
 */

exports.encode = (s,base=64) => {
    if (!s) return s;
    var sym="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_!#%()*+,./:;=?@[]^{|}~ $`";
    sym +="\\1\\2\\3\\4\\5\\6\\7\\b\\t\\v\\f\\16\\17\\20\\21\\22\\23\\24\\25\\26\\27\\30\\31\\32\\33\\34\\35\\36\\37\\xf7&'>\\0\\n\\r\"<\\";
    var size=base*base*base;
    var d=new Map();
    var num=256;
    var logb=Math.log2(base);
    var s=unescape(encodeURIComponent(s)).split("");
    var word=s[0];
    var o=[];
    function pack(word) {
        var key=word.length>1 ? d.get(word) : word.charCodeAt(0);
        for(var n=(Math.log2(num)/logb|0)+1; n; n--) {
            o.push(sym[key%base]);
            key=(key/base|0);
        }
    }
    for (var i=1; i<s.length; i++) {
        var c=s[i];
        if (d.has(word+c)) {
            word+=c;
        } else {
            d.set(word+c,num);
            pack(word);
            word=c;
            if(++num==size-1) {
                d.clear();
                num=256;
            }
        }
    }
    pack(word);
    return o.join("");
}

exports.decode = (s,base=64) => {
    var sym="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_!#%()*+,./:;=?@[]^{|}~ $`";
    sym +="\\1\\2\\3\\4\\5\\6\\7\\b\\t\\v\\f\\16\\17\\20\\21\\22\\23\\24\\25\\26\\27\\30\\31\\32\\33\\34\\35\\36\\37\\xf7&'>\\0\\n\\r\"<\\";
    var size=base*base*base;
    var symd={};
    for(var i=0; i<base; i++){
        symd[sym.charAt(i)]=i;
    }
    var d=new Map();
    var num=257;
    var logb=Math.log2(base);
    var logn=8/logb|0;
    var i=0;
    function unpack(pos=0) {
        return symd[s[i++]]+(pos==logn ? 0 : base*unpack(pos+1));
    }
    var word=String.fromCharCode(unpack());
    var prev=word;
    var o=[word];
    while(i<s.length) {
        logn=Math.log2(num++)/logb|0;
        var key=unpack();
        word=key<256 ? String.fromCharCode(key) : d.has(key) ? d.get(key) : word+word.charAt(0);
        o.push(word);
        if(num==size-1) {
            d.clear();
            num=256;
        }
        d.set(num-2,prev+word.charAt(0));
        prev=word;
    }
    return decodeURIComponent(escape(o.join("")));
}