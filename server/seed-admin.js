const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = 'mongodb://localhost:27017/spa-reservas';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    role: { type: String, default: 'client' }, // Ensure this matches DB
}, { timestamps: true, strict: false }); // strict: false allows flexibility

const User = mongoose.model('User', userSchema);

async function seedAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@relaxspa.com';
        const adminPassword = 'adminPassword123';

        const existingUser = await User.findOne({ email: adminEmail });

        if (existingUser) {
            console.log(`User found. Current role in DB: ${existingUser.role}`);

            console.log('Updating role to admin...');

            // Force update using updateOne to bypass schema defaults if any
            await User.updateOne({ email: adminEmail }, { $set: { role: 'admin' } });

            // Re-hash password just in case
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            existingUser.password = hashedPassword;
            await existingUser.save();

            console.log('User password updated.');
        } else {
            console.log('Creating new admin user...');
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await User.create({
                name: 'Administrador RelaxSpa',
                email: adminEmail,
                phone: '8090000000',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin user created successfully.');
        }

        // Verification step
        const verifiedUser = await User.findOne({ email: adminEmail });
        console.log('--- VERIFICATION ---');
        console.log(`Email: ${verifiedUser.email}`);
        console.log(`Role in DB: ${verifiedUser.role}`);
        console.log('--------------------');

    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

seedAdmin();
