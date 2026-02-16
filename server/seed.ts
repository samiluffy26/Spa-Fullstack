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

        // Insertar datos
        await collection.insertMany(services);

        console.log('✅ Base de datos poblada con éxito');
    } catch (error) {
        console.error('❌ Error al poblar la base de datos:', error);
    } finally {
        await client.close();
    }
}

seed();
