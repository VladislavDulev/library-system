import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from 'src/data/user.entity';
import { UserRole } from 'src/models/enums/user-roles';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(roles: UserRole[]) {
        this.roles = roles;
    }

    private roles: UserRole[];

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        const user = request.user;
        return user ? this.roles.includes(user.role) : false;
    }
}