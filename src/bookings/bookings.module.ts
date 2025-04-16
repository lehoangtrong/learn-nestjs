import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService]
})
export class BookingsModule {}
