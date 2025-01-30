
import { ChevronDown, ChevronUp, Trash2, X } from 'lucide-react';
import { Category } from '../dtos/category';

import {

    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { limitLetters } from '@/services/category.service';


interface SortableCategoryProps {
    id: string;
    category: Category;
    isOpen: boolean;
    onToggle: () => void;
    onDeleteCategory: () => void;
    onRemoveChecked: () => void;
    children: React.ReactNode;
}

export const SortableCategory: React.FC<SortableCategoryProps> = ({
    id,
    category,
    isOpen,
    onToggle,
    onDeleteCategory,
    onRemoveChecked,
    children
}) => {
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
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white rounded-xl shadow-lg border border-gray-100"
        >
            <div className="p-6 flex justify-between items-center truncate overflow-hidden whitespace-nowrap">
                {/* Drag handle */}
                <div
                    className="mr-2 cursor-move text-gray-400 hover:text-gray-600 touch-none"
                    {...attributes}
                    {...listeners}
                >
                    ⋮⋮
                </div>

                {/* Clickable header area */}
                <div
                    className="flex-1 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                    onClick={onToggle}
                >
                    <div className="flex items-center gap-3">
                        {isOpen ? (
                            <ChevronUp size={24} className="text-gray-400" />
                        ) : (
                            <ChevronDown size={24} className="text-gray-400" />
                        )}
                        <h2 className="text-2xl font-bold text-gray-800 ">{limitLetters(category.name, 12)}</h2>
                        <span className={`text-gray-400 text-sm ${category.items.length > 0 ? 'text-red-500' : ''}`}>
                            ({category.items.length} items)
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveChecked();
                            }}
                            className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
                            title="Remove checked items"
                        >
                            <Trash2 size={24} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteCategory();
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && children}
        </div>
    );
};