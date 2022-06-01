import React from "react";
import { useState,useEffect } from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Grid } from "@mui/material";
import Modal from '@mui/material/Modal';
import logo from "../Images/logo.png"
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const LandingPage = () => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4
    
      };
    const [searchInput, setsearchInput] = useState("");
    const [initialData,setInitialData]= useState([]);
    const [finalInitialData, setfinalInitialData] = useState([]);
    const [showData, setShowData] = useState(false);
    const [pageCount,  setPageCount] = useState(1);
    const [showDefault, setShowDefault] = useState(false);
    const [stats, setStats] = useState([]);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const increasePageCount = () =>setPageCount(pageCount+20);
    const decreasePageCount= ()  =>setPageCount(pageCount-20);

    useEffect(()=>{
        const getSearchData = async () => {
            const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchInput}`);
            const response = await data.json();
            setInitialData([response]);
        }
        if(searchInput!== "") getSearchData()
    }, [searchInput]);

    const searchPokemon = (e) => {
        e.preventDefault();
        let value = e.target[0].value;
        setsearchInput(value);
        value.length === 0 && setShowDefault(true);
        
    }


    useEffect(()=>{
        setInitialData([]);
        let pokeArr = [];
        const showInitialData = () => {
            for (let i = pageCount; i <= pageCount+19; i++) {
                const fetchData = async () => {
                    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
                    const resJson = await data.json();
                    pokeArr.push(resJson);
                    setInitialData(initialData => [...initialData, resJson])
                }
                fetchData()
                .catch(console.error);
            }
        }
        showInitialData();
    }, [pageCount,showDefault]); 
    useEffect(()=>{
        if(initialData === undefined) {
            return null;
        }else {
            const uniqueArray = [
                ...initialData
                  .reduce(
                    (map, obj) => map.set(obj.id, obj),
                    new Map()
                  )
                  .values(),
              ];
              setfinalInitialData(uniqueArray);
            setShowData(true);
        }
    }, [initialData]);

    const showDetailsofPoke = (pokeID) => {
        handleOpen();
        const requiredPoke = finalInitialData.filter((value)=>{
            if(value.id === pokeID) return value.stats
        })
        console.log(requiredPoke)
        setStats([requiredPoke[0].stats, requiredPoke[0].name, requiredPoke[0].id]);
    }
  useEffect(()=>console.log(stats), [open])
    return (
        <>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
            {stats.length !== 0 ? (
                <>
                <img width={"200px"}src={`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${stats[2]}.svg`} />
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                    Stats : {<span style={{fontWeight:"bold"}}>{stats[1].charAt(0).toUpperCase() + stats[1].slice(1)}</span>}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <ul>
                    {stats[0].map((value)=>{
                            return  (
                                <li>{value.stat.name}</li>
                            )
                        })}
                    </ul>
                    </Typography>
                </>
            ) : null}
         
        </Box>
      </Modal>
      <Box 
      sx={{
        display: "flex",
        justifyContent:"center"
      }}
      >
          <img 
          width={"200px"}
          src={logo} />
        </Box>
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
                        <form 
                        style={{display:"flex"}}
                        onSubmit={(e)=>searchPokemon(e)}>
                        <TextField
                        style={{minWidth:"500px"}}
                        fullWidth label="Search Pokemon" />
                        <Button 
                        style={{marginLeft:"7px", minWidth:"140px"}}
                         variant="contained">Search</Button>
                        </form>
                    </Box>
            </div>
                </Box>
        
            {showData?
            <>
            <Box
            m={6} pt={3}
            >
             <Grid 
             container spacing={10}>
                 {finalInitialData.map((value)=>{
                     return(
                        <Grid
                        item xs={4}>
                            <Card
                            sx={{ maxWidth: 350 }}>
                                <img 
                                  style={{cursor: "Pointer"}}
                                  onClick={()=>showDetailsofPoke(value.id)}
                                width="150px"
                                height="150px"
                                src={`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${value.id}.svg`}/>
                                <CardContent>
                                    <Typography 
                                      style={{cursor: "Pointer"}}
                                      onClick={()=>showDetailsofPoke(value.id)}
                                    gutterBottom variant="h5" component="div">
                                        {value.name.charAt(0).toUpperCase() + value.name.slice(1)}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Type"
                                    >
                                        {value.types.map((typeValue)=>{
                                            return (
                                                <MenuItem>{typeValue.type.name}</MenuItem>
                                            )
                                        })}
                                        </Select>
                                    </FormControl>
                                </CardActions>
                                </Card>
                        </Grid>
                     )
                 })}
             </Grid>
             </Box>
             <Box 
                sx={{
                    display: "flex",
                    justifyContent:"space-between"
                }}>
                    {pageCount > 2 ? 
                    <Button 
                    style={{marginBottom:"10px",marginLeft:"10px"}}
                    size="large"
                    variant="outlined"
                    onClick={decreasePageCount}
                >
                    Previous
                </Button>
                :
                <div></div>
                }
                <Button 
                    style={{marginBottom:"10px",marginRight:"10px"}}
                    size="large"
                    variant="outlined"
                    onClick={increasePageCount}
                >
                    Next
                </Button>
            </Box>
              </>
             :
             null
             }
       
     </>
    )
}

export default LandingPage;