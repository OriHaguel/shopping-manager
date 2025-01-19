import { Category } from "./category";

export interface List {
    _id: string;
    name: string;
    ownerId: string;
    categories: Category[];
}