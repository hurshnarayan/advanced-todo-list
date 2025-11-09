import { useRef } from "react";

export function TodoItem({ id, name, completed, dispatch, ACTIONS, editId }) {
  const inputRef = useRef();
  return (
    <li className="list-item">
      <label className="list-item-label">
        <input
          checked={completed}
          type="checkbox"
          data-list-item-checkbox
          onChange={(e) =>
            dispatch({
              type: ACTIONS.TOGGLE_TODO,
              payload: { todoId: id, completed: e.target.checked },
            })
          }
        />
        <span data-list-item-text>
          {id === editId ? (
            <input
              type="text"
              defaultValue={name}
              onBlur={() =>
                dispatch({
                  type: ACTIONS.EDIT_TODO,
                  payload: { id, newTodoName: inputRef.current.value },
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  dispatch({
                    type: ACTIONS.EDIT_TODO,
                    payload: { id, newTodoName: inputRef.current.value },
                  });
                else if (e.key === "Escape")
                  dispatch({
                    type: ACTIONS.EDIT_TODO,
                    payload: { todoId: "" },
                  });
              }}
              ref={inputRef}
              autoFocus
            />
          ) : (
            name
          )}
        </span>
      </label>
      {id !== editId ? (
        <button
          onClick={() =>
            dispatch({ type: ACTIONS.EDIT_TODO, payload: { todoId: id } })
          }
          data-button-edit
        >
          Edit
        </button>
      ) : (
        <>
          <button
            onClick={() =>
              dispatch({
                type: ACTIONS.EDIT_TODO,
                payload: { id, newTodoName: inputRef.current.value },
              })
            }
            data-button-edit
          >
            Save
          </button>
          <button
            onClick={() =>
              dispatch({
                type: ACTIONS.EDIT_TODO,
                payload: { todoId: "" },
              })
            }
            data-button-edit
          >
            Cancel
          </button>
        </>
      )}
      {id !== editId && (
        <button
          onClick={() =>
            dispatch({ type: ACTIONS.DELETE_TODO, payload: { todoId: id } })
          }
          data-button-delete
        >
          Delete
        </button>
      )}
    </li>
  );
}
