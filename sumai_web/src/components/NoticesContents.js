import React, {useEffect} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';


import LinearProgress from '@material-ui/core/LinearProgress';

// Table
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import Collapse from '@material-ui/core/Collapse';

import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import useMediaQuery from '@material-ui/core/useMediaQuery';

//db
import axios from 'axios';

//redux
import {sendAct} from '../reducers/clientInfo'
import { useDispatch } from 'react-redux';



const useStyles = makeStyles((theme) => ({
  button: {
      variant: 'contained',
      color: '#666',
      border: '1px solid #d4d4d4',
      width: '100%',
      height: '50px',
      fontSize: '15px',
      borderRadius: '0px',
      
      "&:hover": {
        fontWeight: "bold",
        background: "#ffffff",
        textDecorationLine: 'underline',
      },
    },
  subtitle: {
    fontSize: "18px",
    fontFamily: "NotoSansKR-Medium",
  },
  content: {
    fontSize: "14px",
    fontFamily: "NotoSansKR-Light",
    lineHeight: "25px",
  },
  table: {
    '& > *': {
      borderBottom: 'unset',
    },
    "&:hover > *": {
      backgroundColor: "WhiteSmoke",
    },
  },
  tablePagination: {
    margin: 0
  },
  noticesBoxPC: {
    display: 'flex',
    margin: '50px 0',
    minHeight: '500px'
  },
  noticesBoxMobile: {
    display: 'flex',
    minHeight: '500px'
  },
}));

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(page - 5);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(page + 5);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  const handlePageClick = (event, page) => {
    onChangePage(page);
  };

  const currentPage = (page) => {
    let start=page-2>0? page-2: 0
    let end=start+5
    if(start+5>Math.max(0, Math.ceil(count / rowsPerPage))){
      end=Math.max(0, Math.ceil(count / rowsPerPage))
      start=end-5>0? end-5: 0
    }
    let pageList=[]
    for(let i=start; i<end; i++) {
      pageList=pageList.concat([i])
    }
    return pageList
  }

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton 
      onClick={handleBackButtonClick} 
      disabled={page === 0} 
      aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      {currentPage(page).map((n, index) => {
        return(
          <Typography 
          style={{
            display: 'inline-block', 
            padding: '0 10px', 
            color: page===n? 'red':'black',}}
          onClick={(event) => handlePageClick(event, n)}
          component={IconButton} key={index}>
            {n+1}
          </Typography>
        )
      }
      )}
      
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function useQueryCount() {
  const [rows, setRows] = React.useState([])

  useEffect(() => {
    axios.get('/api/notices/noticesCount').then((res) => {
      const t=res.data[0]['COUNT(*)']
      setRows(Array.from({length: t}, () => ({index: 0, title: '', content: '', date: ''})))
    })
  }, [])

  return [rows, setRows]
}

