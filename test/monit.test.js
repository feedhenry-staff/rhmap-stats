'use strict';

var sinon = require('sinon')
  , expect = require('chai').expect;

describe(__filename, function () {

  var mod = require('lib/monit')
    , type = 'cpu'
    , interval = 25
    , session = null;

  beforeEach(function () {
    session = {};
    session[type] = sinon.stub();
  });

  afterEach(function () {
    //  Clear interval that's hanging about...
    if (session && session.monit && session.monit[type]) {
      clearInterval(session.monit[type]);
    }
  });

  describe('#start', function () {
    it('should start a session', function (done) {
      mod.start(session, type, interval);

      expect(session.monit).to.be.an('object');
      expect(session.monit[type]).to.be.an('object');
      expect(session[type].calledOnce).to.be.true;

      setTimeout(function () {
        expect(session[type].calledTwice).to.be.true;
        done();
      }, interval * 1.5);
    });

    it('subsequent call should start a session', function () {
      mod.start(session, type, interval);
      var firstTimer = session.monit[type];

      mod.start(session, type, interval);
      var secondTimer = session.monit[type];

      expect(secondTimer).to.not.equal(firstTimer);
    });
  });

  describe('#stop', function () {
    it('should stop a session', function (done) {
      var typeStub = sinon.stub();

      // Setup a dummy session
      session.monit = {};
      session.monit[type] = setInterval(sinon.stub(), interval);

      mod.stop(session, type);

      expect(session.monit[type]).to.be.null;

      setTimeout(function () {
        expect(typeStub.called).to.be.false;
        done();
      }, interval * 1.5);
    });
  });
});
