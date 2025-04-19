/**
 * ApiResponse Interface
 * 
 * Định nghĩa cấu trúc chuẩn cho tất cả các phản hồi API trong ứng dụng.
 * Interface này được sử dụng bởi TransformInterceptor để đảm bảo tất cả
 * các phản hồi API tuân theo một định dạng nhất quán.
 * 
 * @template T - Kiểu dữ liệu của phần dữ liệu trong phản hồi
 * @property {T} data - Dữ liệu phản hồi thực tế từ endpoint
 * @property {number} statusCode - Mã trạng thái HTTP của phản hồi
 * @property {string} message - Thông báo mô tả kết quả của yêu cầu
 * @property {string} timestamp - Thời điểm phản hồi được tạo (định dạng ISO)
 */
export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message: string;
  timestamp: string;
} 