function useQueryData(queryRows) {
  const [rows, setRows] = useQueryCount()
  const count = rows.length
  const [loading, setLoading] = React.useState(false)

  const process = (emptyArray) => {
    if(emptyArray.length!==0) {
      emptyArray.forEach(async(emptyPoint) => {
        await axios.post('/api/notices/notices', {emptyPoint}).then((res) => {
          let t=res.data.map(data => ({ ...data, date: data.date.split('T')[0]}))
          for(let i=emptyPoint[0], j=0; i<emptyPoint[0]+emptyPoint[1]; i++, j++) {
            rows[i]=t[j]
          }
          setRows([...rows])
          setLoading(false)
        })
      })
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    if(rows.length!==0){
      setLoading(true)
      let emptyArray=[]
      let emptyPoint=[]
      let start
      for(start=queryRows[0]; start<rows.length && start<queryRows[1]; start++){
        if(rows[start].index===0 && emptyPoint.length===0) {
          emptyPoint=emptyPoint.concat([start])
        }else if(rows[start].index!==0 && emptyPoint.length===1) {
          emptyArray=emptyArray.concat([emptyPoint.concat([start-emptyPoint[0]])])
          emptyPoint=[]
        }
      }
      if(emptyPoint.length===1){
        emptyArray=emptyArray.concat([emptyPoint.concat([start-emptyPoint[0]])])
        emptyPoint=[]
      }
      if(emptyArray.length!==0)console.log('request', emptyArray)
      setTimeout(() => {
        process(emptyArray)
      }, 200);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[queryRows, count])

  return [loading, rows, count]
}

function NoticesTable(props) {
  const {matches} = props
  const classes = useStyles();
  const [selectId, setSelectId] = React.useState(-1)
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(0);
  const [queryRows, setQueryRows] = React.useState([0, 5])
  const [loading, rows, count] = useQueryData(queryRows)
  const [changePage, setChangePage] = React.useState(0)
  const [changeRowsPerPage, setChangeRowsPerPage] = React.useState(5)
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, count - page * rowsPerPage);

  const dispatch = useDispatch()

  const handleChangePage = async (newPage) => {
    let end=Math.max(0, Math.ceil(count / rowsPerPage) - 1)
    if(newPage>end){
      setQueryRows([end*rowsPerPage, (end+1)*rowsPerPage])
      setChangePage(end)
    } else if(newPage<0){
      setQueryRows([0, rowsPerPage])
      setChangePage(0)
    } else {
      setQueryRows([newPage*rowsPerPage, (newPage+1)*rowsPerPage])
      setChangePage(newPage)
    }
  };
  const handleChangeRowsPerPage = (event) => {
    if(event!==undefined) {
      const eventType=event.type
      const eventTargetValue=event.target.value
      if(eventType==='scroll') {
        setQueryRows([0, rowsPerPage+5])
        setChangeRowsPerPage(rowsPerPage+5)
      }else if(eventType==='change') {
        setQueryRows([0, parseInt(eventTargetValue, 10)])
        setChangePage(0)
        setChangeRowsPerPage(parseInt(eventTargetValue, 10))
      }
    } else {
      setQueryRows([0, rowsPerPage+5])
      setChangeRowsPerPage(rowsPerPage+5)
    }
  };
  const handleChangeSelectId = (newSelect) => {
    if (newSelect!==selectId) {
      setSelectId(newSelect)
      dispatch(sendAct(`notices - check ${newSelect}`))
    } else {
      setSelectId(-1)
    }
  }

  useEffect(() => {
    setRowsPerPage(10)
  }, [])

  useEffect(() => {
    if(!loading) {
      setPage(changePage)
      setRowsPerPage(changeRowsPerPage)
      document.getElementById('topLoadingBar').style.visibility='hidden'
    }else{
      document.getElementById('topLoadingBar').style.visibility='visible'
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])
  
  useEffect(() => {
    if(!matches) {
      if(document.body.scrollHeight < window.innerHeight) {
        handleChangeRowsPerPage()
      }else{
      }
      const handleScroll = (event) => {
        const {innerHeight} = window;
        const {scrollHeight} = document.body;
        // IE에서는 document.documentElement 를 사용.
        const scrollTop = document.documentElement.scrollTop
        if (scrollHeight - innerHeight - scrollTop < 10 && rowsPerPage<count) {
          handleChangeRowsPerPage(event)
        }
      };
      window.addEventListener("scroll", handleScroll)
  
      return () => window.removeEventListener("scroll", handleScroll);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, count, matches])

  
  return(
    <TableContainer >
      <Table aria-label="collapsible table"
      style={{
        width: '100%',
        borderTop: matches?'1px solid black':''
      }}>
        <TableHead style={{display: matches?'table-header-group':'none'}}>
          <TableRow>
            <TableCell align="center"
            style={{
              width: '90%',
            }}>내용</TableCell>
            <TableCell align="center"
            style={{
              minWidth: '100px'
            }}>등록일</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows && (rowsPerPage > 0
            ? rows.slice(page*rowsPerPage, (page+1)*rowsPerPage)
            : rows
          ).map((row, index) => {
            return (
              <React.Fragment key={index}>
                  <TableRow className={classes.table}
                  onClick={
                    () => handleChangeSelectId(row.index)
                  }
                  style={{
                    backgroundColor: selectId===row.index ? 'WhiteSmoke': '',
                  }}
                  >
                    <TableCell component="th" scope="row" 
                    style={{fontSize: '16px', width: '90%',}}>
                      {row.title}
                    </TableCell>
                    <TableCell style={{align: "center", minWidth: '100px'}}>{row.date}</TableCell>
                  </TableRow>
                <TableRow >
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
                    <Collapse in={selectId===row.index} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div" dangerouslySetInnerHTML={{__html: row.content}}>
                        </Typography>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}
          {matches && emptyRows > 0 && (
            <TableRow style={{ height: 56 * emptyRows }}>
              <TableCell colSpan={2} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            {matches && (
              <TableCell colSpan={2}>
              {page >= 0 && (
                <TablePagination 
                  classes={{
                    selectRoot: classes.tablePagination
                  }}
                  rowsPerPageOptions={[5, 10]}
                  rowsPerPage={rowsPerPage}
                  component="div"
                  count={count}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                  labelRowsPerPage='페이지 당 개수'

                  labelDisplayedRows={({ from, to, count }) => ``}
                  SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}/>
              )}
              </TableCell>
            )}
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}

export default function NoticesContents() {
  const theme = useTheme();
  const classes = useStyles();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  
  return (
    <Box
    style={{
      display: 'flex',
      minHeight: '500px',
      margin: (matches?'50px 0':'')
    }}>
      {matches && (
        <Box
        style={{
          flexGrow : 1,
        }}>
          <Typography className={classes.subtitle}>
            공지사항
          </Typography>
          <button
          onClick={
            () => {
              axios.post('/api/sendEmail/sendTemporaryPassword', {email:'ksm2@test.com'}).then(()=> {
                console.log('전송했지라')
              })
            }
          }>
            실험 버튼이지라
          </button>
        </Box>
      )}
      <Box
      style={{
        flexGrow: 10,
        width: 0
      }}>
        <NoticesTable matches={matches}/>
      </Box>
      <Box style={{
        position: 'fixed',
        width: '100%',
        zIndex: 100,
        top: 0,
        left: 0,
      }}>
        <LinearProgress id='topLoadingBar' style={{marginBottom: "10px",visibility: 'hidden'}}/>
      </Box>
    </Box>
  );
}