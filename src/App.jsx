import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import MembersPage from './MembersPage';
import AttendancePage from './AttendancePage';
import ContributionPage from './ContributionPage';
import Login from './Login'

function App() {

  const [page, setPage] = useState("MEMBERS");
  const [search, setSearch] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      setIsAuthenticated(true);
    }

    const fetchMembers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/members");
        setMembers(response.data);
      } catch (error) {
        console.error("Error fetching members!", error);
      }
    };
  
    fetchMembers();
  }, [members]);

  return (
    <>
      {isAuthenticated ?
        (
          <>
            <Navbar page={page} setPage={setPage} search={search} setSearch={setSearch} setIsAuthenticated={setIsAuthenticated} />
            {page === "MEMBERS" ? (<MembersPage members={members} search={search} />) : (<></>)}
            {page === "ATTENDANCE" ? (<AttendancePage search={search} />) : (<></>)}
            {page === "CONTRIBUTIONS" ? (<ContributionPage members={members} search={search} />) : (<></>)}
          </>
        ) : (<Login setIsAuthenticated={setIsAuthenticated} />)
      }
    </>
  );
}

export default App;
