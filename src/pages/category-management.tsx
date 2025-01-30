import { useEffect, useRef, useState } from 'react';
import { PlusCircle, FolderPlus, Star, CheckSquare, Search, X } from 'lucide-react';
import { Category, Items } from '../dtos/category';
import { useNavigate, useParams } from 'react-router-dom';
import { addCategories, confirmDeleteCategory, getCategories, removeCategories, removeCategory, removeItem, saveCategory, saveItem } from '@/services/category.service';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from '@/cmps/SortItem';
import { SortableCategory } from '@/cmps/SortCategory';
interface OpenCategories {
  [key: number]: boolean;
}
interface NewItemInputs {
  [key: number]: string;
}

export const CategoryManagementPage: React.FC = () => {
  const { id } = useParams()
  const elCategoryInput = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>(getCategories(id!));
  const [showCategoryInput, setShowCategoryInput] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newItemInputs, setNewItemInputs] = useState<NewItemInputs>({});
  const [openCategories, setOpenCategories] = useState<OpenCategories>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [showChecked, setShowChecked] = useState<boolean>(false);
  console.log("🚀 ~ showChecked:", showChecked)
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {

    const handleBack = () => {
      setOpenCategories({})
    };
    const preventBack = () => {
      history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handleBack);
    if (Object.keys(openCategories).length > 0) {
      preventBack();
    }

    return () => window.removeEventListener("popstate", handleBack);
  }, [openCategories]);

  useEffect(() => {
    if (!id) return
    setCategories(getCategories(id))
  }, [activeId, id]);

  useEffect(() => {
    elCategoryInput.current?.focus();
  }, [showCategoryInput]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (typeof active.id === 'string' && active.id !== over.id) {
      const isCategory = active.id.startsWith('category-');

      if (isCategory) {
        const oldIndex = categories.findIndex(cat => `category-${cat._id}` === active.id);
        const newIndex = categories.findIndex(cat => `category-${cat._id}` === over.id);

        const reorderedCategories = arrayMove(categories, oldIndex, newIndex);
        // addCategories(reorderedCategories)
        removeCategories()
        reorderedCategories.map((cat) => addCategories(cat))
        setCategories(reorderedCategories);
        // You might want to save the new order to your backend here
      } else {
        // Ensure active.id and over.id are both strings before calling split
        if (typeof active.id === 'string' && typeof over.id === 'string') {
          const [sourceItemId, sourceCategoryId] = active.id.split('-in-category-');
          const [targetItemId, targetCategoryId] = over.id.split('-in-category-');

          const sourceCategory = categories.find(cat => cat._id === sourceCategoryId);
          const targetCategory = categories.find(cat => cat._id === targetCategoryId);

          if (sourceCategory && targetCategory) {
            const sourceItemIndex = sourceCategory.items.findIndex(item => item._id === sourceItemId);
            const targetItemIndex = targetCategory.items.findIndex(item => item._id === targetItemId);

            const newCategories = [...categories];

            if (sourceCategoryId === targetCategoryId) {
              // Moving within the same category
              const categoryIndex = categories.findIndex(cat => cat._id === sourceCategoryId);
              newCategories[categoryIndex].items = arrayMove(
                sourceCategory.items,
                sourceItemIndex,
                targetItemIndex
              );
            } else {
              // Moving between categories
              const item = sourceCategory.items[sourceItemIndex];
              const sourceCategoryIndex = categories.findIndex(cat => cat._id === sourceCategoryId);
              const targetCategoryIndex = categories.findIndex(cat => cat._id === targetCategoryId);

              newCategories[sourceCategoryIndex].items = sourceCategory.items.filter((_, index) => index !== sourceItemIndex);
              newCategories[targetCategoryIndex].items.splice(targetItemIndex, 0, item);
            }
            const categoryAfterDrag = newCategories.find(cat => cat._id === sourceCategoryId)
            saveCategory(categoryAfterDrag!)
            setCategories(newCategories);
            // Save changes to backend here
          }
        }
      }
    }

    setActiveId(null);
  };

  const filterItems = (items: Items[]): Items[] => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFavorite = showFavorites ? item.favorite : true;
      const matchesChecked = showChecked ? item.checked : true;
      return matchesSearch && matchesFavorite && matchesChecked;
    });
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    items: filterItems(category.items),
  })).filter(category =>
    searchTerm === '' ||
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.items.length > 0
  );

  const handleAddCategory = (): void => {
    if (newCategoryName.trim()) {
      const newCategoryIndex = categories.length;
      const savedCategory = saveCategory({ name: newCategoryName, items: [], listId: id!, _id: '' })
      setCategories([...categories, savedCategory]);
      setOpenCategories(prev => ({ ...prev, [newCategoryIndex]: true }));
      setNewCategoryName('');
      setShowCategoryInput(false);
    }
  };

  const handleAddItem = (categoryIndex: number): void => {
    const itemName = newItemInputs[categoryIndex];
    if (itemName?.trim()) {
      const updatedCategories = [...categories];
      const newItem: Items = {
        name: itemName,
        favorite: false,
        checked: false,
        amount: 1,
        _id: ''
      };
      updatedCategories[categoryIndex].items.push(newItem);
      saveItem(updatedCategories[categoryIndex]._id, newItem)
      setCategories(updatedCategories);
      setNewItemInputs(prev => ({
        ...prev,
        [categoryIndex]: ''
      }));
    }
  };

  const handleItemInputChange = (categoryIndex: number, value: string): void => {
    setNewItemInputs(prev => ({
      ...prev,
      [categoryIndex]: value
    }));
  };

  const handleDeleteCategory = async (indexToDelete: number, category: Category): Promise<void> => {
    const toDelete = await confirmDeleteCategory(category.name)
    if (toDelete) {
      removeCategory(category._id)
      setCategories(categories.filter((_, index) => index !== indexToDelete));
      const updatedOpenCategories = { ...openCategories };
      delete updatedOpenCategories[indexToDelete];
      setOpenCategories(updatedOpenCategories);
    }
  };

  const handleDeleteItem = async (category: Category, item: Items): Promise<void> => {
    const toDelete = await confirmDeleteCategory(item.name)
    if (toDelete) {
      const updatedCategories = [...categories];
      const categoryAfterItemRemoved = removeItem(category._id, item._id)
      const index = updatedCategories.findIndex(cat => cat._id === categoryAfterItemRemoved._id);
      if (index !== -1) {
        updatedCategories[index] = categoryAfterItemRemoved;
      }
      setCategories(updatedCategories);
    }
  };

  const handleRemoveChecked = (categoryIndex: number, category: Category): void => {

    const updatedCategories = [...categories];
    category.items.forEach(item => {
      item.checked = false
    });
    saveCategory(category)
    updatedCategories[categoryIndex] = category;
    setCategories(updatedCategories);
  };

  const handleAmountChange = (amount: number, item: Items, category: Category): void => {
    const updatedCategories = [...categories];
    const catUp = updatedCategories.map((cat) => (cat._id === category._id ? { ...cat, items: cat.items.map((it) => (it._id === item._id ? { ...it, amount } : it)) } : cat))
    item.amount = amount
    saveItem(category._id, item);
    setCategories(catUp);
  };

  const toggleCategory = (categoryIndex: number): void => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryIndex]: !prev[categoryIndex]
    }));
  };

  const toggleItemProperty = (property: 'favorite' | 'checked', item: Items, category: Category): void => {
    const updatedCategories = [...categories];
    const catUp = updatedCategories.map((cat) => (cat._id === category._id ? { ...cat, items: cat.items.map((it) => (it._id === item._id ? { ...it, [property]: !it[property] } : it)) } : cat))
    item[property] = !item[property]
    saveItem(category._id, item)
    setCategories(catUp);
  };

  const handleClearFilters = (): void => {
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 pt-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">Category Management</h1>

          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories and items..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 shadow-sm"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${showFavorites
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                  : 'border-gray-200 text-gray-600'
                  }`}
              >
                <Star
                  size={18}
                  className={showFavorites ? 'fill-yellow-500 text-yellow-500' : ''}
                />
                Favorites
              </button>
              <button
                onClick={() => setShowChecked(!showChecked)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${showChecked
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'border-gray-200 text-gray-600'
                  }`}
              >
                <CheckSquare
                  size={18}
                  className={showChecked ? 'text-blue-500' : ''}
                />
                Checked
              </button>
              {searchTerm && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                >
                  <X size={18} />
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Add Category Section */}
          {!showCategoryInput ? (
            <button
              onClick={() => setShowCategoryInput(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 mx-auto shadow-md"
            >
              <FolderPlus size={24} />
              <span className="font-semibold">Add New Category</span>
            </button>
          ) : (
            <div className="flex flex-wrap gap-3 justify-center items-center w-full max-w-lg mx-auto">
              <input
                ref={elCategoryInput}
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="border-2 border-gray-200 p-3 rounded-lg w-full sm:w-64 focus:outline-none focus:border-blue-400 shadow-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <button
                onClick={handleAddCategory}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-semibold shadow-sm w-full sm:w-auto"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowCategoryInput(false);
                  setNewCategoryName('');
                }}
                className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors duration-200 font-semibold shadow-sm w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Categories List Section */}
        {filteredCategories.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            {categories.length === 0 ? (
              <>
                <FolderPlus size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">No categories yet. Create your first category to get started!</p>
              </>
            ) : (
              <>
                <Search size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">No matches found for your search criteria.</p>
              </>
            )}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={categories.map(cat => `category-${cat._id}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {filteredCategories.map((category, categoryIndex) => (
                  <SortableCategory
                    key={`category-${category._id}`}
                    id={`category-${category._id}`}
                    category={category}
                    checked={showChecked}
                    isOpen={openCategories[categoryIndex]}
                    onToggle={() => toggleCategory(categoryIndex)}
                    onDeleteCategory={() => handleDeleteCategory(categoryIndex, category)}
                    onRemoveChecked={() => handleRemoveChecked(categoryIndex, category)}
                  >
                    <div className="p-6 border-t border-gray-100">
                      <div className="mb-6">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={newItemInputs[categoryIndex] || ''}
                            onChange={(e) => handleItemInputChange(categoryIndex, e.target.value)}
                            placeholder="Add new item"
                            className="border-2 border-gray-200 p-3 rounded-lg flex-1 focus:outline-none focus:border-blue-400"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddItem(categoryIndex)}
                          />
                          <button
                            onClick={() => handleAddItem(categoryIndex)}
                            className="bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                          >
                            <PlusCircle size={24} />
                          </button>
                        </div>
                      </div>

                      {category.items.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">No items yet</p>
                      ) : (
                        <SortableContext
                          items={category.items.map(item => `${item._id}-in-category-${category._id}`)}
                          strategy={verticalListSortingStrategy}
                        >
                          <ul className="space-y-3">
                            {category.items.map((item) => (
                              <SortableItem
                                key={`${item._id}-in-category-${category._id}`}
                                id={`${item._id}-in-category-${category._id}`}
                                item={item}
                                category={category}
                                onToggleProperty={toggleItemProperty}
                                onAmountChange={handleAmountChange}
                                onDeleteItem={handleDeleteItem}
                              />
                            ))}
                          </ul>
                        </SortableContext>
                      )}
                    </div>
                  </SortableCategory>
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 opacity-80">
                  {activeId.startsWith('category-') ? (
                    <div className="p-6">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {categories.find(cat => `category-${cat._id}` === activeId)?.name}
                      </h2>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      {(() => {
                        const [itemId, categoryId] = activeId.split('-in-category-');
                        const category = categories.find(cat => cat._id === categoryId);
                        const item = category?.items.find(item => item._id === itemId);
                        return item?.name;
                      })()}
                    </div>
                  )}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
};