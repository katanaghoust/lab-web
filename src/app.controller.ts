import { Controller, Get, Render, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';
import { ApiCookieAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  @ApiCookieAuth()
  @UseGuards(new AuthGuard())
  getIndex(@Query('auth') auth: string) {
    const isAuthenticated = auth === 'true';
    return {
      user: isAuthenticated ? { name: 'Тимофей' } : null,
      authParam: isAuthenticated ? '?auth=true' : '',
      cars: [
        {
          model: 'Koenigsegg Jesko Attack Odin',
          price: '5 500 000 $',
          image:
            'https://f1rstmotors.com/_next/image?url=https%3A%2F%2Ff1rst-motors.s3.me-central-1.amazonaws.com%2Fcars%2F1714745656998-blob&w=3840&q=100',
        },
        {
          model: 'Mercedes-Benz AMG GT Black Series',
          price: '900 000 $',
          image:
            'https://f1rstmotors.com/_next/image?url=https%3A%2F%2Ff1rst-motors.s3.me-central-1.amazonaws.com%2Fcars%2F1716396258098-blob&w=3840&q=100',
        },
        {
          model: 'Bugatti Chiron Sport',
          price: '4 300 000 $',
          image:
            'https://f1rstmotors.com/_next/image?url=https%3A%2F%2Ff1rst-motors.s3.me-central-1.amazonaws.com%2Fcars%2F1708774218475-blob&w=3840&q=100',
        },
        {
          model: 'Mercedes-Benz AMG One',
          price: '4 600 000 $',
          image:
            'https://f1rstmotors.com/_next/image?url=https%3A%2F%2Ff1rst-motors.s3.me-central-1.amazonaws.com%2Fcars%2F1710240587670-blob&w=3840&q=100',
        },
        {
          model: 'Lamborghini Revuelto',
          price: '1 400 000 $',
          image:
            'https://f1rstmotors.com/_next/image?url=https%3A%2F%2Ff1rst-motors.s3.me-central-1.amazonaws.com%2Fcars%2F1725965979183-blob&w=3840&q=100',
        },
        {
          model: 'McLaren Senna',
          price: '1 200 000 $',
          image:
            'https://f1rstmotors.com/_next/image?url=https%3A%2F%2Ff1rst-motors.s3.me-central-1.amazonaws.com%2Fcars%2F1724774959127-blob&w=3840&q=100',
        },
      ],
      specs: [
        {
          model: 'Koenigsegg Jesko Attack Odin',
          price: '5 500 000 $',
          engine: '3.8L V8',
          power: '1284 л.с.',
          drive: 'Задний привод',
        },
        {
          model: 'Mercedes-Benz AMG GT Black Series',
          price: '900 000 $',
          engine: '4.0L V8 Biturbo',
          power: '720 л.с.',
          drive: 'Задний привод',
        },
        {
          model: 'Bugatti Chiron Sport',
          price: '4 300 000 $',
          engine: '8.0L W16 Quad Turbo',
          power: '1600 л.с.',
          drive: 'Задний привод',
        },
        {
          model: 'Mercedes-Benz AMG One',
          price: '4 600 000 $',
          engine: '1.6L V6 Turbo Hybrid',
          power: '1000 л.с.',
          drive: 'Задний привод',
        },
        {
          model: 'Lamborghini Revuelto',
          price: '1 400 000 $',
          engine: '6.5L V12 Biturbo',
          power: '1010 л.с.',
          drive: 'Задний привод',
        },
        {
          model: 'McLaren Senna',
          price: '1 200 000 $',
          engine: '4.0L Twin-Turbo V8',
          power: '800 л.с.',
          drive: 'Задний привод',
        },
      ],
    };
  }
  @Get('signup')
  @Render('signup')
  async signup() {
    return {
      styles: '/css/auth.css',
      layout: 'layouts/main',
      title: 'signup',
    };
  }

  @Get('login')
  @Render('login')
  async login() {
    return {
      styles: '/css/auth.css',
      layout: 'layouts/main',
      title: 'signin',
    };
  }

  getHello() {
    return undefined;
  }
}
