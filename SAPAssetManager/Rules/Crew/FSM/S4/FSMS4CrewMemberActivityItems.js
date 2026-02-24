import FSMS4CrewMemberEmail from './FSMS4CrewMemberEmail';
import FSMS4CrewMemberMessage from './FSMS4CrewMemberMessage';
import FSMS4CrewMemberPhone from './FSMS4CrewMemberPhone';

export default function FSMS4CrewMemberActivityItems(context) {
    const items = [];

    const email = FSMS4CrewMemberEmail(context);
    const phone = FSMS4CrewMemberPhone(context);
    const message = FSMS4CrewMemberMessage(context);
        
    if (email && email !== '-') {
        items.push({
            'ActivityType': 'Email',
            'ActivityValue': email,
        });
    }

    if (phone && phone !== '-') {
        items.push({
            'ActivityType': 'Phone',
            'ActivityValue': phone,
        });
    }

    if (message && message !== '-') {
        items.push({
            'ActivityType': 'Message',
            'ActivityValue': message,
        });
    }

    return items;
}
