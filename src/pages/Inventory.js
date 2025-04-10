import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import { inventory } from '../services/api';
 
const Inventory = () => {
  const [inventoryData, setInventoryData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
 
  const [visibleRows, setVisibleRows] = useState(5);
 
  const handleReadMore = () => {
    setVisibleRows(prev => prev + 5);
  };
 
  const handleShowLess = () => {
    setVisibleRows(5);
  };
 
 
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const ownerId = localStorage.getItem('userId'); // Assuming you have the owner ID stored in local storage
        const response = await inventory.getInventoryByOwner(ownerId); // Adjust the API call as needed
 
        // Process the response to separate by hotelId
        const organizedData = {};
        response.data.forEach(hotelInventoryList => {
          hotelInventoryList.forEach(entry => {
            const { hotel, date, availableRooms, bookedRooms, roomType: { roomTypeId, totalRooms, typeName } } = entry;
 
            // Initialize the hotel entry if it doesn't exist
            if (!organizedData[hotel.hotelId]) {
              organizedData[hotel.hotelId] = {
                hotelName: hotel.hotelName,
                roomTypes: {}
              };
            }
 
            if (!organizedData[hotel.hotelId].roomTypes[roomTypeId]) {
              organizedData[hotel.hotelId].roomTypes[roomTypeId] = {
                typeName: entry.roomType.typeName,
                inventory: []
              };
            }
 
            organizedData[hotel.hotelId].roomTypes[roomTypeId].inventory.push({
              date,
              totalRooms,
              availableRooms,
              bookedRooms
            });
          });
        });
 
        // Sort the inventory by date
        Object.keys(organizedData).forEach(hotelId => {
          Object.keys(organizedData[hotelId].roomTypes).forEach(roomTypeId => {
            organizedData[hotelId].roomTypes[roomTypeId].inventory.sort((a, b) => new Date(a.date) - new Date(b.date));
          });
        });
 
 
        console.log(organizedData)
        setInventoryData(organizedData);
      } catch (err) {
        console.log(err);
        setError('Failed to fetch inventory data');
      } finally {
        setLoading(false);
      }
    };
 
    fetchInventory();
  }, []);
 
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
 
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }
 
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Inventory
      </Typography>
      {Object.keys(inventoryData).map((hotel) => (
        <Box key={hotel} sx={{ mb: 4 }}>
          <Typography variant="h5">{inventoryData[hotel].hotelName}</Typography><Divider/>
          {Object.keys(inventoryData[hotel].roomTypes).map((roomTypeId) => (
            <Box key={roomTypeId} sx={{ mb: 2 }}>
              <Typography variant='h6' sx={{ color: 'secondary.main', py: 2 }}>{inventoryData[hotel].roomTypes[roomTypeId].typeName}</Typography>
              <TableContainer component={Paper}>
                <Table size='small' aria-label='a dense table'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Total Rooms</TableCell>
                      <TableCell>Available Rooms</TableCell>
                      <TableCell>Booked Rooms</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventoryData[hotel].roomTypes[roomTypeId].inventory.slice(0, visibleRows).map((entry) => (
                      <TableRow key={entry.date}>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>{entry.totalRooms}</TableCell>
                        <TableCell>{entry.availableRooms}</TableCell>
                        <TableCell>{entry.totalRooms - entry.availableRooms}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ display: 'flex', mt: 2 }}>
                {visibleRows < inventoryData[hotel].roomTypes[roomTypeId].inventory.length && (
                  <Button sx={{ fontSize: '0.75rem', padding: '4px 4px' }} variant='contained' onClick={handleReadMore}>Show More (5)</Button>
                )}
                {visibleRows > 5 && (
                  <Button sx={{ fontSize: '0.75rem', padding: '4px 4px' }} onClick={handleShowLess}>Show Less</Button>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      ))}
    </Container>
  );
};
 
export default Inventory;
