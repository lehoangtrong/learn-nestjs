import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // Lấy context của request
    const response = ctx.getResponse<Response>(); // Lấy response từ context
    const request = ctx.getRequest<Request>(); // Lấy request từ context

    let status = HttpStatus.INTERNAL_SERVER_ERROR; // Mã status mặc định là 500
    let message = 'Internal server error'; // Message mặc định
    let error = 'Internal Server Error'; // Error message mặc định

    if (exception instanceof HttpException) { // Giả sử exception là HttpException từ controller throw ra exception
      status = exception.getStatus(); // Lấy status từ exception nếu nó là HttpException 
      const exceptionResponse = exception.getResponse(); // Lấy response từ exception

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) { // Kiểm tra xem response có phải là object và không phải null
        if ('message' in exceptionResponse) { // Kiểm tra xem response có message không
          message = Array.isArray(exceptionResponse.message)
            ? exceptionResponse.message[0] // Nếu message là array, lấy phần tử đầu tiên
            : exceptionResponse.message; // Nếu message không phải là array, lấy message
        }
        if ('error' in exceptionResponse) { // Kiểm tra xem response có error không
          error = exceptionResponse.error as string; // Lấy error từ response
        }
      }
    } else if (exception instanceof Error) { // Nếu exception là Error
      message = exception.message; // Lấy message từ exception
      error = exception.name; // Lấy name từ exception
    }

    response.status(status).json({
      statusCode: status, // Trả về status code
      timestamp: new Date().toISOString(), // Trả về timestamp
      path: request.url, // Trả về url
      message, // Trả về message
      error, // Trả về error
    });
  }
} 