//
// Author: Avocarrot Ltd
// Site: https://github.com/Avocarrot/winston-kafka
// Maintainer: Panayiotis Papageorgiou <panos@avocarrot.com>
// License: MIT
//

var util = require('util'),
  winston = require('winston'),
  kafka = require('kafka-node'),
  Transport = winston.Transport;

//
// function Kafka (options)
// @options {Object} Options for this instance.
// Constructor function for the Kafka transport object responsible
// for persisting log messages and metadata to Apache Kafka.
//
var Kafka = exports.Kafka = function(options) {
  Transport.call(this, options);
  options = options || {};

  this.connectionString = options.connectionString || 'localhost:2181';
  this.clientId = options.clientId || 'winston-kafka-transport';
  this.zkOptions = options.zkOptions;
  this.producerOptions = options.producerOptions;

  // Producer Props
  this.topic = options.topic;
  this.compress = !!options.compress ? 1 : 0; // if 1 then compression done using Gzip
  this.producerReady = false;

  // Construct Kafka client
  this.client = new kafka.Client(this.connectionString, this.clientId, this.zkOptions);

  // Construct Producer
  this.producer = new kafka.HighLevelProducer(this.client, this.producerOptions);

  var that = this;
  this.producer.on('ready', function() {
    that.producerReady = true;
  });

  this.producer.on('error', function(error) {
    that.producerReady = false;
  });
};

util.inherits(Kafka, winston.Transport);

//
// Expose the name of this Transport on the prototype
//
Kafka.prototype.name = 'kafka';

//
// function _send (message, callback)
// @callback {function} Continuation to respond to when complete.
// Uses the kafka producer to send the log message to the kafka cluster
//
Kafka.prototype._send = function(message, callback) {

  var cb = (typeof callback === 'function') ? callback : function() {};

  if (!message) cb(new Error('No message to log'));

  var payload = [{
    topic: this.topic,
    messages: JSON.stringify(message),
    attributes: this.compress
  }];

  if (this.producerReady) {
    this.producer.send(payload, cb);
  } else {
    cb(new Error('Kafka producer not ready'));
  }
};

//
// function log (level, msg, [meta], callback)
// @level {string} Level at which to log the message.
// @msg {string} Message to log
// @meta {Object} **Optional** Additional metadata to attach
// @callback {function} Continuation to respond to when complete.
// Core logging method exposed to Winston. Metadata is optional.
//
Kafka.prototype.log = function(level, msg, meta, callback) {
  var that = this;
  if (typeof meta === 'function' && meta()) {
    callback = meta;
    meta = {};
  } else {
    callback = (typeof callback === 'function') ? callback : function() {};
  }

  var message = {
    msg: msg,
    level: level,
    meta: meta
  };

  this._send(message, function(error) {
    if (error) return callback(error);
    that.emit('logged');
    callback(null, true);
  });
};
