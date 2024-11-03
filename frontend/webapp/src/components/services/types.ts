export type VisitType = {
    id: number;
    visit_name: string;
    start_time: string;
    expected_end_time: string;
    is_approved_by_doctor: boolean;
    is_visit_finished: boolean;
    description: string;
    created_at: string;
}

export type SpecializationModel = {
    id: number;
    specialization_name: string;
}

export type AddSpecializationModel = {
    specialization_name: string;
}

export type PermissionType = {
    id: number;
    codename: string;
    name: string;
}

export type GroupType = {
    id: number;
    name: string;
    permissions: PermissionType[];
}

export type PaginationType<T> = {
    count: number;
    results: T[];
}

export type SpecializationType = {
    id: number;
    specialization_name: string;
}

export type UserModelType = {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    full_name: string;
    user_permissions: PermissionType[];
    groups: GroupType[];
    is_active: boolean;
    doctor_details?: {
        id: number;
        doctor_number: string;
        doctor_specializations: SpecializationType[]
    }
}

export type UpdateUserModel = {
    user: {
        email: string;
        first_name: string;
        last_name: string;
    },
    details?: {
        doctor_number: string;
        doctor_specializations: number[]
    } | null
}

export type AddUserRequest = {
    user: {
        email: string;
        username: string;
        first_name: string;
        last_name: string;
        password: string;
        confirmPassword: string;
    },
    details?: {
        doctor_number: string;
        doctor_specializations: number[]
    } | null
}
