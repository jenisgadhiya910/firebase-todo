import React, { useEffect, useMemo, useState } from "react";
import "./Todos.scss";
import { db } from "../../firebase";
import { useUserAuth } from "../../Context/UserAuthContext";
import { Button, Form, Input, List, Modal, Popconfirm } from "antd";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  CheckCircleFilled,
  ClockCircleFilled,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

const Todos = () => {
  const { user } = useUserAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setshowCreateModal] = useState(false);
  const [todoData, setTodoData] = useState({
    title: "",
    description: "",
    id: null,
  });
  const todosRef = collection(db, "todos");
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const unsubscribe = onSnapshot(todosRef, (doc) => {
      const allTodos = doc?.docs?.map((item) => ({
        id: item?.id,
        ...item.data(),
      }));
      if (isAdmin) {
        setTodos(allTodos);
      } else {
        setTodos(allTodos?.filter((item) => item?.owner === user?.id));
      }
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    setLoading(true);
    let todosQuery;
    if (isAdmin) {
      todosQuery = query(todosRef);
    } else {
      todosQuery = query(todosRef, where("owner", "==", user?.id));
    }
    const todoDocs = await getDocs(todosQuery);
    let todos = [];
    todoDocs.forEach((doc) => {
      todos.push({ ...doc.data(), id: doc.id });
    });
    setTodos(todos);
    setLoading(false);
  };

  const handleCreateTodo = async (values) => {
    setLoading(true);
    if (todoData?.id) {
      const todoDocument = doc(db, "todos", todoData?.id);
      await updateDoc(todoDocument, {
        title: values?.title,
        description: values?.description,
      });
    } else {
      await addDoc(todosRef, {
        ...values,
        owner: user?.id,
        is_completed: false,
      });
    }
    setLoading(false);
    setshowCreateModal(false);
    setTodoData({ title: "", description: "", id: null });
    fetchTodos();
  };

  const handleDeleteTodo = async (id) => {
    setLoading(true);
    const todoDocument = doc(db, "todos", id);
    await deleteDoc(todoDocument);
    setLoading(false);
    fetchTodos();
  };

  const handleMarkAsDoneTodo = async (id) => {
    setLoading(true);
    const todoDocument = doc(db, "todos", id);
    await updateDoc(todoDocument, {
      is_completed: true,
    });
    setLoading(false);
    fetchTodos();
  };

  const handleMarkAsUndoneTodo = async (id) => {
    setLoading(true);
    const todoDocument = doc(db, "todos", id);
    await updateDoc(todoDocument, {
      is_completed: false,
    });
    setLoading(false);
    fetchTodos();
  };

  return (
    <div className="todos-page">
      <div className="todos-header">
        <h2>{isAdmin ? "All Todos" : "My Todos"}</h2>
        <Button
          type="primary"
          onClick={() => {
            setTodoData({ title: "", description: "", id: null });
            setshowCreateModal(true);
          }}
        >
          Add Todo
        </Button>
      </div>
      <List
        className="list-wrap"
        itemLayout="horizontal"
        bordered
        loading={loading}
        dataSource={todos}
        renderItem={(item, index) => (
          <List.Item
            key={index}
            actions={[
              item?.is_completed ? (
                <CheckCircleFilled style={{ color: "green" }} />
              ) : (
                <ClockCircleFilled style={{ color: "orange" }} />
              ),
              ...(!isAdmin
                ? [
                    <EditOutlined
                      onClick={() => {
                        setshowCreateModal(true);
                        setTodoData(item);
                      }}
                    />,
                    <Popconfirm
                      title="Delete the todo"
                      description="Are you sure to delete this todo?"
                      onConfirm={() => {
                        handleDeleteTodo(item?.id);
                      }}
                      icon={<DeleteOutlined style={{ color: "red" }} />}
                      okText="Yes"
                      cancelText="No"
                    >
                      <DeleteOutlined />
                    </Popconfirm>,
                  ]
                : [
                    !item?.is_completed ? (
                      <Button
                        onClick={() => {
                          handleMarkAsDoneTodo(item.id);
                        }}
                        style={{ width: 130 }}
                      >
                        Mark as Done
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          handleMarkAsUndoneTodo(item.id);
                        }}
                        style={{ width: 130 }}
                      >
                        Mark as Undone
                      </Button>
                    ),
                  ]),
            ]}
          >
            <List.Item.Meta
              title={item?.title}
              description={item?.description}
            />
          </List.Item>
        )}
      />
      <TodoModal
        onCancel={() => {
          setTodoData({ title: "", description: "", id: null });
          setshowCreateModal(false);
        }}
        showCreateModal={showCreateModal}
        handleCreateTodo={handleCreateTodo}
        todoData={todoData}
        loading={loading}
      />
    </div>
  );
};

const TodoModal = ({
  onCancel,
  showCreateModal,
  todoData,
  handleCreateTodo,
  loading,
}) => {
  return (
    <Modal
      onCancel={onCancel}
      open={showCreateModal}
      okButtonProps={{
        htmlType: "submit",
        form: "create-todo",
        loading: loading,
      }}
      title={todoData?.id ? "Edit Todo" : "Create Todo"}
      okText={todoData?.id ? "Update" : "Create"}
      destroyOnClose
    >
      <Form
        initialValues={todoData}
        id="create-todo"
        layout="vertical"
        onFinish={handleCreateTodo}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: "Please enter todo title",
            },
          ]}
        >
          <Input placeholder="Todo title" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input placeholder="Todo description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Todos;
