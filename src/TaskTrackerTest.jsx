import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./style.css";

export default function TaskTrackerTest() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const [owner, setOwner] = useState("");
    const [status, setStatus] = useState("PENDING");
    const [expenses, setExpenses] = useState([]);
    const [expenseTitle, setExpenseTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [updateTexts, setUpdateTexts] = useState({});

    const fetchTasks = async () => {
        try {
            const response = await axios.get("http://localhost:8081/api/v1/tasks");
            setTasks(response.data);
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error("Failed to fetch tasks.");
        }
    };

    const fetchExpenses = async () => {
        try {
            const response = await axios.get("http://localhost:8081/api/v1/expenses");
            console.log(response.data)
            setExpenses(response.data);
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error("Failed to fetch expenses.");
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchExpenses();
    }, []);

    const addTask = async () => {
        if (task && owner) {
            try {
                const response = await axios.post("http://localhost:8081/api/v1/tasks", { taskName: task, owner, status });
                setTasks([...tasks, response.data]);
                toast.success("Task added successfully!");
                setTask("");
                setOwner("");
                setStatus("PENDING");
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                toast.error("Failed to add task.");
            }
        }
    };

    const applyUpdate = async (id) => {
        if (!updateTexts[id]) return; // Skip if no update text is entered
        try {
            // Find the task by id and update the comments field with the entered update text
            const updatedTask = {
                ...tasks.find(task => task.id === id),
                comments: updateTexts[id] // Persist the update to the comments field
            };

            // Send the updated task to the backend
            await axios.put(`http://localhost:8081/api/v1/tasks/${id}`, updatedTask);

            // Update the task list in the state to reflect the change in comments
            setTasks(tasks.map(task => task.id === id ? { ...task, comments: updateTexts[id] } : task));

            toast.success("Task updated successfully!");

            // Clear the input field for the update text
            setUpdateTexts((prev) => ({ ...prev, [id]: "" }));
        } catch (error) {
            toast.error("Failed to update task.");
        }
    };


    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/api/v1/tasks/${id}`);
            setTasks(tasks.filter(task => task.id !== id));
            toast.success("Task deleted successfully!");
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error("Failed to delete task.");
        }
    };

    const addExpense = async () => {
        if (expenseTitle && amount && category) {
            try {
                const response = await axios.post("http://localhost:8081/api/v1/expenses", {
                    expenseTitle,
                    amount: parseFloat(amount),
                    category
                });
                setExpenses([...expenses, response.data]);
                console.log(response.data)
                toast.success("Expense added successfully!");
                setExpenseTitle("");
                setAmount("");
                setCategory("");
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                toast.error("Failed to add expense.");
            }
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/api/v1/expenses/${id}`);
            setExpenses(expenses.filter(exp => exp.id !== id));
            toast.success("Expense deleted successfully!");
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error("Failed to delete expense.");
        }
    };

    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);

    return (
        <div className="container">
            <h1>Microbrewery Task & Expense Tracker</h1>

            <div className="card">
                <input placeholder="Enter Task" value={task} onChange={(e) => setTask(e.target.value)} />
                <input placeholder="Owner (Bhavya, Teja, Bhanu)" value={owner} onChange={(e) => setOwner(e.target.value)} />
                <button onClick={addTask}>Add Task</button>
            </div>

            <table>
                <thead>
                <tr>
                    <th>S.No</th>
                    <th>Task</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Update</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {tasks.map((t, index) => (
                    <tr key={t.id}>
                        <td>{index + 1}</td>
                        <td>{t.taskName}</td>
                        <td>{t.owner}</td>
                        <td>
                            <select
                                value={t.status}
                                onChange={(e) => {
                                    const updatedStatus = e.target.value;
                                    setTasks(tasks.map(task => task.id === t.id ? {
                                        ...task,
                                        status: updatedStatus
                                    } : task));
                                    axios.put(`http://localhost:8081/api/v1/tasks/${t.id}`, {
                                        ...t,
                                        status: updatedStatus
                                    });
                                }}
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="PROGRESS">IN PROGRESS</option>
                                <option value="COMPLETED">COMPLETED</option>
                            </select>
                        </td>
                        <td>
                            <p>{t.comments || "No update available"}</p> {/* Display comments if available */}
                            <input
                                placeholder="Provide update..."
                                value={updateTexts[t.id] || ""}
                                onChange={(e) => setUpdateTexts((prev) => ({...prev, [t.id]: e.target.value}))}
                            />
                            <button onClick={() => applyUpdate(t.id)} className="update-btn">Update</button>
                        </td>

                        <td>
                            <button onClick={() => deleteTask(t.id)} className="delete-btn">Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h2>Expense Tracker</h2>
            <div className="card">
                <input placeholder="Expense Title" value={expenseTitle}
                       onChange={(e) => setExpenseTitle(e.target.value)}/>
                <input placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <input placeholder="Category (Interiors, License, F&B, etc.)" value={category} onChange={(e) => setCategory(e.target.value)} />
                <button onClick={addExpense}>Add Expense</button>
            </div>

            <table>
                <thead>
                <tr>
                    <th>S.No</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {expenses.map((exp, index) => (
                    <tr key={exp.id}>
                        <td>{index + 1}</td>
                        <td>{exp.expenseTitle}</td>
                        <td>{exp.category}</td>
                        <td>₹{exp.amount.toFixed(2)}</td>
                        <td>
                            <button onClick={() => deleteExpense(exp.id)} className="delete-btn">Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h3>Total Expenses: ₹{totalExpenses.toFixed(2)}</h3>
        </div>
    );
}
