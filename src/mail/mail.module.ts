import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import * as path from 'path';

import { MailService } from './mail.service';
@Module({
  imports: [
    MailerModule.forRoot({
      transport: `smtp://for.test0077@gmail.com:xtbfgkwlvyskhliu@smtp.gmail.com:587`,
      defaults: {
        from: `"nestjs" <for.test0077@gmail.com>`,
      },
      template: {
        dir: path.join(__dirname, '..', '..', '/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
