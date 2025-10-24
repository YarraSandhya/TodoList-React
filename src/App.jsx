import { useState, useEffect } from "react";

function App() {
  // State Management
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("vite-todos");
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error("Error loading todos:", error);
      }
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("vite-todos", JSON.stringify(todos));
  }, [todos]);

  // Add new todo
  const addTodo = () => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput === "") return;

    const newTodo = {
      id: Date.now(),
      text: trimmedInput,
      completed: false,
      priority: priority,
      createdAt: new Date().toLocaleString(),
    };

    setTodos([...todos, newTodo]);
    setInputValue("");
    setPriority("medium");
  };

  // Delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Toggle completion
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Start editing
  const startEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  // Save edit
  const saveEdit = (id) => {
    const trimmedText = editingText.trim();
    if (trimmedText === "") return;

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: trimmedText } : todo
      )
    );
    setEditingId(null);
    setEditingText("");
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  // Clear completed
  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  // Clear all
  const clearAll = () => {
    if (window.confirm("Delete all tasks?")) {
      setTodos([]);
    }
  };

  // Get filtered todos
  const getFilteredTodos = () => {
    let filtered = [...todos];

    // Apply filter
    if (filter === "active") {
      filtered = filtered.filter((todo) => !todo.completed);
    } else if (filter === "completed") {
      filtered = filtered.filter((todo) => todo.completed);
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter((todo) =>
        todo.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  // Calculate statistics
  const totalTasks = todos.length;
  const activeTasks = todos.filter((t) => !t.completed).length;
  const completedTasks = todos.filter((t) => t.completed).length;
  const filteredTodos = getFilteredTodos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-2 drop-shadow-lg">
            Todo App
          </h1>
        </header>

        {/* Main Container */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-4 text-white text-center transform transition hover:scale-105">
              <div className="text-3xl sm:text-4xl font-bold">{totalTasks}</div>
              <div className="text-xs sm:text-sm opacity-90 mt-1">Total</div>
            </div>
            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-4 text-white text-center transform transition hover:scale-105">
              <div className="text-3xl sm:text-4xl font-bold">
                {activeTasks}
              </div>
              <div className="text-xs sm:text-sm opacity-90 mt-1">Active</div>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-4 text-white text-center transform transition hover:scale-105">
              <div className="text-3xl sm:text-4xl font-bold">
                {completedTasks}
              </div>
              <div className="text-xs sm:text-sm opacity-90 mt-1">Done</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1.5 rounded-xl">
            {["all", "active", "completed"].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                  filter === filterType
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>

          {/* Add Todo Form */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
                placeholder="What needs to be done?"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
              />
              <div className="flex gap-3">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  onClick={addTodo}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search tasks..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />
          </div>

          {/* Todo List */}
          <div className="space-y-3 max-h-96 overflow-y-auto mb-6 pr-2">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-400 text-lg">No tasks to display</p>
                <p className="text-gray-400 text-sm mt-2">
                  Add a task to get started!
                </p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border-l-4 ${
                    todo.priority === "high"
                      ? "border-red-500"
                      : todo.priority === "medium"
                      ? "border-yellow-500"
                      : "border-green-500"
                  } ${todo.completed ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="mt-1 w-5 h-5 rounded cursor-pointer accent-indigo-600"
                    />

                    <div className="flex-1 min-w-0">
                      {editingId === todo.id ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && saveEdit(todo.id)
                            }
                            className="flex-1 px-3 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(todo.id)}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 font-semibold"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-4 py-2 bg-gray-400 text-white rounded-lg text-sm hover:bg-gray-500 font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p
                            className={`text-base sm:text-lg break-words ${
                              todo.completed
                                ? "line-through text-gray-400"
                                : "text-gray-800"
                            }`}
                          >
                            {todo.text}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded-full ${
                                todo.priority === "high"
                                  ? "bg-red-100 text-red-700"
                                  : todo.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {todo.priority.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-400 py-1">
                              {todo.createdAt}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {editingId !== todo.id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(todo.id, todo.text)}
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition transform hover:scale-110"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition transform hover:scale-110"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action Buttons */}
          {todos.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={clearCompleted}
                disabled={completedTasks === 0}
                className="px-6 py-3 border-2 border-indigo-500 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear Completed ({completedTasks})
              </button>
              <button
                onClick={clearAll}
                className="px-6 py-3 border-2 border-red-500 text-red-600 rounded-xl font-semibold hover:bg-red-500 hover:text-white transition"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
      </div>
    </div>
  );
}

export default App;
