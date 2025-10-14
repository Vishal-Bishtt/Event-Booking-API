import { PrismaClient } from "../../node_modules/prisma/prisma-client/index.js";

// Singleton pattern - ensure only ONE instance exists
const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
        ? ['warn', 'error'] 
        : ['error']
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;