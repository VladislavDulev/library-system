import { UserRole } from "src/models/enums/user-roles";

export class JwtPayload {
    sub: number;
    username: string;
    role: UserRole;
}