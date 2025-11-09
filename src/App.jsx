import { useMemo, useReducer } from "react";
import "./styles.css";
import { TodoItem } from "./TodoItem";

const ACTIONS = {
  NEW_TODO: "NEW_TODO",
  DELETE_TODO: "DELETE_TODO",
  TOGGLE_TODO: "TOGGLE_TODO",
  NEW_TODO_NAME: "NEW_TODO_NAME",
  FILTER_NAME: "FILTER_NAME",
  EDIT_TODO: "EDIT_TODO",
  HIDE_TODO: "HIDE_TODO",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.NEW_TODO_NAME:
      return { ...state, todoName: payload };
    case ACTIONS.NEW_TODO:
      if (state.todoName === "") return state;
      return {
        ...state,
        todoName: "",
        todos: [
          ...state.todos,
          { name: state.todoName, completed: false, id: crypto.randomUUID() },
        ],
      };
    case ACTIONS.TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id === payload.todoId)
            return { ...todo, completed: payload.completed };
          return todo;
        }),
      };
    case ACTIONS.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== payload.todoId),
      };
    case ACTIONS.FILTER_NAME:
      return {
        ...state,
        filterName: payload.filterName,
      };
    case ACTIONS.HIDE_TODO:
      return { ...state, isHidden: payload.checked };
    case ACTIONS.EDIT_TODO:
      if (payload.newTodoName)
        return {
          ...state,
          todos: state.todos.map((todo) =>
            todo.id === payload.id
              ? { ...todo, name: payload.newTodoName }
              : todo
          ),
          editId: "",
        };
      return {
        ...state,
        editId: payload.todoId,
      };

    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, {
    todos: [],
    todoName: "",
    filterName: "",
    isHidden: false,
    editId: "",
  });

  const { todos, todoName, filterName, isHidden, editId } = state;

  const visibleTodos = useMemo(
    () => todos.filter((todo) => !todo.completed),
    [todos]
  );

  //   const baseTodos = isHidden ? visibleTodos : todos;

  //   const filteredTodos = (isHidden ? visibleTodos : todos).filter((todo) =>
  //     todo.name.toLowerCase().startsWith(filterName.toLowerCase())
  //   );

  const baseTodos = isHidden ? visibleTodos : todos;

  // filter the chosen base by name (startsWith('') returns true for all)
  const filteredTodos = baseTodos.filter((todo) =>
    todo.name.toLowerCase().startsWith(filterName.toLowerCase())
  );

  // if user typed something, show the filtered list, otherwise show the base
  const displayTodo = filterName ? filteredTodos : baseTodos;

  //   if (isHidden) {
  //     displayTodo = visibleTodos;
  //   } else if (filterName)
  //     displayTodo = filteredTodos;
  //   } else {
  //     displayTodo = todos;
  //   }

  return (
    <>
      <div className="filter-form">
        <div className="filter-form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={filterName}
            onChange={(e) =>
              dispatch({
                type: ACTIONS.FILTER_NAME,
                payload: { filterName: e.target.value },
              })
            }
          />
        </div>
        <label>
          <input
            type="checkbox"
            checked={isHidden}
            onChange={(e) =>
              dispatch({
                type: ACTIONS.HIDE_TODO,
                payload: { checked: e.target.checked },
              })
            }
          />
          Hide Completed
        </label>
      </div>
      <ul id="list">
        {displayTodo.map((todo) => {
          return (
            <TodoItem
              key={todo.id}
              {...todo}
              dispatch={dispatch}
              ACTIONS={ACTIONS}
              editId={editId}
            />
          );
        })}
      </ul>

      <div id="new-todo-form">
        <label htmlFor="todo-input">New Todo</label>
        <input
          type="text"
          id="todo-input"
          value={todoName}
          onChange={(e) =>
            dispatch({ type: ACTIONS.NEW_TODO_NAME, payload: e.target.value })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") dispatch({ type: ACTIONS.NEW_TODO });
          }}
        />
        <button
          onClick={() => dispatch({ type: ACTIONS.NEW_TODO })}
          disabled={todoName === ""}
        >
          Add Todo
        </button>
      </div>
    </>
  );
}

export default App;
