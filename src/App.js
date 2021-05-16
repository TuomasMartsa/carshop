import react,  { useState, useEffect } from 'react';

import { AgGridReact } from 'ag-grid-react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import AddCar from './components/AddCar';
import EditCar from './components/EditCar';

import './App.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css'



function App() {
  const [cars, setCars] = useState([]);
  const [open, setOpen] = useState(false);
  const [msg, setMSg] = useState('');

  const openSnackbar = () => {
    setOpen(true);
  }

  const closeSnackbar = () => {
    setOpen(false);
  }

  useEffect(() => {
    fetchCars();
  }, []); 

  const fetchCars = () => {
    fetch('http://carrestapi.herokuapp.com/cars')
    .then(response => response.json())
    .then(data => setCars(data._embedded.cars))
    .catch(err => console.error(err))
    //console.log(cars)
  };

  const deleteCar = (url) => {
    if(window.confirm('Do you want to delete car?')){
      fetch(url, { method: 'DELETE'})
      .then(response => {
        if (response.ok){
          setMSg('Car deleted');
          fetchCars();
          openSnackbar();
        }
        else
          alert('Oops..!');
      })
      .catch(err => console.error(err))
    }
  };

  const addCar = (newCar) => {
    console.log(newCar);
    fetch('http://carrestapi.herokuapp.com/cars', {
      method: 'POST',
      body: JSON.stringify(newCar),
      headers: { 'Content-type': 'application/json' }
    })
    .then(response => {
      if (response.ok)
        fetchCars();
      else  
        alert('Oh-no!')
    })
    .catch(err => console.error(err))
  }  

  const editCar = (url, updatedCar) => {
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify(updatedCar),
      headers: { 'Content-type' : 'application/json' }
    })
    .then(response =>  {
      if (response.ok){
        setMSg('Edits saved');
        openSnackbar();
        fetchCars();
      }
      else
        alert('Not ok');
    })
    .catch(err => console.error.apply(err))
  }

  const columns = [
    { field: 'brand', width: 160  },
    { field: 'model', width: 120 },
    { field: 'color', width: 120 },
    { field: 'fuel', width: 120 },
    { field: 'year', width: 120 },
    { field: 'price', width: 160 },
    {
      headerName: '',
      field: '_links.self.href',
      width: 100,
      cellRendererFramework: params =>
      <EditCar link={params.value} car={params.data} editCar={editCar}/>

    },
    { 
      headerName: '',
      field: '_links.self.href',
      width: 100,
      cellRendererFramework: params => 
        <IconButton color='secondary' onClick={() => deleteCar(params.value)}>
            <DeleteIcon />
        </IconButton>
    }
  ]

  return (
    <div className='App'>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6'>
            CarShop
          </Typography>
        </Toolbar>
      </AppBar>
      <AddCar addCar={addCar} />
      <div className="ag-theme-material" style={{ height: 500, width: '90%', margin: 'auto'}}>
        <AgGridReact
          rowData={cars}
          columnDefs={columns}
          defaultColDef={{
            sortable: true,
            resizable: true,
            filter: true,
          }}
          pagination={true}
          paginationPageSize={8}
          suppressCellSelection={true}
        />
      </div>
      <Snackbar
        open={open}
        message={msg}
        autoHideDuration={3000}
        onClose={closeSnackbar}
      />
      
    </div>
  );
}

export default App;
