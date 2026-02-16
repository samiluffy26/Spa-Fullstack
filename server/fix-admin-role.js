const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/spa-reservas';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'client' },
    name: { type: String }
}, { strict: false }); // Usar strict false para ser flexible

const User = mongoose.model('User', userSchema);

async function fixAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@relaxspa.com';

        const user = await User.findOne({ email: adminEmail });

        if (user) {
            console.log(`Usuario encontrado: ${user.name}`);
            console.log(`Rol actual: ${user.role}`);

            if (user.role !== 'admin') {
                console.log('El rol no es admin. Actualizando...');

                // Forzar actualización directa
                const result = await User.updateOne(
                    { email: adminEmail },
                    { $set: { role: 'admin' } }
                );

                console.log('Resultado de actualización:', result);

                const updatedUser = await User.findOne({ email: adminEmail });
                console.log(`Nuevo rol verificado: ${updatedUser.role}`);
            } else {
                console.log('El usuario YA es admin en la base de datos.');
            }
        } else {
            console.log('Error: No se encontró el usuario admin@relaxspa.com');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

fixAdmin();
