import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const InvoiceType = ({ type, setType }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  

  const handleChange = (event) => {
    setType(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <p style={{marginBottom: '-10px', paddingTop: '10px', color: 'gray', fontSize: '1.22rem', fontWeight: 500}}>Select type</p>
      <Button style={{lineSpacing: 1, fontSize: 35, fontWeight: 700}} onClick={handleClickOpen}>{type? type : 'Invoice'}</Button>
      <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
        {/* <DialogTitle>Fill the form</DialogTitle> */}
        <DialogContent>
          <div className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-dialog-select-label" style={{ fontSize: '1.21rem' }}>Select Type</InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={type}
                onChange={handleChange}
                input={<Input style={{ fontSize: '1.16rem' }} />}
                style={{ fontSize: '1.16rem', minHeight: 48 }}
                MenuProps={{
                PaperProps: {
                 style: { fontSize: '1.15rem' }
                            }
                         }}
              >
                <MenuItem value="">
                  <em style={{ fontSize: '1.10rem' }}>Select Type</em>
                </MenuItem>
                <MenuItem value="Invoice" style={{ fontSize: '1.11rem' }}>Invoice</MenuItem>
                <MenuItem value="Receipt" style={{ fontSize: '1.11rem' }}>Receipt</MenuItem>
                <MenuItem value="Estimate" style={{ fontSize: '1.11rem' }}>Estimate</MenuItem>
                <MenuItem value="Bill" style={{ fontSize: '1.11rem' }}>Bill</MenuItem>
                <MenuItem value="Quotation" style={{ fontSize: '1.11rem' }}>Quotation</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" style={{ fontSize: '1.11rem' }}>
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary" style={{ fontSize: '1.11rem' }}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InvoiceType