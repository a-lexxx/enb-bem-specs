(function(name, ctx, define) {
    var module = define.call(ctx, ctx);
    typeof modules === 'object' ?
        modules.define(name, function(provide) { provide(module); }) :
        (ctx[name] = module);
}('mocha', this, function(global) {

    if (global.mocha) return global.mocha;

    // NOTE: prevent global variable `global` to appear from mocha.js
    // eslint-disable-next-line
    /* borschik:include:../../../../node_modules/enb-bem-specs/node_modules/mocha/mocha.js */;

    return global.mocha;
}));
