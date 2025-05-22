import React, { useState, useEffect } from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { ScrollTop } from 'primereact/scrolltop';
import './App.css';
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import Login from './pages/Login';
import HomeInternal from './pages/internal/Home';


function App() {
  const [getAuth, setAuth] = useState<boolean>();

  useEffect(() => {
    checkAuth()
    setInterval(() => {
      checkAuth()
    }, 2000)

  }, [document.cookie])
    
  async function checkAuth(){
    setAuth(getCookie("isAuth") === 'true' ? true : false)
    return true
  }

  function getCookie(name:any) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';')?.shift();
  }

  return (
    <div className="mx-0 mt-0 mb-3">
      <BrowserRouter>
        <Navbar/>
        <ScrollTop threshold={50}/>
        <div className="md:mx-3 mx-0 mb-4">
          <Routes>
            <Route path="/">
              {/* <Route path="" element={<Navigate to="uberhub" replace />} /> */}
              {/* <Route path="" element={<Home/>} /> */}
              <Route path="" element={<Navigate to="/login" replace />} />
              <Route path="ControlAccess" element={<Navigate to="/login" replace />}/>
              <Route path="index.html" element={<Navigate to="/" replace />}>
              </Route>
              {/* <Route path="uberhub" element={<UHCC/>}/> */}
              <Route path="404" element={<NotFound/>}/>
              <Route path="login" element={<Login/>}/>
              {/* <Route path="signup" element={<SignUp/>}/> */}
              <Route path="signup" element={<NotFound/>}/>
              <Route path="internal">
                {getAuth
                  ?
                    <>
                      <Route path="" element={<HomeInternal/>}/>
                    </>
                  : 
                    <>
                      <Route path="" element={document.cookie.indexOf("isAuth=true") === -1 && <Navigate to="/404" replace />}/>
                      {/* <Route path="*" element={<Navigate to="/grb/404" replace />}/> */}
                    </>
                }
              </Route>
            </Route>
            {/* <Route path="*" element={<Navigate to="/grb/404" replace />} /> */}
            {/* <Route path="/" element={<Navigate to="/grb/" replace />} /> */}
          </Routes>
        </div>
        <Footer/>
        {/* <FooterMessage/> */}
      </BrowserRouter>
    </div>

  );
}

export default App;
