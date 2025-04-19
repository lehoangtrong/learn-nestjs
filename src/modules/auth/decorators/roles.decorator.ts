import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity';

/**
 * Roles Decorator
 * 
 * Decorator để đánh dấu các route yêu cầu vai trò cụ thể
 * Sử dụng SetMetadata để gắn metadata 'roles' vào route handler
 * Được sử dụng cùng với RolesGuard để bảo vệ các route
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles); 