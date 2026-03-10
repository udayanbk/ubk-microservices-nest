import { Kafka } from "kafkajs";
import { KafkaTopics } from "../../events/topics";

const kafka = new Kafka({
  clientId: "topic-manager",
  brokers: [process.env.KAFKA_BROKER!],
});

export async function createKafkaTopics() {

  const admin = kafka.admin();

  await admin.connect();

  await admin.createTopics({
    topics: [
      {
        topic: KafkaTopics.ORDER_CREATED,
        numPartitions: 3,
        replicationFactor: 1,
      },
      {
        topic: KafkaTopics.INVENTORY_RESERVED,
        numPartitions: 3,
        replicationFactor: 1,
      },
      {
        topic: KafkaTopics.INVENTORY_FAILED,
        numPartitions: 3,
        replicationFactor: 1,
      },
      {
        topic: KafkaTopics.PAYMENT_PROCESSED,
        numPartitions: 3,
        replicationFactor: 1,
      },
      {
        topic: KafkaTopics.PAYMENT_FAILED,
        numPartitions: 3,
        replicationFactor: 1,
      },
      {
        topic: KafkaTopics.PAYMENT_FAILED_RETRY,
        numPartitions: 1,
        replicationFactor: 1,
      },
      {
        topic: KafkaTopics.PAYMENT_FAILED_DLQ,
        numPartitions: 1,
        replicationFactor: 1,
      },
      {
        topic: KafkaTopics.INVENTORY_RELEASE,
        numPartitions: 1,
        replicationFactor: 1,
      }
    ],
    waitForLeaders: true,
  });

  console.log("Kafka topics initialized");

  await admin.disconnect();
}