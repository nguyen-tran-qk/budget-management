import React, { useContext, useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import { BudgetEntry } from './types';
import { BudgetContext } from './BudgetContext';
import { createNewBudgetEntry } from './utils';

interface EntryDialogProps {
  open: boolean;
  handleClose: () => void;
  entryID?: string;
}

const AMOUNT_ERROR_MSG = 'Please fill in a valid amount';

const EntryDialog = ({ open, handleClose, entryID }: EntryDialogProps) => {
  const { budgetEntries, setBudgetEntries } = useContext(BudgetContext);
  const [amount, setAmount] = useState<number | ''>('');
  const [amountError, setAmountError] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (entryID) {
      const updatingEntry = findEntryById(entryID);
      if (updatingEntry) {
        setAmount(updatingEntry.amount.toUnit());
        setDescription(updatingEntry.description);
      }
    }
  }, [entryID]);

  const onAmountInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = evt.target.value;
    try {
      if (!inputValue) {
        setAmountError(AMOUNT_ERROR_MSG);
        setAmount('');
      } else {
        const decimalPart = inputValue.split('.')[1] || inputValue.split(',')[1];
        if (decimalPart && parseInt(decimalPart) > 99) {
          // invalid cents number
          setAmountError(AMOUNT_ERROR_MSG);
        } else {
          setAmountError('');
        }
        setAmount(parseFloat(inputValue));
      }
    } catch (error) {
      setAmountError(AMOUNT_ERROR_MSG);
    }
  };

  const onDescriptionInputChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(evt.target.value);
  };

  const onSubmit = () => {
    if (!amount) {
      setAmountError(AMOUNT_ERROR_MSG);
      return;
    } else if (amountError.length) {
      return;
    }

    let amountInCents;
    try {
      amountInCents = parseInt((amount * 100).toString());
    } catch (error) {
      setAmountError(AMOUNT_ERROR_MSG);
      return;
    }
    const newEntry = createNewBudgetEntry(amountInCents, description);
    const newEntriesList = entryID
      ? budgetEntries.map((item) => (item.id === entryID ? newEntry : item))
      : [...budgetEntries, newEntry];
    setBudgetEntries(newEntriesList);
    handleClose();
  };

  const findEntryById = (entryID: string) => budgetEntries.find((item) => item.id === entryID);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm">
      <DialogTitle>{entryID ? 'Edit entry' : 'Add a new entry'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="amount"
          label="Amount of money in Euro (e.g 100,99)"
          type="number"
          fullWidth
          variant="standard"
          value={amount}
          onChange={onAmountInputChange}
          error={!!amountError}
          helperText={amountError}
          placeholder="100,99"
        />
        <TextField
          margin="dense"
          id="description"
          label="Description"
          type="text"
          multiline
          fullWidth
          variant="standard"
          value={description}
          onChange={onDescriptionInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSubmit}>{entryID ? 'Update' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EntryDialog;
