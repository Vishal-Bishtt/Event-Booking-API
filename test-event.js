// test-event.js - Database Test Script
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const testEventCreation = async () => {
    const testData = {
        title: "TEST EVENT - Coldplay",
        description: "Test description for debugging",
        date: new Date("2024-06-15T19:00:00.000Z"),
        time: "7:00 PM",
        venue: "Test Stadium",
        totalSeats: 50000,  // ✅ FIXED: camelCase to match schema
        availableSeats: 50000,
        price: 2500.00
    };

    try {
        console.log('🧪 Testing event creation with:', JSON.stringify(testData, null, 2));
        
        // Test 1: Check if Prisma connection works
        await prisma.$connect();
        console.log('✅ Database connected');
        
        // Test 2: Create event
        const event = await prisma.event.create({
            data: testData
        });
        console.log('✅ Event created:', event);
        
        // Test 3: Verify it exists
        const foundEvent = await prisma.event.findUnique({
            where: { id: event.id }
        });
        console.log('✅ Event found in DB:', !!foundEvent);
        console.log('✅ Event details:', foundEvent);
        
        // Test 4: Count all events
        const count = await prisma.event.count();
        console.log(`✅ Total events in database: ${count}`);
        
        return { success: true, event };
        
    } catch (error) {
        console.error('🔴 Test failed:', error);
        console.error('🔴 Error message:', error.message);
        console.error('🔴 Error code:', error.code);
        return { 
            success: false, 
            error: error.message,
            code: error.code 
        };
    } finally {
        await prisma.$disconnect();
    }
};

// Run the test
testEventCreation()
    .then(result => {
        console.log('\n📊 FINAL RESULT:', result);
        process.exit(result.success ? 0 : 1);
    })
    .catch(err => {
        console.error('\n💥 Unexpected error:', err);
        process.exit(1);
    });