jest.mock("kafkajs"); 
import { saveSubscription } from "../src/service/dynamodb/newsletterRepository";
import { kafkaProducer } from "../src/service/kafka/kafkaProducer";
import { runConsumer } from "../src/service/kafka/newsletterSubscriptionConsumer";

jest.mock("../src/service/dynamodb/newsletterRepository");
jest.mock("../src/service/kafka/kafkaProducer");

describe("Newsletter Kafka Consumer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should process message and save subscription", async () => {
    const { __mocks__ } = require("kafkajs");
    const mockRun = __mocks__.mockConsumerRun;

    const user = { userId: 123, email: "pta@films.com", fullName: "Paul Thomas Anderson" };

    mockRun.mockImplementation(async ({ eachMessage }: any) => {
      await eachMessage({
        topic: "newsletter-events",
        partition: 0,
        message: { value: Buffer.from(JSON.stringify(user)) },
      });
    });

    (saveSubscription as jest.Mock).mockResolvedValueOnce({ ...user });
    (kafkaProducer.send as jest.Mock).mockResolvedValueOnce({});

    await runConsumer();

    expect(saveSubscription).toHaveBeenCalledWith(user);
    expect(kafkaProducer.send).toHaveBeenCalledWith({
      topic: "user-saved",
      messages: [{ value: JSON.stringify({ userId: 123, status: "SAVED" }) }],
    });
  });
});
