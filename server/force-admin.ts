import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/users/users.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    const adminEmail = 'admin@relaxspa.com';

    console.log(`Buscando usuario: ${adminEmail}...`);
    const user = await usersService.findByEmail(adminEmail);

    if (user) {
        console.log(`Usuario encontrado. ID: ${user._id}`);
        console.log(`Rol actual: ${user.role}`);

        if (user.role !== 'admin') {
            console.log('Actualizando rol a admin...');

            // Usando updateProfile del servicio
            const updated = await usersService.updateProfile(user._id, { role: 'admin' });
            console.log('Rol actualizado con éxito.');
            console.log(`Nuevo rol: ${updated.role}`);
        } else {
            console.log('El usuario ya tiene rol de admin.');
        }
    } else {
        console.log('Usuario no encontrado.');
    }

    await app.close();
}

bootstrap();
