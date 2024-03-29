const js_beautify = require('js-beautify');
const Rewrite = class {

    static getInstance() {
        if( Rewrite._instance == undefined ) {
            Rewrite._instance = new Rewrite();
        }
        return Rewrite._instance;
    }

    exec ( f, me, ...args ) {
        const af = this._rewrite( f );
//        console.log(af);
        let bindedFunc = af.bind( me );
        bindedFunc(...args);
    }
    execThread( f, me, ...args ) {
//        console.log("execThread(1)", f);
        const af = this._rewrite( f );
//        console.log("execThread(2)", af);
        let bindedFunc = af.bind( me );
        let t = setTimeout(bindedFunc, 0, ...args);
        return t;
    }
    _removeOuter( funcS ) {
        return funcS.substring(funcS.indexOf('{') + 1, funcS.lastIndexOf('}'));
    }
    _removeComments ( funcS ) {
        return funcS.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');
    }
    _getEventObjectVarName ( funcS ) {
        return funcS.substring(funcS.indexOf('(') + 1, funcS.indexOf(')'))
    }
    static get constant() {
        return {
            RegexLoopDef : /([while|for]\s\([^\)]*?\)\s)({)/g ,
            LoopProtectionIsDone : /_waitRapperRewrited/,
            LoopProtectionCode : `await P.Utils._waitRapperRewrited(P.Env.pace); \n` ,
            JsBeautifyOptions : {
                indent_size: 2,
                space_in_empty_paren: false,
                space_in_paren: false,            
            }
        }

    }
    _rewrite ( f ) {
        let code = f.toString();
        const theVar = this._getEventObjectVarName(code)
        //console.log(theVar)
        code = this._removeComments(code);// コメントを消す
        
    /* 整形の結果「Left Curly Bracket({)の前の改行をなくす
      SemiColonで終わらない行にSemiColonは付与しないことに注意。
      while(true)
      {x+=1;break}
      ↓
      while (true) {
        x += 1;
        break
      }
    */
        code = js_beautify(code, Rewrite.constant.JsBeautifyOptions);
        const _loopProtectionIsDone = code.match(Rewrite.constant.LoopProtectionIsDone);
        if( _loopProtectionIsDone === null) {
            code = code.replace(Rewrite.constant.RegexLoopDef, '$1$2' + Rewrite.constant.LoopProtectionCode);
        }
        code = js_beautify(code, Rewrite.constant.JsBeautifyOptions);
        code = this._removeComments(this._removeOuter(code))
        const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor
        let af = (theVar.length>0)? new AsyncFunction(theVar,code):new AsyncFunction(code);
        return af;
    
    }
}

export default Rewrite.getInstance();