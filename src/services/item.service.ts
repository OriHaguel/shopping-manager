import { Items, Category } from "@/dtos/category";
import { storageService } from "./async-storage.service"
import { List } from "@/dtos/list";



// export function postList(list) {
//     storageService.post(KEY, list)
// }


const KEY = 'lists'

export function getLists(): List[] {
    return storageService.query(KEY)
}
export function getAList(): List {
    return storageService.get(KEY, "gNVHt")
}
export function saveList(list: List) {
    if (list._id) {
        return storageService.put(KEY, list)
    } else {
        return storageService.post(KEY, list)
    }
}
