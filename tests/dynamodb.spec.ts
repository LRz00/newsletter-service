// tests/dynamodb/dynamoClient.test.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import dynamoClient from "../src/service/dynamodb/dynamoClient";

jest.mock("@aws-sdk/client-dynamodb", () => ({
  DynamoDBClient: jest.fn().mockImplementation(() => ({
  }))
}));

jest.mock("dotenv", () => ({
  config: jest.fn()
}));

const mockEnv = {
  AWS_REGION: "us-east-1",
  AWS_ACCESS_KEY_ID: "test-access-key",
  AWS_SECRET_ACCESS_KEY: "test-secret-key"
};

describe("DynamoDB Client", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...mockEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should create DynamoDB client with correct configuration", () => {
    jest.isolateModules(() => {
      const newDynamoClient = require("../src/service/dynamodb/dynamoClient").default;

      expect(DynamoDBClient).toHaveBeenCalledWith({
        region: "us-east-1",
        credentials: {
          accessKeyId: "test-access-key",
          secretAccessKey: "test-secret-key",
        },
      });
    });
  });

  it("should create DynamoDB client with empty credentials when env vars are missing", () => {
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;

    jest.isolateModules(() => {
      const newDynamoClient = require("../src/service/dynamodb/dynamoClient").default;

      expect(DynamoDBClient).toHaveBeenCalledWith({
        region: "us-east-1",
        credentials: {
          accessKeyId: "",
          secretAccessKey: "",
        },
      });
    });
  });
});