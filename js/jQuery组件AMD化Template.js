(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        factory(jQuery);
    }
}(function ($) {
    // code
}));