import { SavedUserDto, UserDto, UserDtoWithId } from "@/dtos/user";
import { storageService } from "./async-storage.service";
const KEY = "users";
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const KEEPING_LOGGEDIN_USER = 'keepingLoggedinUser'

export function getEmptyCredentials(): UserDto {
    return {
        username: "",
        password: ""
    }
}

export function login(credentials: UserDto) {
    const users: UserDto[] = storageService.query(KEY);
    const getUser = users.find(user => user.username === credentials.username && user.password === credentials.password)
    if (!getUser) throw new Error('Invalid credentials')
    _keepingLoggedinUser(getUser)
    return _saveLoggedinUser(getUser)
}
export function signup(credentials: UserDto) {
    const user: UserDto = storageService.post(KEY, credentials);
    if (!user) throw new Error('Cant signup')

    return _saveLoggedinUser(user)
}

function _saveLoggedinUser(user: UserDto): SavedUserDto {
    const userToPost = {
        _id: user._id,
        username: user.username,
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToPost))
    return userToPost
}

export function getLoggedinUser(): UserDtoWithId {
    const user = sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER);
    return user ? JSON.parse(user) : null;

}

function _keepingLoggedinUser(user: UserDto) {
    return localStorage.setItem(KEEPING_LOGGEDIN_USER, JSON.stringify(user))

}
export function putLoggedInUser(): SavedUserDto | void {
    const user = JSON.parse(localStorage.getItem(KEEPING_LOGGEDIN_USER)!)
    if (user) {
        return _saveLoggedinUser(user)
    }

}

