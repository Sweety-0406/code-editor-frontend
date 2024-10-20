
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import EntryForm from './components/EntryForm';
import SignUp from './components/Sign-up';
import SignIn from './components/Sign-in';
import HomePage from './components/HomePage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/sign-in" element={<SignIn/>} />
      <Route path="/sign-up" element={<SignUp/>} />
      <Route path="/" element={<HomePage />} />
      <Route path="/code-editor" element={<EntryForm />} />
      <Route path="/white-board" element={<EntryForm />} />
      <Route path="/chat" element={<EntryForm />} />
      <Route path="/group" element={<MainPage />} />
    </>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
