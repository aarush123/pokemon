import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

const SearchBar = () => {
    const [searchInput, setsearchInput] = useState("");
    return (
        <Box sx={{
            display: "flex",
            justifyContent:"center"
        }}>
            <div className="landingPage">
                <Box
                    sx={{
                        width: 500,
                        maxWidth: '100%',
                        display: "flex",
                        justifyContent:"center"
                    }}
                    >
                    <TextField
                    value={searchInput}
                        onChange={(e)=>setsearchInput(e.target.value)}
                    fullWidth label="Search Pokemon" />
                    </Box>
            </div>
        </Box>
        
    )
}

export default SearchBar;