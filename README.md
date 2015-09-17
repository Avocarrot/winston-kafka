# winston-kafka
A [Winston](https://github.com/winstonjs/winston) transport to log messages into an [Apache Kafka](http://kafka.apache.org/) topic.

## Dependencies
- [winston](https://github.com/winstonjs/winston)
- [kafka-node](https://github.com/SOHU-Co/kafka-node)

## Installation
```npm install winston-kafka```

## Usage
```js
var winston = require('winston');
winston.transports.KafkaTransport = require('winston-kafka');

var options = {
  topic: 'logs'
};

winston.add(winston.transports.KafkaTransport, options);
```

###Options
- `topic` - (required) Kafka topic.
- `clientId` - Kafka client ID | Default: winston-kafka-transport
- `connectionString` - Zookeeper connection string | Default: localhost:2181
- `compress` - Compress messages before sending to Kafka (Gzip)| Default: false
- `producerOptions` - Kafka HighLevelProducer options
- `zkOptions` - Zookeeper Options

## Contributing
This project is work in progress and we'd love more people contributing to it.

1. Fork the repo
2. Apply your changes
3. Write tests
4. Submit your pull request

For feedback or suggestions you can drop us a line at support@avocarrot.com
