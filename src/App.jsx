
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import EntryForm from './components/EntryForm';


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<EntryForm />} />
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
