import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { FilterationMiddleware } from './common/helper/filteration-middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { CaslModule } from './modules/casl/casl.module';
import { TaskModule } from './modules/task/task.module';
import { ProjectModule } from './modules/project/project.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { UserInvitationsModule } from './user-invitations/user-invitations.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //we use the global config so it does not required to import in every module we use

      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DB_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        E_HOST: Joi.string().required(),
        E_SERVICE: Joi.string().required(),
        E_USER: Joi.string().required(),
        E_PASS: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DB_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get('E_HOST'),
            service: configService.get('E_SERVICE'),
            secure: true,
            auth: {
              user: configService.get('E_USER'),
              pass: configService.get('E_PASS'),
            },
          },
          defaults: {
            from: '"task-managment" <taskmanagment@comp.com>',
          },
        };
      },
    }),

    UsersModule,
    AuthModule,
    CaslModule,
    TaskModule,
    ProjectModule,
    OrganizationModule,
    UserInvitationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FilterationMiddleware).forRoutes('*');
  }
}
