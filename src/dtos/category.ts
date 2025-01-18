export interface Category {
    name: string;
    items: Items[];
}
export interface Items {
    name: string;
    favorite: boolean;
    checked: boolean;
}