import { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './components/Login/Login';
import Menubar from './components/Menubar/Menubar';
import Register from './components/Register/Register';
import { StoreContext } from './context/StoreContext';
import Cart from './pages/Cart/Cart';
import Contact from './pages/Contact/Contact';
import ExploreFood from './pages/ExploreFood/ExploreFood';
import FoodDetails from './pages/FoodDetails/FoodDetails';
import Home from './pages/Home/Home';
import MyOrders from './pages/MyOrders/MyOrders';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import FoodAi from './pages/FoodAi';



const App = () => {
  const {token}= useContext(StoreContext);
  return (
    <div>
      <Menubar />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/explore' element={<ExploreFood />} />
        <Route path='/food/:id' element={<FoodDetails />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/order' element={token ? <PlaceOrder /> : <Login />} />
        <Route path='/login' element={token ? <Home /> : <Login />} />
        <Route path='/register' element={token ? <Home /> : <Register /> } />
        <Route path='/myorders' element={token ? <MyOrders /> : <Login /> } />
        <Route path="/food-ai" element={<FoodAi />} />
      </Routes>
    </div>
  )
}

export default App;
