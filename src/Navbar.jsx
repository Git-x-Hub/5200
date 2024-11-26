import React, { useState } from 'react';

const Navbar = ({ page, setPage, search, setSearch, setIsAuthenticated }) => {

    const [open, setIsOpen] = useState(false);

    const handleLogout = () => {
        // Clear the token from localStorage
        localStorage.removeItem("authToken");
        setIsAuthenticated(false); // Reset authentication state
    };

    return (
        <nav className="navbar">
            <div className="mx-auto flex justify-between items-center">

                <div className="lg:hidden">
                    <button
                        onClick={() => setIsOpen(!open)}
                        className="button-black"
                    >
                        <svg
                            className="w-3 h-3"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                            />
                        </svg>
                    </button>
                </div>
                <div className="title">
                    {page}
                </div>
                <div className={`menu grow ${open ? 'block' : 'hidden'}`}>
                    <div className='menu-item' onClick={() => { setPage("MEMBERS"); setSearch(""); }}>Members</div>
                    <div className='font-bold hidden lg:block'>|</div>
                    <div className='menu-item' onClick={() => { setPage("ATTENDANCE"); setSearch(""); }}>Attendance</div>
                    <div className='font-bold hidden lg:block'>|</div>
                    <div className='menu-item' onClick={() => { setPage("PAYMENTS"); setSearch(""); }}>Payment</div>
                    <div className="hidden lg:block mx-8">
                        <input
                            type="search"
                            name="search"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <div className='logout' onClick={handleLogout}>Logout</div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;