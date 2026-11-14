import prisma from "../src/config/prismaClient.js";
import { Prisma } from "../src/generated/prisma/client.js";

async function main() {
    console.log("Seeding started");

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.availableTrigger.createMany({
            data: [{ name: "webhook" }],
            skipDuplicates: true
        });

        await tx.availableAction.createMany({
            data: [
                { name: "sendEmail" },
                { name: "sendDiscordMessage" },
                { name: "sendSlackMessage" },
                { name: "wait" },
            ],
            skipDuplicates: true
        });
    });

    console.log("Seeding completed");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    //@ts-ignore
    process.exit(1);
  });