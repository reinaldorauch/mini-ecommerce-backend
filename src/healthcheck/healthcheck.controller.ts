import { Controller, Get } from '@nestjs/common';
import { HealthcheckService } from './healthcheck.service';

@Controller('healthcheck')
export class HealthcheckController {
  constructor(private readonly svc: HealthcheckService) {}

  @Get()
  async healthCheck(): Promise<void> {
    // async/await declarations to clean the return values
    await this.svc.healthcheck();
  }
}
