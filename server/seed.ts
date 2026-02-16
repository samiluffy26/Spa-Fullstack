import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

async function seed() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('spa-reservas');
        const collection = db.collection('services');

        const dataPath = path.join(__dirname, 'services-seed.json');
        const services = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

        // Limpiar colección existente
        await collection.deleteMany({});

        // Insertar datos de servicios
        await collection.insertMany(services);

        // Seed Settings
        const settingsCollection = db.collection('settings');
        const defaultSettings = {
            key: 'business_availability',
            value: {
                weeklySchedule: [
                    { day: 0, isOpen: false, openTime: '09:00', closeTime: '18:00' }, // Sun
                    { day: 1, isOpen: true, openTime: '09:00', closeTime: '18:00' },  // Mon
                    { day: 2, isOpen: true, openTime: '09:00', closeTime: '18:00' },  // Tue
                    { day: 3, isOpen: true, openTime: '09:00', closeTime: '18:00' },  // Wed
                    { day: 4, isOpen: true, openTime: '09:00', closeTime: '18:00' },  // Thu
                    { day: 5, isOpen: true, openTime: '09:00', closeTime: '18:00' },  // Fri
                    { day: 6, isOpen: true, openTime: '10:00', closeTime: '16:00' },  // Sat
                ],
                exceptions: [],
                maxDailyBookings: 20,
                maxGuestsPerBooking: 5
            },
            description: 'Global business availability configuration',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await settingsCollection.deleteMany({ key: 'business_availability' });
        await settingsCollection.insertOne(defaultSettings);

        console.log('✅ Base de datos poblada con éxito (Servicios y Configuración)');
    } catch (error) {
        console.error('❌ Error al poblar la base de datos:', error);
    } finally {
        await client.close();
    }
}

seed();
