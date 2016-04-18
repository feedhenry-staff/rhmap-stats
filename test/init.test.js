'use strict';

var sinon = require('sinon')
  , expect = require('chai').expect
  , proxyquire = require('proxyquire');

var testParams = {
  host: 'fake.host.com',
  port: 9001
};

describe(__filename, function () {

  var mod, sessionStub, envStub;

  beforeEach(function () {
    sessionStub = sinon.stub();

    envStub = sinon.stub();

    mod = proxyquire('lib/init', {
      'env-var': envStub,
      'stats-influxdb': {
        newSession: sessionStub
      }
    });
  });

  it('should initialise successfully with appType "service"', function () {
    envStub.returns('test');
    envStub.onCall(4).returns('true');
    sessionStub.returns(null);

    var res = mod(testParams);
    var stubArgs = sessionStub.getCall(0).args[0];

    expect(res).to.equal(null);

    expect(stubArgs.host).to.equal(testParams.host);
    expect(stubArgs.port).to.equal(testParams.port);
    expect(stubArgs.tags).to.be.an('object');
    expect(stubArgs.tags).to.deep.equal({
      domain: 'test',
      app_id: 'test',
      app_name: 'test',
      app_env: 'test',
      app_type: 'service',
      millicore: 'test'
    });
  });

  it('should initialise successfully with appType "cloud"', function () {
    envStub.returns('test');
    envStub.onCall(4).returns('false');
    sessionStub.returns(null);

    var res = mod(testParams);
    var stubArgs = sessionStub.getCall(0).args[0];

    expect(res).to.equal(null);

    expect(stubArgs.host).to.equal(testParams.host);
    expect(stubArgs.port).to.equal(testParams.port);
    expect(stubArgs.tags).to.be.an('object');
    expect(stubArgs.tags).to.deep.equal({
      domain: 'test',
      app_id: 'test',
      app_name: 'test',
      app_env: 'test',
      app_type: 'cloud',
      millicore: 'test'
    });
  });
});
