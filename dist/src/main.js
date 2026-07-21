"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const common_2 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        rawBody: true,
    });
    app.setGlobalPrefix('api/v1', {
        exclude: [
            {
                path: 'w/p/:apiCredentialId',
                method: common_2.RequestMethod.POST,
            },
        ],
    });
    app.useBodyParser('json', {
        limit: '10mb',
    });
    app.useBodyParser('urlencoded', {
        extended: true,
        limit: '10mb',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
    }));
    const configService = app.get(config_1.ConfigService);
    const port = Number(configService.get('APP_PORT') ?? 3000);
    await app.listen(port);
}
void bootstrap();
//# sourceMappingURL=main.js.map