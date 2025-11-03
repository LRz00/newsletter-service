import { Kafka } from "kafkajs";
import logger from "../../logger";
import { sendConfirmationEmail } from "../email/emailService";


const kafka = new Kafka({
    clientId: "newsletter-email-consumer",
    brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "newsletter-email-group" });

async function runConsumer() {
    await consumer.connect();
    await consumer.subscribe({
        topic: "user-saved",
        fromBeginning: true
    });

    logger.info("Listening to user-saved events to send confirmation emails");

    await consumer.run({
        eachMessage: async({message}) => {
            if(message.value){
                const event = JSON.parse(message.value.toString());
                try{
                    await sendConfirmationEmail(event.email, event.fullName);
                    logger.info(`Confirmation email sent to ${event.email}`);
                } catch(error: any){
                    logger.error("Error sending confirmation email:", error.message);
                }
            }
        }
    })
}

runConsumer().catch((error) => {
  logger.error("Error running Kafka consumer:", error.message);
});