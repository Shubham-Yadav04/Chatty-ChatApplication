import React, { useEffect } from 'react'
import Profiles from './Profiles'
import { useState } from 'react'
import axios from 'axios'
import {motion} from 'motion/react'
import { useSelector } from 'react-redux'



export default function AddFriends() {
    const [suggestions, setSuggestions] = useState([]);
    const [search, setSearch] = useState('');
    const [timer, setTimer] = useState(null);

const user= useSelector(state=>state.user.user)
    const getSearchResult = async (query) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/user/search/email/${query}`,
                { withCredentials: true }
            );
            setSuggestions(response.data);
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    useEffect(() => {
        if (!search.trim()) {
            setSuggestions([]);  
            return;
        }

        // Clear previous timer
        if (timer) clearTimeout(timer);

        const newTimer = setTimeout(() => {
            getSearchResult(search);
        }, 500);

        setTimer(newTimer);

        return () => clearTimeout(newTimer);
    }, [search]);

    return (
        <motion.div
            className="w-full h-screen flex flex-col pt-4 text-black overflow-auto gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
        >
            <h1 className="text-3xl px-2 md:text-[1.25rem] font-bold text-black">Add Friends</h1>

            {/* Search Input */}
            <div className="px-2 w-full">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full bg-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
            </div>

            {/* Results */}
            {suggestions.length > 0 ? (
                suggestions.map((s, index) => (
                    s.email!==user.email ? <Profiles
                        key={index}
                        username={s.username}
                        userId={s.userId}
                        profilePic={s.profilePic}
                        msg={s.email}
                    />
                    :
                     <div className="text-semibold px-3 text-sm">
                        No users found
                    </div>
                ))
            ) : (
                search && (
                    <div className="text-semibold px-3 text-sm">
                        No users found
                    </div>
                )
            )}
        </motion.div>
    );
}

