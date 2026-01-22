// [file name]: AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Typography, 
  Box, IconButton, TablePagination, TextField,
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Alert, Snackbar,
  Chip, Tooltip, CircularProgress, Card, CardContent
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // User details dialog
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/users', {
        params: {
          page: page + 1, // API uses 1-based indexing
          limit: rowsPerPage
        },
        withCredentials: true
      });

      if (response.data.success) {
        setUsers(response.data.users);
        setTotalUsers(response.data.totalUsers);
        setTotalPages(response.data.totalPages);
        setSearchResults(response.data.users); // Initialize search results
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Search users
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      setSearchResults(users);
    } else {
      const filtered = users.filter(user => 
        user.firstName?.toLowerCase().includes(term) ||
        user.lastName?.toLowerCase().includes(term) ||
        user.emailId?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
      );
      setSearchResults(filtered);
    }
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Delete user
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`/admin/users/${userToDelete._id}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setSuccessMessage('User deleted successfully');
        fetchUsers(); // Refresh the list
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  // View user details
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setDetailsDialogOpen(true);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'user': return 'success';
      default: return 'default';
    }
  };

  // Effect to fetch users when page or rowsPerPage changes
  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  if (loading && users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
        User Management
      </Typography>

      {/* Stats Card */}
      <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" color="text.secondary">
                Total Users
              </Typography>
              <Typography variant="h4" color="primary">
                {totalUsers}
              </Typography>
            </Box>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchUsers}
                disabled={loading}
              >
                Refresh
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Search and Controls */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          placeholder="Search users by name, email, or role..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
          }}
        />
      </Paper>

      {/* Users Table */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.light' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>#</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Points</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Streak</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Joined</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResults.length > 0 ? (
              searchResults.map((user, index) => (
                <TableRow 
                  key={user._id}
                  sx={{ 
                    '&:hover': { bgcolor: 'action.hover' },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {user.firstName} {user.lastName}
                    </Typography>
                    {user.age && (
                      <Typography variant="caption" color="text.secondary">
                        Age: {user.age}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {user.emailId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role}
                      color={getRoleColor(user.role)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.totalPoints || 0}
                      color="primary"
                      size="small"
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip 
                        label={`🔥 ${user.currentStreak || 0}`}
                        size="small"
                        title="Current Streak"
                      />
                      <Typography variant="caption" color="text.secondary">
                        Max: {user.maxStreak || 0}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          color="info"
                          onClick={() => handleViewDetails(user)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit User">
                        <IconButton size="small" color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {user.role !== 'admin' && (
                        <Tooltip title="Delete User">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteClick(user)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    {searchTerm ? 'No users found matching your search' : 'No users found'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={totalUsers}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Users per page:"
      />

      {/* User Details Dialog */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedUser && (
          <>
            <DialogTitle>
              User Details
            </DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedUser.firstName} {selectedUser.lastName}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedUser.emailId}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Role
                  </Typography>
                  <Chip 
                    label={selectedUser.role}
                    color={getRoleColor(selectedUser.role)}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Statistics
                  </Typography>
                  <Box display="flex" gap={2} mt={1}>
                    <Chip label={`Points: ${selectedUser.totalPoints || 0}`} />
                    <Chip label={`Streak: ${selectedUser.currentStreak || 0}`} />
                    <Chip label={`Max Streak: ${selectedUser.maxStreak || 0}`} />
                  </Box>
                </Box>

                {selectedUser.socialProfiles && Object.keys(selectedUser.socialProfiles).length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Social Profiles
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                      {Object.entries(selectedUser.socialProfiles).map(([platform, url]) => (
                        <Chip 
                          key={platform}
                          label={platform}
                          component="a"
                          href={url}
                          target="_blank"
                          clickable
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedUser.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsDialogOpen(false)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user "{userToDelete?.firstName} {userToDelete?.lastName}"? 
            This action cannot be undone and all their data will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={3000} 
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminUsers;