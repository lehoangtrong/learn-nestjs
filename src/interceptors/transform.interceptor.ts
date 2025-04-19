import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    data: T;
    statusCode: number;
    message: string;
}

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
    implements NestInterceptor<T, Response<T>>
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
    ): Observable<Response<T>> {
        return next.handle().pipe(
            map((data) => {
                const response = context.switchToHttp().getResponse();
                const statusCode = response.statusCode;
                
                return {
                    data,
                    statusCode,
                    message: 'Success',
                };
            }),
        );
    }
}
