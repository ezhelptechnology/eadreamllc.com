async function testSubmit() {
    const payload = {
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerPhone: "555-0000",
        eventDate: "March 2026",
        headcount: 50,
        proteins: ["Beef", "Chicken", "Pork"],
        preparation: "Grilled",
        sides: "Rice, Beans",
        bread: "Toast",
        allergies: "None"
    };

    try {
        const response = await fetch('http://localhost:3000/api/catering/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('Response Data:', data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testSubmit();
