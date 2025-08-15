import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {globalPipes} from './app/pipes';
import {AnyExceptionFilter} from './app/filters/any-exception-filter'
import {ConfigModule, ConfigService} from 'nestjs-config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    globalPipes(app);

    //  app.useGlobalFilters(new AnyExceptionFilter());
    const configService: ConfigService = app.get(ConfigService);

    const port = process.env.PORT || configService.get('app.PORT')

    await app.listen(port, '0.0.0.0');

    console.log('Open ADMIN '+ process.env.NODE_ENV + ' server on ' + port)
}

bootstrap();
