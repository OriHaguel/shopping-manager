


import { X } from 'lucide-react';
import { Category, Items } from '../dtos/category';

import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


interface SortableItemProps {
    id: string;
    item: Items;
    category: Category;
    onToggleProperty: (property: 'favorite' | 'checked', item: Items, category: Category) => void;
    onAmountChange: (amount: number, item: Items, category: Category) => void;
    onDeleteItem: (category: Category, item: Items) => void;
}


export const SortableItem: React.FC<SortableItemProps> = ({ id, item, category, onToggleProperty, onAmountChange, onDeleteItem }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            className="flex items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 touch-none"
        >
            {/* Drag handle */}
            <div
                className="mr-3 cursor-move text-gray-400 hover:text-gray-600"
                {...attributes}
                {...listeners}
            >
                ⋮⋮
            </div>

            {/* Item content */}
            <div className="flex-1 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => onToggleProperty('checked', item, category)}
                        className="w-5 h-5 text-blue-600"
                    />
                    <button
                        onClick={() => onToggleProperty('favorite', item, category)}
                        className={`text-2xl ${item.favorite ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                        ★
                    </button>
                    <span className={`text-gray-700 ${item.checked ? 'line-through' : ''}`}>
                        {item.name}
                    </span>
                    <select
                        value={item.amount}
                        onChange={(e) => onAmountChange(parseInt(e.target.value), item, category)}
                        className="ml-2 border border-gray-300 rounded p-1 bg-white"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={() => onDeleteItem(category, item)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                    <X size={20} />
                </button>
            </div>
        </li>
    );
};