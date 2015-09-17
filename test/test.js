var assert = require("assert");
var winston = require('winston');
var kafka = require('kafka-node');
var transport = require('../index.js');

var client,
  producer,
  zkHost = 'localhost:2181',
  topic = 'kafka-transport-test',
  clientId = 'winston-kafka-transport-test';

describe('Winston kafka transport', function() {
  it('should be able to initialize without any arguments', function() {
    var kafkaTransport = new transport.Kafka();
    assert.equal(typeof kafkaTransport, 'object');
  });

  it('name should be kafka', function() {
    var kafkaTransport = new transport.Kafka();
    assert.equal(kafkaTransport.name, 'kafka');
  });

  it('should return an error if a message is sent before producer is ready', function() {
    var options = {
      topic: topic
    };
    var kafkaTransport = new transport.Kafka(options);
    var message = {
      msg: 'Testing',
      level: 'error'
    };
    kafkaTransport._send(message, function(error){
      assert.equal(error instanceof Error, true);
    });
  });
});
