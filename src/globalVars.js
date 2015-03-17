/*jshint globalstrict: true*/
'use strict';
(function(window, idbModules){
    if (typeof window.openDatabase !== "undefined") {
        window.shimIndexedDB = idbModules.shimIndexedDB;
        if (window.shimIndexedDB) {
            window.shimIndexedDB.__useShim = function(){
                //MCN: prepended underscore to all global variables to that this shim
                //can be used in Safari 8 w/o error (note: Sarafi 8's IDB implementation
                //is slow and buggy and it defined the indexedDB related global vars as
                //read-only, hence why I forked the IndexedDBShim GitHub repo.)  
                window._indexedDB = idbModules.shimIndexedDB;
                window._IDBDatabase = idbModules.IDBDatabase;
                window._IDBTransaction = idbModules.IDBTransaction;
                window._IDBCursor = idbModules.IDBCursor;
                window._IDBKeyRange = idbModules.IDBKeyRange;

                //MCN: we don't need this
                // On some browsers the assignment fails, overwrite with the defineProperty method
                // if (window.indexedDB !== idbModules.shimIndexedDB && Object.defineProperty) {
                //     Object.defineProperty(window, 'indexedDB', {
                //         value: idbModules.shimIndexedDB
                //     });
                // }
            };
            window.shimIndexedDB.__debug = function(val){
                idbModules.DEBUG = val;
            };
        }
    }
    

    /*
    prevent error in Firefox
    */
    //MCN: we don't support firefox so we don't need this
    // if(!('indexedDB' in window)) {
    //     window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.oIndexedDB || window.msIndexedDB;
    // }
    
    /*
    detect browsers with known IndexedDb issues (e.g. Android pre-4.4)
    */
    var poorIndexedDbSupport = false;
    //MCN: added "Safari" as a poor indexed db supporter.
    if ( navigator.userAgent.match(/Safari/) || navigator.userAgent.match(/Android 2/) || navigator.userAgent.match(/Android 3/) || navigator.userAgent.match(/Android 4\.[0-3]/)) {
        /* Chrome is an exception. It supports IndexedDb */
        if (!navigator.userAgent.match(/Chrome/)) {
            poorIndexedDbSupport = true;
        }
    }

    if ((typeof window.indexedDB === "undefined" || poorIndexedDbSupport) && typeof window.openDatabase !== "undefined") {
        window.shimIndexedDB.__useShim();
    }
    else {
        window.IDBDatabase = window.IDBDatabase || window.webkitIDBDatabase;
        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
        window.IDBCursor = window.IDBCursor || window.webkitIDBCursor;
        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
        if(!window.IDBTransaction){
            window.IDBTransaction = {};
        }
        /* Some browsers (e.g. Chrome 18 on Android) support IndexedDb but do not allow writing of these properties */
        try {
            window.IDBTransaction.READ_ONLY = window.IDBTransaction.READ_ONLY || "readonly";
            window.IDBTransaction.READ_WRITE = window.IDBTransaction.READ_WRITE || "readwrite";
        } catch (e) {}
    }
    
}(window, idbModules));

