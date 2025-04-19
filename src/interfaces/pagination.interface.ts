/**
 * IPaginationOptions Interface
 * 
 * Định nghĩa các tùy chọn cho phân trang.
 * 
 * @property {number} page - Số trang hiện tại cần lấy dữ liệu
 * @property {number} limit - Số lượng bản ghi tối đa trên mỗi trang
 */
export interface IPaginationOptions {
    page: number;
    limit: number;
}

/**
 * IPaginationResult Interface
 * 
 * Định nghĩa cấu trúc kết quả trả về cho dữ liệu đã phân trang.
 * 
 * @template T - Kiểu dữ liệu của các phần tử trong mảng kết quả
 * @property {T[]} items - Mảng các phần tử dữ liệu của trang hiện tại
 * @property {number} total - Tổng số bản ghi có sẵn
 * @property {number} page - Số trang hiện tại
 * @property {number} limit - Số lượng bản ghi tối đa trên mỗi trang
 * @property {number} totalPages - Tổng số trang dựa trên tổng số bản ghi và giới hạn
 */
export interface IPaginationResult<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
