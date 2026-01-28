import twilio from 'twilio';

const getTwilioClient = () => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !phoneNumber) {
        console.log('Twilio not configured - SMS will be logged only');
        return null;
    }

    return {
        client: twilio(accountSid, authToken),
        fromNumber: phoneNumber
    };
};

// Format phone number to E.164 format
function formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');

    // If 10 digits, assume US number
    if (digits.length === 10) {
        return `+1${digits}`;
    }

    // If 11 digits starting with 1, add +
    if (digits.length === 11 && digits.startsWith('1')) {
        return `+${digits}`;
    }

    // If already has country code
    if (digits.length > 10) {
        return `+${digits}`;
    }

    return phone; // Return as-is if can't format
}

interface ThankYouSmsOptions {
    customerName: string;
    customerPhone: string;
    eventDate: string;
    headcount: number;
    proteins: string[];
    proposalId?: string;
}

export async function sendThankYouSms(options: ThankYouSmsOptions): Promise<boolean> {
    const { customerName, customerPhone, eventDate, headcount, proteins, proposalId } = options;

    if (!customerPhone || customerPhone.toLowerCase() === 'skip') {
        console.log('No phone number provided, skipping SMS');
        return false;
    }

    const formattedPhone = formatPhoneNumber(customerPhone);
    const firstName = customerName.split(' ')[0];

    const message = `🎉 Thank you for choosing EA Dream LLC, ${firstName}!

Your custom catering proposal has been sent to your email.

📋 Event Summary:
• Date: ${eventDate || 'TBD'}
• Guests: ${headcount}
• Menu: ${proteins.join(', ')}

📧 Check your email for your full personalized proposal${proposalId ? ` (${proposalId})` : ''}.

Questions? Reply to this text or call us at (602) 318-4925.

– Etheleen & Alma's Dream Team 🍽️`;

    const twilioSetup = getTwilioClient();

    if (twilioSetup) {
        try {
            const result = await twilioSetup.client.messages.create({
                body: message,
                from: twilioSetup.fromNumber,
                to: formattedPhone
            });
            console.log('SMS sent successfully:', result.sid);
            return true;
        } catch (error) {
            console.error('Failed to send SMS:', error);
            // Log the message that would have been sent
            console.log('SMS content (not sent):', message);
            return false;
        }
    } else {
        // Log the SMS for development
        console.log('=== SMS WOULD BE SENT ===');
        console.log(`To: ${formattedPhone}`);
        console.log(`Message:\n${message}`);
        console.log('========================');
        return false;
    }
}

interface ConfirmationSmsOptions {
    customerName: string;
    customerPhone: string;
    message: string;
}

export async function sendCustomSms(options: ConfirmationSmsOptions): Promise<boolean> {
    const { customerPhone, message } = options;

    if (!customerPhone || customerPhone.toLowerCase() === 'skip') {
        return false;
    }

    const formattedPhone = formatPhoneNumber(customerPhone);
    const twilioSetup = getTwilioClient();

    if (twilioSetup) {
        try {
            const result = await twilioSetup.client.messages.create({
                body: message,
                from: twilioSetup.fromNumber,
                to: formattedPhone
            });
            console.log('Custom SMS sent:', result.sid);
            return true;
        } catch (error) {
            console.error('Failed to send custom SMS:', error);
            return false;
        }
    } else {
        console.log('=== CUSTOM SMS (DEV MODE) ===');
        console.log(`To: ${formattedPhone}`);
        console.log(`Message:\n${message}`);
        console.log('=============================');
        return false;
    }
}
