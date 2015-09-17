var assert = require("assert");
var winston = require('winston');
var kafka = require('kafka-node');
var transport = require('../index.js');

describe('Winston kafka transport', function() {
  it('should be able to initialize without any arguments', function() {
    var kafkaTransport = new transport.Kafka();
    assert.equal('object', typeof kafkaTransport);
  });

  it('name should be kafka', function() {
    var kafkaTransport = new transport.Kafka();
    assert.equal('kafka', kafkaTransport.name);
  });
});
