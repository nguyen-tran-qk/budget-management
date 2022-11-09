import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';
import React, { useContext, useState } from 'react';
import { BudgetContext } from '../contexts/BudgetContext';

interface DeleteEntryAlertProps {
  open: boolean;
  handleClose: () => void;
  entryID?: string;
}

/** Dialog to delete an entry upon user's confirmation */
const DeleteEntryAlert = ({ open, handleClose, entryID }: DeleteEntryAlertProps) => {
  const { budgetEntries, setBudgetEntries } = useContext(BudgetContext);
  const [error, setError] = useState(false);

  const deleteEntryAndClose = () => {
    const entryIndex = budgetEntries.findIndex((item) => item.id === entryID);
    if (entryIndex > -1) {
      const newEntriesList = [...budgetEntries];
      newEntriesList.splice(entryIndex, 1);
      setBudgetEntries(newEntriesList);
      handleClose();
    } else {
      setError(true);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      {error ? (
        <>
          <DialogTitle>Error: Failed to delete entry. Please try again</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle>Are you sure you want to delete this entry?</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose}>No, cancel</Button>
            <Button onClick={deleteEntryAndClose} autoFocus>
              Yes, delete
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default DeleteEntryAlert;
