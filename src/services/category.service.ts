const KEY = 'categories'

import { Category, Items } from "@/dtos/category"
import { storageService } from "./async-storage.service"


export function getCategories(): Category[] {
    return storageService.query(KEY)
}
export function saveCategory(category: Category) {
    if (category._id && category._id !== '') {
        return storageService.put(KEY, category)
    } else {
        return storageService.post(KEY, category)
    }
}

export function saveItem(categoryId: string, item: Items) {
    const category = storageService.get(KEY, categoryId) as Category;
    if (!category) {
        throw new Error('Category not found');
    }

    if (item._id && item._id !== '') {
        // Update existing item
        const itemIndex = category.items.findIndex((i) => i._id === item._id);
        if (itemIndex !== -1) {
            category.items[itemIndex] = item;
        } else {
            throw new Error('Item not found in category');
        }
    } else {
        // Add new item
        item._id = storageService.makeId(); // Assuming a helper function `generateId()` exists
        category.items.push(item);
    }

    return storageService.put(KEY, category); // Save the updated category
}
// saveItem('fLsri', { name: 'Milk', favorite: true, checked: false, amount: 1, _id: '' })