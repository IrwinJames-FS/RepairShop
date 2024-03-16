import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import { Authenticated, Dashboard, SignIn } from './pages';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Theme } from './components/Theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  {
    path: '/',
    element: <Authenticated/>,
    children: [
      {
        index: true,
        element: <Dashboard/>
      }
    ]
  },
  {
    path: '/sign-in',
    element: <SignIn/>
  }
])
root.render(
  <React.StrictMode>
    <Theme>
      <RouterProvider router={router}/>
    </Theme>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
