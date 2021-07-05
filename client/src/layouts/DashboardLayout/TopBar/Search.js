import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  InputAdornment,
  Link,
  SvgIcon,
  TextField,
  Tooltip,
  Typography,
  makeStyles,
  Divider
} from '@material-ui/core';
import { Search as SearchIcon, XCircle as XIcon } from 'react-feather';
import axios from 'src/utils/axios';

import { SERVER_URL } from 'src/constants';

import Highlighter from 'react-highlight-words';

const useStyles = makeStyles(() => ({
  drawer: {
    width: 500,
    maxWidth: '100%'
  }
}));

const Search = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = useState('');
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    //setResults([]);
  };

  const handleCompleteClose = () => {
    setOpen(false);
    setResults([]);
    setValue('');
  };

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        SERVER_URL + '/api/invoice/invoices-search/',
        {
          params: {
            // info: value.toLowerCase()
            info: value
          }
        }
      );
      setResults(response.data.searchinvoiceresult);
    } catch (err) {
      console.error(err);
      setResults([]);
      enqueueSnackbar('No Relevant Invoice Found!', {
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Search Invoices">
        <IconButton color="inherit" onClick={handleOpen}>
          <SvgIcon fontSize="small">
            <SearchIcon />
          </SvgIcon>
        </IconButton>
      </Tooltip>
      <Drawer
        anchor="right"
        classes={{ paper: classes.drawer }}
        ModalProps={{ BackdropProps: { invisible: true } }}
        onClose={handleClose}
        open={isOpen}
        variant="temporary"
      >
        <PerfectScrollbar options={{ suppressScrollX: true }}>
          <Box p={3}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h4" color="textPrimary">
                Search Invoices
              </Typography>
              <IconButton onClick={handleCompleteClose}>
                <SvgIcon fontSize="small">
                  <XIcon />
                </SvgIcon>
              </IconButton>
            </Box>
            <Box mt={2}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                onChange={event => setValue(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter Text"
                value={value}
                variant="outlined"
              />
            </Box>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                color="secondary"
                variant="contained"
                onClick={handleSearch}
              >
                Search
              </Button>
            </Box>
            <Box mt={4}>
              {isLoading ? (
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {results.map((result, i) => (
                    <Box key={i} mb={2}>
                      <Link
                        variant="h4"
                        color="primary"
                        component={RouterLink}
                        //onClick={handleClose}
                        to={'/app/invoice/' + result.invoice_id}
                      >
                        {/* {result.number} */}
                        View Invoice Details
                      </Link>

                      <br />

                      {result.client_name && (
                        <Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[value]}
                          autoEscape={true}
                          textToHighlight={'Client Name: ' + result.client_name}
                        />
                      )}

                      <br />

                      {result.client_name && (
                        <Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[value]}
                          autoEscape={true}
                          textToHighlight={'Company Name: ' + result.company_name}
                        />
                      )}

                      <br />

                      {result.project_name && (
                        <Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[value]}
                          autoEscape={true}
                          textToHighlight={
                            'Project Name: ' + result.project_name
                          }
                        />
                      )}

                      <br />

                      {result.currency && (
                        <Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[value]}
                          autoEscape={true}
                          textToHighlight={
                            'Currency: ' + result.currency
                          }
                        />
                      )}

                      <br />

                      {result.total && (
                        <Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[value]}
                          autoEscape={true}
                          textToHighlight={
                            'Total Amount: ' + result.total
                          }
                        />
                      )}

                      <br />


                      {result.creation_date && (
                        <Highlighter
                          highlightClassName="YourHighlightClass"
                          searchWords={[value]}
                          autoEscape={true}
                          textToHighlight={
                            'Creation Date: ' + result.creation_date
                          }
                        />
                      )}

                      <br />
                      <br />

                      <Divider />
                    </Box>
                  ))}
                </>
              )}
            </Box>
          </Box>
        </PerfectScrollbar>
      </Drawer>
    </>
  );
};

export default Search;
