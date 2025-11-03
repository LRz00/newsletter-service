const mockProducerConnect = jest.fn();
const mockProducerSend = jest.fn();

const mockConsumerConnect = jest.fn();
const mockConsumerSubscribe = jest.fn();
const mockConsumerRun = jest.fn();

const mockProducer = {
  connect: mockProducerConnect,
  send: mockProducerSend,
};

const mockConsumer = {
  connect: mockConsumerConnect,
  subscribe: mockConsumerSubscribe,
  run: mockConsumerRun,
};

const Kafka = jest.fn().mockImplementation(() => ({
  consumer: jest.fn().mockImplementation(() => mockConsumer),
  producer: jest.fn().mockImplementation(() => mockProducer),
}));

// Expose the internal mock handles so tests can access them via require('kafkajs').__mocks__
module.exports = {
  Kafka,
  __mocks__: {
    mockProducerConnect,
    mockProducerSend,
    mockConsumerConnect,
    mockConsumerSubscribe,
    mockConsumerRun,
  },
};
