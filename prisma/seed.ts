import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const db = new PrismaClient();

async function seed() {
    const currentTime = new Date().toISOString();
    await db.users.create({
        data: {
            username: "test",
            password:
                "$2a$10$.RWPPnOnfBEL.EQPmSvcA.J9RXEdOQ6piQ0OwEGGcll3IuX/jXDkq",
            createdAt: currentTime,
            updatedAt: currentTime,
            destinatarios: {
                create: Array.from({ length: 10 }).map(() => ({
                    nombre: faker.name.findName(),
                    createdAt: currentTime,
                    updatedAt: currentTime,
                })),
            },
        },
    });
    await db.pagos.createMany({
        data: [
            ...Array.from({ length: 15 }).map(() => ({
                pago: faker.date.future(),
                monto: faker.finance.amount(),
                emision: faker.date.past(),
                numero: faker.random.numeric(8),
                estado: "a_pagar",
                createdAt: currentTime,
                updatedAt: currentTime,
                destinatarioId: Math.floor(Math.random() * 10 + 1),
                userId: 1,
            })),
            ...Array.from({ length: 15 }).map(() => ({
                pago: faker.date.past(),
                monto: faker.finance.amount(),
                emision: faker.date.past(),
                numero: faker.random.numeric(8),
                estado: "pagado",
                createdAt: currentTime,
                updatedAt: currentTime,
                destinatarioId: Math.floor(Math.random() * 10 + 1),
                userId: 1,
            })),
        ],
    });
}

seed();
