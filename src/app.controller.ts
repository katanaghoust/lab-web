import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  redirectToStatic(@Res() res: Response) {
    res.redirect('/html/Falcon.html'); // или index.html, как хочешь
  }
}
