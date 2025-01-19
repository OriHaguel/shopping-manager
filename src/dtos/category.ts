export interface Category {
    _id?: string;
    name: string;
    items: Items[];
    // listId: string;
}
export interface Items {
    _id?: string;
    name: string;
    favorite: boolean;
    checked: boolean;
    amount: number;
}