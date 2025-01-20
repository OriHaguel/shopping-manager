import { useState } from 'react';
import { PlusCircle, X, FolderPlus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Category, Items } from '../dtos/category'
import { useParams } from 'react-router-dom';
import { getCategories, removeCategory, removeItem, saveCategory, saveItem } from '@/services/category.service';
import { storageService } from '@/services/async-storage.service';

interface OpenCategories {
  [key: number]: boolean;
}

interface NewItemInputs {
  [key: number]: string;
}

const CategoryManagementPage: React.FC = () => {
  const { id } = useParams()
  const [categories, setCategories] = useState<Category[]>(getCategories(id!));
  const [showCategoryInput, setShowCategoryInput] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newItemInputs, setNewItemInputs] = useState<NewItemInputs>({});
  const [openCategories, setOpenCategories] = useState<OpenCategories>({});

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

  const handleDeleteCategory = (indexToDelete: number, categoryId: string): void => {
    removeCategory(categoryId)
    setCategories(categories.filter((_, index) => index !== indexToDelete));
    const updatedOpenCategories = { ...openCategories };
    delete updatedOpenCategories[indexToDelete];
    setOpenCategories(updatedOpenCategories);
  };

  const handleDeleteItem = (category: Category, item: Items): void => {
    const updatedCategories = [...categories];
    const categoryAfterItemRemoved = removeItem(category._id, item._id)
    const index = updatedCategories.findIndex(cat => cat._id === categoryAfterItemRemoved._id);
    if (index !== -1) {
      updatedCategories[index] = categoryAfterItemRemoved;
    }
    setCategories(updatedCategories);
  };

  const handleRemoveChecked = (categoryIndex: number, category: Category): void => {

    const updatedCategories = [...categories];
    // const getcategory = updatedCategories[categoryIndex];
    // const uncheckedItems = getcategory.items.filter(item => !item.checked);
    // const itemsToRemove = getcategory.items.filter(item => item.checked);
    category.items.forEach(item => {
      item.checked = false
    });
    console.log("🚀 ~ handleRemoveChecked ~ category:", category)
    // // Remove each checked item
    // itemsToRemove.forEach(item => {
    //   saveItem(getcategory._id, item);
    // });
    saveCategory(category)
    updatedCategories[categoryIndex] = category;
    setCategories(updatedCategories);
  };

  const handleAmountChange = (categoryIndex: number, itemIndex: number, amount: number, item: Items): void => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].items[itemIndex].amount = amount;
    console.log(updatedCategories[categoryIndex].items[itemIndex].amount)
    saveItem(updatedCategories[categoryIndex]._id, item);
    setCategories(updatedCategories);
  };

  const toggleCategory = (categoryIndex: number): void => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryIndex]: !prev[categoryIndex]
    }));
  };

  const toggleItemProperty = (categoryIndex: number, itemIndex: number, property: 'favorite' | 'checked', item: Items): void => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].items[itemIndex][property] = !updatedCategories[categoryIndex].items[itemIndex][property]
    // updatedCategories[categoryIndex].items[itemIndex][property] = !item[property]
    saveItem(updatedCategories[categoryIndex]._id, item)
    setCategories(updatedCategories);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 pt-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">Category Management</h1>

          {!showCategoryInput ? (
            <button
              onClick={() => setShowCategoryInput(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 mx-auto shadow-md"
            >
              <FolderPlus size={24} />
              <span className="font-semibold">Add New Category</span>
            </button>
          ) : (
            <div className="flex gap-3 justify-center">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="border-2 border-gray-200 p-3 rounded-lg w-64 focus:outline-none focus:border-blue-400 shadow-sm"
                onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleAddCategory()}
              />
              <button
                onClick={handleAddCategory}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-semibold shadow-sm"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowCategoryInput(false);
                  setNewCategoryName('');
                }}
                className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-colors duration-200 font-semibold shadow-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {categories.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <FolderPlus size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No categories yet. Create your first category to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div
                  className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleCategory(categoryIndex)}
                >
                  <div className="flex items-center gap-3">
                    {openCategories[categoryIndex] ? (
                      <ChevronUp size={24} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={24} className="text-gray-400" />
                    )}
                    <h2 className="text-2xl font-bold text-gray-800">{category.name}</h2>
                    <span className="text-gray-400 text-sm">
                      ({category.items.length} items)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleRemoveChecked(categoryIndex, category);
                      }}
                      className="text-gray-400 hover:text-orange-500 transition-colors duration-200"
                      title="Remove checked items"
                    >
                      <Trash2 size={24} />
                    </button>
                    <button
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleDeleteCategory(categoryIndex, category._id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {openCategories[categoryIndex] && (
                  <div className="p-6 border-t border-gray-100">
                    <div className="mb-6">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={newItemInputs[categoryIndex] || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleItemInputChange(categoryIndex, e.target.value)
                          }
                          placeholder="Add new item"
                          className="border-2 border-gray-200 p-3 rounded-lg flex-1 focus:outline-none focus:border-blue-400"
                          onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleAddItem(categoryIndex)}
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
                      <ul className="space-y-3">
                        {category.items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex justify-between items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => toggleItemProperty(categoryIndex, itemIndex, 'checked', item)}
                                className="w-5 h-5 text-blue-600"
                              />
                              <button
                                onClick={() => toggleItemProperty(categoryIndex, itemIndex, 'favorite', item)}
                                className={`text-2xl ${item.favorite ? 'text-yellow-500' : 'text-gray-300'}`}
                              >
                                ★
                              </button>
                              <span className={`text-gray-700 ${!item.checked && !item.favorite ? 'line-through' : ''}`}>
                                {item.name}
                              </span>
                              <select
                                value={item.amount}
                                onChange={(e) => handleAmountChange(categoryIndex, itemIndex, parseInt(e.target.value), item)}
                                className="ml-2 border border-gray-300 rounded p-1 bg-white"
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                  <option key={num} value={num}>{num}</option>
                                ))}
                              </select>
                            </div>
                            <button
                              onClick={() => handleDeleteItem(category, item)}
                              className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                            >
                              <X size={20} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagementPage;