// debug-flow.js - Complete Request Flow Debugger
import prisma from "./src/config/prisma.js";

async function debugCompleteFlow() {
    console.log('\n🔍 ========== DEBUG: COMPLETE FLOW TEST ==========\n');
    
    const testEventData = {
        title: "DEBUG TEST - Live Concert",
        description: "Testing complete flow from API to database",
        date: new Date("2024-12-31T20:00:00.000Z"),
        time: "8:00 PM",
        venue: "Debug Arena",
        totalSeats: 10000,
        availableSeats: 10000,
        price: 1500.00
    };

    try {
        // Step 1: Test database connection
        console.log('📡 Step 1: Testing database connection...');
        await prisma.$connect();
        console.log('✅ Database connected successfully\n');

        // Step 2: Count existing events
        console.log('📊 Step 2: Counting existing events...');
        const beforeCount = await prisma.event.count();
        console.log(`✅ Events in database BEFORE: ${beforeCount}\n`);

        // Step 3: Create event (simulating service layer)
        console.log('💾 Step 3: Creating event via Prisma...');
        console.log('Data:', JSON.stringify(testEventData, null, 2));
        
        const createdEvent = await prisma.event.create({
            data: testEventData
        });
        
        console.log('✅ Event created:', {
            id: createdEvent.id,
            title: createdEvent.title,
            totalSeats: createdEvent.totalSeats
        });
        console.log('');

        // Step 4: Verify immediate persistence
        console.log('🔍 Step 4: Verifying immediate persistence...');
        const foundEvent = await prisma.event.findUnique({
            where: { id: createdEvent.id }
        });
        
        if (foundEvent) {
            console.log('✅ Event found immediately after creation');
            console.log('Event details:', {
                id: foundEvent.id,
                title: foundEvent.title,
                totalSeats: foundEvent.totalSeats
            });
        } else {
            console.log('❌ Event NOT found - CRITICAL ISSUE!');
        }
        console.log('');

        // Step 5: Count events after creation
        console.log('📊 Step 5: Counting events after creation...');
        const afterCount = await prisma.event.count();
        console.log(`✅ Events in database AFTER: ${afterCount}`);
        console.log(`📈 Net change: +${afterCount - beforeCount}\n`);

        // Step 6: Fetch all events
        console.log('📋 Step 6: Fetching all events...');
        const allEvents = await prisma.event.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5
        });
        console.log(`✅ Total events fetched: ${allEvents.length}`);
        allEvents.forEach((event, idx) => {
            console.log(`  ${idx + 1}. ${event.title} - ${event.totalSeats} seats`);
        });
        console.log('');

        // Step 7: Test update operation
        console.log('🔄 Step 7: Testing update operation...');
        const updatedEvent = await prisma.event.update({
            where: { id: createdEvent.id },
            data: { availableSeats: 9999 }
        });
        console.log('✅ Event updated successfully');
        console.log(`   Available seats changed: 10000 → ${updatedEvent.availableSeats}\n`);

        // Step 8: Cleanup - Delete test event
        console.log('🗑️  Step 8: Cleaning up test data...');
        await prisma.event.delete({
            where: { id: createdEvent.id }
        });
        console.log('✅ Test event deleted\n');

        console.log('🎉 ========== ALL TESTS PASSED ==========\n');
        console.log('✅ Database connection: Working');
        console.log('✅ Event creation: Working');
        console.log('✅ Event persistence: Working');
        console.log('✅ Event retrieval: Working');
        console.log('✅ Event update: Working');
        console.log('✅ Event deletion: Working');
        console.log('\n💡 Conclusion: Database operations are FULLY FUNCTIONAL');
        console.log('💡 If API still fails, issue is in middleware/controller chain\n');

        return { success: true };

    } catch (error) {
        console.error('\n💥 ========== TEST FAILED ==========\n');
        console.error('❌ Error:', error.message);
        console.error('❌ Code:', error.code);
        console.error('❌ Stack:', error.stack);
        return { success: false, error };

    } finally {
        await prisma.$disconnect();
        console.log('👋 Database disconnected\n');
    }
}

// Run the debug flow
debugCompleteFlow()
    .then(result => {
        process.exit(result.success ? 0 : 1);
    })
    .catch(err => {
        console.error('💥 Unexpected error:', err);
        process.exit(1);
    });
