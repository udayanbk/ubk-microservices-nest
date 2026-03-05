import { Kafka } from "kafkajs";

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
        topic: "order.created",
        numPartitions: 3,
        replicationFactor: 1,
      },
      {
        topic: "inventory.reserved",
        numPartitions: 3,
        replicationFactor: 1,
      },
      {
        topic: "inventory.failed",
        numPartitions: 3,
        replicationFactor: 1,
      },
      {
        topic: "payment.processed",
        numPartitions: 3,
        replicationFactor: 1,
      },
      {
        topic: "payment.failed",
        numPartitions: 3,
        replicationFactor: 1,
      },
      {
        topic: "payment.failed.dlq",
        numPartitions: 1,
        replicationFactor: 1,
      }
    ],
    waitForLeaders: true,
  });

  console.log("Kafka topics initialized");

  await admin.disconnect();
}