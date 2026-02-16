import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/users/users.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    const adminEmail = 'admin@relaxspa.com';
    const adminPassword = 'adminPassword123'; // Debes cambiarla en producción

    console.log(`Buscando cuenta de administrador: ${adminEmail}...`);

    const existingAdmin = await usersService.findByEmail(adminEmail);
    if (existingAdmin) {
        console.log('La cuenta de administrador ya existe.');
        if (existingAdmin.role !== 'admin') {
            console.log('Actualizando rol a admin...');
            (existingAdmin as any).role = 'admin';
            await (existingAdmin as any).save();
            console.log('Rol actualizado con éxito.');
        }
    } else {
        console.log('Creando nueva cuenta de administrador...');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await usersService.create({
            name: 'Administrador RelaxSpa',
            email: adminEmail,
            phone: '8090000000',
            password: hashedPassword,
            role: 'admin'
        });
        console.log('Cuenta de administrador creada con éxito.');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
    }

    await app.close();
}

bootstrap();
