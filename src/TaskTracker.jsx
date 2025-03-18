import { useState } from "react";
import toast from "react-hot-toast";
import "./style.css";

export default function TaskTracker() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const [owner, setOwner] = useState("");
    const [status, setStatus] = useState("Pending");
    const [expenses, setExpenses] = useState([]);
    const [expenseTitle, setExpenseTitle] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [expenseCategory, setExpenseCategory] = useState("");
    const [updateTexts, setUpdateTexts] = useState({});

    const addTask = () => {
        if (task && owner) {
            setTasks([...tasks, { id: Date.now(), task, owner, status, update: "" }]);
            toast.success("Task added successfully!");
            setTask("");
            setOwner("");
            setStatus("Pending");
        }
    };

    const applyUpdate = (id) => {
        if (!updateTexts[id]) return;
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, update: updateTexts[id] } : task
        ));
        toast.success("Task updated successfully!");
        setUpdateTexts((prev) => ({ ...prev, [id]: "" }));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
        toast.success("Task deleted successfully!");
    };

    const addExpense = () => {
        if (expenseTitle && expenseAmount && expenseCategory) {
            setExpenses([...expenses, { id: Date.now(), expenseTitle, expenseAmount: parseFloat(expenseAmount), expenseCategory }]);
            toast.success("Expense added successfully!");
            setExpenseTitle("");
            setExpenseAmount("");
            setExpenseCategory("");
        }
    };

    const deleteExpense = (id) => {
        setExpenses(expenses.filter(exp => exp.id !== id));
        toast.success("Expense deleted successfully!");
    };

    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.expenseAmount, 0);

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
                        <td>{t.task}</td>
                        <td>{t.owner}</td>
                        <td>
                            <select value={t.status} onChange={(e) => setTasks(tasks.map(task => task.id === t.id ? { ...task, status: e.target.value } : task))}>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </td>
                        <td>
                            <p>{t.update || "No update available"}</p>
                            <input
                                placeholder="Provide update..."
                                value={updateTexts[t.id] || ""}
                                onChange={(e) => setUpdateTexts((prev) => ({ ...prev, [t.id]: e.target.value }))}
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
                <input placeholder="Expense Title" value={expenseTitle} onChange={(e) => setExpenseTitle(e.target.value)} />
                <input placeholder="Amount" type="number" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} />
                <input placeholder="Category (Interiors, License, F&B, etc.)" value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)} />
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
                        <td>{exp.expenseCategory}</td>
                        <td>₹{exp.expenseAmount.toFixed(2)}</td>
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
