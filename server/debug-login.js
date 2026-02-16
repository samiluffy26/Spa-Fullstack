const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/spa-reservas';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    role: { type: String, default: 'client' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function debugLogin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@relaxspa.com';
        console.log(`Debugging login for: ${adminEmail}`);

        const user = await User.findOne({ email: adminEmail });

        if (user) {
            console.log('User found in DB.');
            console.log(`Role property: '${user.role}'`);
            console.log('Full User Object:', user.toObject());

            if (user.role === 'admin') {
                console.log('SUCCESS: User has admin role in DB.');
            } else {
                console.log('FAILURE: User does NOT have admin role.');
            }
        } else {
            console.log('User not found!');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

debugLogin();
