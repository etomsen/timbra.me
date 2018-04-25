interface UserLoginInput {
    username: string;
    password: string;
    token?: string;
    expiresInSeconds?: number;
    deviceId?: string;
    deviceModel?: string;
    osVersion?: string;
}