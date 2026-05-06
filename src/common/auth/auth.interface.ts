import { UserRole } from '../../user/user.enums';

export type Role = UserRole;

export interface IAuthData {
    user_id: number;
    roles: Role[];
    iat: string;
    exp: string;
}

export interface IRequestUser extends IAuthData {
    id: number;
}
