import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Lock, Save, Plus, Trash, Edit } from 'lucide-react';

interface AdminProps {
  isAuthenticated: boolean;
  onLogin: (email: string, password: string) => Promise<void>;
}

export const Admin = ({ isAuthenticated, onLogin }: AdminProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('education');
  const [formData, setFormData] = useState({});
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchItems(activeTab);
    }
  }, [isAuthenticated, activeTab]);

  const fetchItems = async (table: string) => {
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.error('Error fetching items:', error);
      return;
    }
    setItems(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      await onLogin(email, password);
      return;
    }

    const table = activeTab;
    if (editingId) {
      const { error } = await supabase
        .from(table)
        .update(formData)
        .eq('id', editingId);
      if (error) console.error('Error updating item:', error);
    } else {
      const { error } = await supabase
        .from(table)
        .insert([formData]);
      if (error) console.error('Error inserting item:', error);
    }

    setFormData({});
    setEditingId(null);
    fetchItems(table);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from(activeTab)
      .delete()
      .eq('id', id);
    if (error) console.error('Error deleting item:', error);
    fetchItems(activeTab);
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setEditingId(item.id);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96">
          <div className="flex justify-center mb-6">
            <Lock className="w-12 h-12 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="flex space-x-4 mb-8">
          {['education', 'skills', 'experience', 'projects', 'social_links'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Item' : 'Add New Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {getFormFields(activeTab).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    value={formData[field] || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="flex items-center justify-center w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
              >
                {editingId ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Existing Items</h2>
            <div className="space-y-4">
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <div>
                    <h3 className="font-medium">{item.title || item.name || item.platform}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description || item.category || item.url}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getFormFields(table: string): string[] {
  switch (table) {
    case 'education':
      return ['year', 'title', 'description'];
    case 'skills':
      return ['category', 'name'];
    case 'experience':
      return ['title', 'description', 'icon'];
    case 'projects':
      return ['title', 'description', 'icon', 'link'];
    case 'social_links':
      return ['platform', 'url'];
    default:
      return [];
  }
}