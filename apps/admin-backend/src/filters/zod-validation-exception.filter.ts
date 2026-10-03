import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ZodValidationException } from 'nestjs-zod';
import { Response } from 'express';
import { ZodError } from 'zod';

@Catch(ZodValidationException)
export class ZodValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const zodError = exception.getZodError() as ZodError;

    const firstErrorMessage = zodError.issues.length > 0 ? zodError.issues[0].message : 'Validation failed';

    response.status(status).json({
      statusCode: status,
      message: firstErrorMessage,
      errors: zodError.issues,
    });
  }
}
