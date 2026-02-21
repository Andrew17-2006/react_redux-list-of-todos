/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { getTodos } from './api';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './app/store';

import { setTodos } from './features/todos';
import { setCurrentTodo } from './features/currentTodo';
import { setStatus, setQuery, clearQuery } from './features/filter';

export const App: React.FC = () => {
  const dispatch = useDispatch();

  const todos = useSelector((state: RootState) => state.todos);
  const selectedTodo = useSelector((state: RootState) => state.currentTodo);
  const { status, query } = useSelector((state: RootState) => state.filter);

  //локальні стейти
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoader(true);

    getTodos()
      .then(data => dispatch(setTodos(data)))
      .catch(() => setError(true))
      .finally(() => setLoader(false));
  }, [dispatch]);

  const filteredTodos = todos
    .filter(todo => {
      if (status === 'completed') {
        return todo.completed;
      }

      if (status === 'active') {
        return !todo.completed;
      }

      return true;
    })
    .filter(todo => todo.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                status={status}
                query={query}
                onStatusChange={value => dispatch(setStatus(value))}
                onQueryChange={value => dispatch(setQuery(value))}
                onClearQuery={() => dispatch(clearQuery())}
              />
            </div>

            <div className="block">
              {loader && <Loader />}
              {error && <p className="has-text-danger">Failed to load todos</p>}

              <TodoList
                todos={filteredTodos}
                selectedTodo={selectedTodo}
                onSelect={todo => dispatch(setCurrentTodo(todo))}
              />
            </div>
          </div>
        </div>
      </div>

      {selectedTodo && (
        <TodoModal
          todo={selectedTodo}
          onClose={() => dispatch(setCurrentTodo(null))}
        />
      )}
    </>
  );
};
