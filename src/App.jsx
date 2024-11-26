import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import MembersPage from './MembersPage';
import AttendancePage from './AttendancePage';
import PaymentPage from './PaymentPage';
import Login from './Login'

function App() {

  const [page, setPage] = useState("MEMBERS");
  const [search, setSearch] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      setIsAuthenticated(true); 
    }
  }, []);

  return (
    <>
      {isAuthenticated ?
        (
          <>
            <Navbar page={page} setPage={setPage} search={search} setSearch={setSearch} setIsAuthenticated={setIsAuthenticated} />
            {page === "MEMBERS" ? (<MembersPage setPage={setPage} search={search} />) : (<></>)}
            {page === "ATTENDANCE" ? (<AttendancePage search={search} />) : (<></>)}
            {page === "PAYMENTS" ? (<PaymentPage search={search} />) : (<></>)}
          </>
        ) : (<Login setIsAuthenticated={setIsAuthenticated}/>)
      }
    </>
  );
}

export default App;
