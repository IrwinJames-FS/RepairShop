import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import { Dashboard, SignIn, SignUp } from './pages';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Theme } from './components/Theme';
import { Authentication } from './contexts/Authentication';

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard/>
  },
  {
    path: '/sign-in',
    element: <SignIn/>
  },
  {
    path: '/sign-up',
    element: <SignUp/>
  }
])
root.render(
  <React.StrictMode>
    <Theme>
      <Authentication>
        <RouterProvider router={router}/>
      </Authentication>
    </Theme>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
