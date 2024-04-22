import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter<QueryFailedError> {
    catch(exception: QueryFailedError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        // Check the error message or other properties to determine the cause of the error
        const isStringToUUIDError = exception.message.includes('string_to_uuid');

        const status = isStringToUUIDError ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR;

        response.status(status).json({
            status,
            message: isStringToUUIDError ? 'Uuid invalid' : 'Internal Server Error',
            error: HttpStatus[status],
            timestamp: new Date().toISOString()
        });
    }
}
