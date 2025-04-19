import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

/**
 * TransformInterceptor
 * 
 * Chặn các phản hồi và chuyển đổi chúng thành một định dạng phản hồi API tiêu chuẩn.
 * Interceptor này đảm bảo tất cả các phản hồi API tuân theo một cấu trúc nhất quán với:
 * - data: Dữ liệu phản hồi thực tế
 * - statusCode: Mã trạng thái HTTP của phản hồi
 * - message: Thông báo thành công
 * - timestamp: Thời điểm phản hồi được tạo
 */
@Injectable()
export class TransformInterceptor<T>
implements NestInterceptor<T, ApiResponse<T>>
{
    /**
     * Phương thức intercept chuyển đổi phản hồi
     * @param context - Ngữ cảnh thực thi
     * @param next - Trình xử lý tiếp theo trong chuỗi
     * @returns Observable với phản hồi API tiêu chuẩn hóa
     */
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse<T>> {
        // Lấy ngữ cảnh HTTP và đối tượng phản hồi
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        // Trích xuất mã trạng thái từ phản hồi
        const statusCode = response.statusCode;

        // Xử lý trình xử lý và chuyển đổi phản hồi
        return next.handle().pipe(
            map((data) => ({
                data,                           // Dữ liệu phản hồi gốc
                statusCode,                     // Mã trạng thái HTTP
                message: 'Success',             // Thông báo thành công mặc định
                timestamp: new Date().toISOString(), // Thời gian hiện tại
            })),
        );
    }
}
