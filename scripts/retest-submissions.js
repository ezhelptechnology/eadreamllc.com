/**
 * TEST SCRIPT: Catering Submission
 * Tests the custom menu flow 3 times to ensure 100% reliability.
 */

const testSubmissions = [
    {
        customerName: "Wedding Test 1",
        customerEmail: "wedding1@test.com",
        customerPhone: "555-0001",
        eventType: "Wedding",
        eventDate: "2026-06-01",
        eventLocation: "Grand Hall",
        headcount: 100,
        proteins: ["Steak", "Salmon"],
        preparation: "Elegant Plating",
        sides: "Asparagus, Risotto",
        bread: "Sourdough",
        allergies: "Nut-free"
    },
    {
        customerName: "Corporate Test 2",
        customerEmail: "corp2@test.com",
        customerPhone: "555-0002",
        eventType: "Corporate Luncheon",
        eventDate: "2026-04-15",
        eventLocation: "Office Tower",
        headcount: 50,
        proteins: ["Chicken", "Tofu"],
        preparation: "Buffet Style",
        sides: "Garden Salad, Quinoa",
        bread: "Artisan Rolls",
        allergies: "Vegetarian options required"
    },
    {
        customerName: "Private Dinner Test 3",
        customerEmail: "private3@test.com",
        customerPhone: "555-0003",
        eventType: "Birthday Party",
        eventDate: "2026-02-14",
        eventLocation: "Private Residence",
        headcount: 20,
        proteins: ["Lobster", "Filet Mignon"],
        preparation: "Chef Table",
        sides: "Truffle Fries, Glazed Carrots",
        bread: "Garlic Bread",
        allergies: "None"
    }
];

async function runTests() {
    console.log('🧪 STARTING CATERING SUBMISSION TESTS (3 TIMES)...');
    console.log('--------------------------------------------------');

    let successCount = 0;

    for (let i = 0; i < testSubmissions.length; i++) {
        const testCase = testSubmissions[i];
        console.log(`\nTest #${i + 1}: Submitting for ${testCase.customerName}...`);

        try {
            const response = await fetch('http://localhost:3000/api/catering/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testCase),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                console.log(`✅ Test #${i + 1} PASSED!`);
                console.log(`   Proposal Ref: ${data.proposalRef}`);
                successCount++;
            } else {
                console.error(`❌ Test #${i + 1} FAILED! Status: ${response.status}`);
                console.error(`   Error: ${data.error || 'Unknown error'}`);
                if (data.details) console.error(`   Details: ${data.details}`);
            }
        } catch (error) {
            console.error(`❌ Test #${i + 1} CRASHED!`);
            console.error(`   Error: ${error.message}`);
        }
    }

    console.log('\n--------------------------------------------------');
    console.log(`🏁 FINAL RESULT: ${successCount}/3 TESTS PASSED`);
    
    if (successCount === 3) {
        console.log('🌟 100% RELIABILITY VERIFIED!');
        process.exit(0);
    } else {
        console.log('⚠️ SYSTEM NOT 100% RELIABLE. NEEDS ATTENTION.');
        process.exit(1);
    }
}

runTests();
