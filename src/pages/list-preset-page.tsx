import { useState } from 'react';
import { Plus, MoreVertical, Layout, X, Search, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { List } from '@/dtos/list';
import { getLists, removeList, saveList } from '@/services/item.service';
import { useNavigate } from 'react-router-dom';
import { getLoggedinUser } from '@/services/user.service';
import { confirmDeleteCategory } from '@/services/category.service';

const ListPresetPage = () => {
  const navigate = useNavigate()
  const [lists, setLists] = useState<List[]>(getLists());
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  function handleCardClick(ev: React.MouseEvent, id: string) {
    ev.stopPropagation()
    setSelectedCard(id)
    navigate(`/list/${id}`)
  }

  async function deleteList(list: List) {
    const toDelete = await confirmDeleteCategory(list.name)
    if (toDelete) {
      const newList = lists.filter(newlist => newlist._id !== list._id);
      removeList(list._id)
      setLists(newList);
    }

  }

  const handleAddList = async () => {
    if (newListName.trim()) {
      setIsLoading(true);

      const newList: List = {
        name: newListName,
        _id: '',
        ownerId: getLoggedinUser()._id
      };

      setLists([...lists, saveList(newList)]);
      setNewListName('');
      setIsAddingNew(false);
      setIsLoading(false);
    }
  };

  const filteredLists = lists.filter(list =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(list => list.ownerId === getLoggedinUser()._id);

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="animate-in slide-in-from-left duration-500">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Lists</h1>
            <p className="mt-1 text-sm text-gray-500">Manage and organize your lists in one place</p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto animate-in slide-in-from-right duration-500">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search lists..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setIsAddingNew(true)}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New List</span>
            </Button>
          </div>
        </div>

        {/* Add New List Form */}
        {isAddingNew && (
          <Card className="mb-8 border-2 border-blue-200 shadow-lg animate-in slide-in-from-top duration-300">
            <CardHeader>
              <CardTitle className="text-lg">Create New List</CardTitle>
              <CardDescription>Add a new list to organize your items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddList()}

                  placeholder="Enter list name"
                  className="flex-1"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddList}
                    className="flex-1 sm:flex-none"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create List'
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsAddingNew(false);
                      setNewListName('');
                    }}
                    className="flex-1 sm:flex-none"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lists Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLists.map((list, index) => (
            <Card
              key={list._id}
              className={`group hover:shadow-lg transition-all duration-300 hover:border-blue-200 cursor-pointer transform hover:-translate-y-1 ${selectedCard === list._id ? 'ring-2 ring-blue-400' : ''
                }`}
              onClick={(event) => handleCardClick(event, list._id)}
              style={{
                animation: `fadeSlideIn 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {/* <div className={`w-3 h-3 rounded-full ${list.color}`} /> */}
                    <CardTitle className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                      {list.name}
                    </CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-full">
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent onClick={(event) => event.stopPropagation()}>
                      <DropdownMenuItem className="group/item">
                        <Layout className="mr-2 h-4 w-4 group-hover/item:text-blue-500 transition-colors" />
                        <span className="group-hover/item:text-blue-500 transition-colors">View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="group/item">
                        <X className="mr-2 h-4 w-4 group-hover/item:text-red-500 transition-colors" />
                        <span className="group-hover/item:text-red-500 transition-colors" onClick={() => deleteList(list)}>Delete List</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">Categories</p>
                    {/* <span className="text-sm font-medium">{list.categories.length}</span> */}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">Items</p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
                    <div
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListPresetPage;