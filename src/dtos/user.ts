export interface UserDto {
    _id?: string;
    username: string;
    password: string;
}
export interface UserDtoWithId {
    _id: string;
    username: string;
    password: string;
}
export interface SavedUserDto {
    _id?: string;
    username: string;

}

export type EntityId = {
    _id: string
}