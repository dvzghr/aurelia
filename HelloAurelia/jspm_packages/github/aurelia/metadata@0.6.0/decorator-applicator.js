/* */ 
System.register(['./metadata'], function (_export) {
  'use strict';

  var Metadata, DecoratorApplicator;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_metadata) {
      Metadata = _metadata.Metadata;
    }],
    execute: function () {
      DecoratorApplicator = (function () {
        function DecoratorApplicator() {
          _classCallCheck(this, DecoratorApplicator);

          this._first = null;
          this._second = null;
          this._third = null;
          this._rest = null;
        }

        DecoratorApplicator.prototype.decorator = function decorator(_decorator) {
          if (this._first === null) {
            this._first = _decorator;
            return this;
          }

          if (this._second === null) {
            this._second = _decorator;
            return this;
          }

          if (this._third === null) {
            this._third = _decorator;
            return this;
          }

          if (this._rest === null) {
            this._rest = [];
          }

          this._rest.push(_decorator);

          return this;
        };

        DecoratorApplicator.prototype._decorate = function _decorate(target) {
          var i, ii, rest;

          if (this._first !== null) {
            this._first(target);
          }

          if (this._second !== null) {
            this._second(target);
          }

          if (this._third !== null) {
            this._third(target);
          }

          rest = this._rest;
          if (rest !== null) {
            for (i = 0, ii = rest.length; i < ii; ++i) {
              rest[i](target);
            }
          }
        };

        return DecoratorApplicator;
      })();

      _export('DecoratorApplicator', DecoratorApplicator);
    }
  };
});