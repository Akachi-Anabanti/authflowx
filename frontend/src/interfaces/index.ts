export interface IUserProfile {
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    full_name: string;
    uuid: string;
    id: number;
}

export interface IUserProfileUpdate {
    email?: string;
    full_name?: string;
    is_active?: boolean;
    is_superuser?: boolean;
}

export interface IUserProfileCreate {
    uuid: string;
    email: string;
    full_name?: string;
    is_active?: boolean;
    is_superuser?: boolean;
}
