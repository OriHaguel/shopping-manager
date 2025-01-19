import { Category } from "./category";

export interface List {
    _id: string;
    name: string;
    ownerId: string;
}
export interface NoiDList {
    name: string;
    categories: Category[];
    _id?: string;
    ownerId?: string;
}