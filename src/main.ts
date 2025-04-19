import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS | Cho phép truy cập từ nhiều nguồn
    app.enableCors();

    // Enable validation pipe | Xác thực dữ liệu đầu vào
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));

    // Global interceptors | Chuyển đổi phản hồi API theo định dạng chuẩn
    app.useGlobalInterceptors(new TransformInterceptor());

    // Global filters | Xử lý tất cả các lỗi
    app.useGlobalFilters(new AllExceptionsFilter());

    // Setup Swagger | Tạo tài liệu API
    const config = new DocumentBuilder()
        .setTitle('NestJS API')
        .setDescription('The NestJS API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => {
    console.error('Application failed to start:', error);
    process.exit(1);
});
