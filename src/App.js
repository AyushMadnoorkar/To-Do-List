import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  MenuItem,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";

const TodoApp = () => {
  const [task, settask] = useState(() => {
    const savedtask = localStorage.getItem("task");
    return savedtask ? JSON.parse(savedtask) : [];
  });
  const [currentTodo, setCurrentTodo] = useState({
    assignedTo: "",
    status: "",
    priority: "",
    description: "",
    dueDate: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    localStorage.setItem("task", JSON.stringify(task));
  }, [task]);

  const handleAddOrUpdate = () => {
    if (isEditing) {
      settask((prevtask) =>
        prevtask.map((todo) =>
          todo.id === editingId ? { ...todo, ...currentTodo } : todo
        )
      );
      setIsEditing(false);
      setEditingId(null);
    } else {
      const newTask = {
        id: task?.length+1,
        ...currentTodo,
      };
      settask([...task, newTask]);
    }
    // localStorage.setItem("task", JSON.stringify(task));
    setCurrentTodo({ assignedTo: "", status: "", priority: "", description: "", dueDate: "" });
    setOpenTaskDialog(false);
  };

  const handleEdit = (id) => {
    const todoToEdit = task.find((todo) => todo.id === id);
    setCurrentTodo({ ...todoToEdit });
    setIsEditing(true);
    setEditingId(id);
    setOpenTaskDialog(true);
  };

  const handleOpenDeleteDialog = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleDelete = () => {
    settask(task.filter((todo) => todo.id !== deleteId));
    setOpenDeleteDialog(false);
    setDeleteId(null);
  };

  const filteredtask = task.filter((todo) =>
    Object.values(todo).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "assignedTo", headerName: "Assigned To", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "priority", headerName: "Priority", width: 150 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "dueDate", headerName: "Due Date", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            startIcon={<Edit />}
            onClick={() => handleEdit(params.row.id)}
          >
            Edit
          </Button>
          <Button
            startIcon={<Delete />}
            color="secondary"
            onClick={() => handleOpenDeleteDialog(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      <h1>Todo List</h1>
      <TextField
        fullWidth
        label="Search"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        variant="outlined"
        style={{ marginBottom: "20px" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenTaskDialog(true)}
        style={{ marginBottom: "20px" }}
      >
        Create Task
      </Button>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredtask}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          getRowId={(row) => row.id}
        />
      </div>

      {/* Task Dialog */}
      <Dialog
        open={openTaskDialog}
        onClose={() => setOpenTaskDialog(false)}
      >
        <DialogTitle>{isEditing ? "Edit Task" : "Create Task"}</DialogTitle>
        <DialogContent>
          <DialogContentText>New Task</DialogContentText>
          <TextField
            select
            fullWidth
            label="Assigned To"
            value={currentTodo.assignedTo}
            onChange={(e) => setCurrentTodo({ ...currentTodo, assignedTo: e.target.value })}
            variant="outlined"
            sx={{ marginY: "20px" }}
            required
          >
            {Array.from({ length: 10 }, (_, i) => (
              <MenuItem key={i} value={`User ${i + 1}`}>{`User ${i + 1}`}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Status"
            value={currentTodo.status}
            onChange={(e) => setCurrentTodo({ ...currentTodo, status: e.target.value })}
            variant="outlined"
            style={{ marginBottom: "20px" }}
            required
          >
            <MenuItem value="Not Started">Not Started</MenuItem>
            <MenuItem value="In Process">In Process</MenuItem>
            <MenuItem value="Complete">Complete</MenuItem>
          </TextField>
          <TextField
            select
            fullWidth
            label="Priority"
            value={currentTodo.priority}
            onChange={(e) => setCurrentTodo({ ...currentTodo, priority: e.target.value })}
            variant="outlined"
            style={{ marginBottom: "20px" }}
            required
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Description"
            value={currentTodo.description}
            onChange={(e) => setCurrentTodo({ ...currentTodo, description: e.target.value })}
            variant="outlined"
            style={{ marginBottom: "20px" }}
          />
          <TextField
            fullWidth
            label="Due Date"
            type="date"
            value={currentTodo.dueDate}
            onChange={(e) => setCurrentTodo({ ...currentTodo, dueDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            style={{ marginBottom: "20px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTaskDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAddOrUpdate}
            color="primary"
            disabled={
              !currentTodo.assignedTo ||
              !currentTodo.status ||
              !currentTodo.priority
            }
          >
            {isEditing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TodoApp;
