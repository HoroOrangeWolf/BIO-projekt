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

export type NonSensitiveVisitModel = {
    start_time: string;
}

export type AddVisitModel = {
    visit_name: string;
    start_time: string;
    description: string;
    doctor: number;
}

export type UpdateVisitModel = {
    visit_name: string;
    start_time: string;
    description: string;
}

export type AddPatientVisitModel = {
    visit_name: string;
    start_time: string;
    description: string;
    patient: number;
}

export type VisitModelType = {
    id: number;
    visit_name: string;
    start_time: string;
    is_visit_finished: boolean;
    description: string;
    created_at: string;
    doctor: number;
}

export type UserSimpleModelType = {
    id: number;
    fist_name: string;
    email: string;
    full_name: string;
}

export type UserVisitFullModelType = {
    id: number;
    visit_name: string;
    start_time: string;
    is_visit_finished: boolean;
    description: string;
    created_at: string;
    user: UserSimpleModelType
    doctor: {
        id: number;
        doctor_number: string;
        doctor_specializations: SpecializationType[];
        user: UserSimpleModelType
    };
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

export type DocumentationType = {
    id: number;
    file_name: string;
    file_description: string;
    visit: VisitModelType;
}
