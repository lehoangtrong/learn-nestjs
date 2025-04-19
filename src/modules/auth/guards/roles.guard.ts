import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/user.entity';

/**
 * Roles Guard
 * 
 * Bảo vệ các route yêu cầu vai trò cụ thể
 * Sử dụng metadata 'roles' được đặt bởi @Roles decorator
 * Kiểm tra xem người dùng có vai trò phù hợp không
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lấy các vai trò yêu cầu từ metadata
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // Nếu không có vai trò yêu cầu, cho phép truy cập
    if (!requiredRoles) {
      return true;
    }
    
    // Lấy thông tin người dùng từ request
    const { user } = context.switchToHttp().getRequest();
    // Kiểm tra xem người dùng có vai trò phù hợp không
    return requiredRoles.some((role) => user?.role === role);
  }
} 