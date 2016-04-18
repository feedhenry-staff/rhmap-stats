'use strict';

var sinon = require('sinon')
  , expect = require('chai').expect
  , proxyquire = require('proxyquire');

describe(__filename, function () {

  var mod = proxyquire('lib/index.js', {
    './init': sinon.stub(),
    './monit': sinon.stub()
  });

  describe('#init', function () {
    it('should be a function', function () {
      expect(mod.init).to.be.defined;
      expect(mod.init).to.be.a('function');
    });
  });

  describe('#monit', function () {
    it('should be a function', function () {
      expect(mod.init).to.be.defined;
      expect(mod.init).to.be.a('function');
    });
  });

});
