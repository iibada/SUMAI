import React from 'react';
import { withRouter } from 'react-router'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import imgLogo from '../images/sumai_logo_blue.png';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import * as root from '../rootValue';
import { connect } from 'react-redux';
import axios from 'axios';
import { SnackbarProvider, useSnackbar } from 'notistack';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { logoutRequest } from '../actions/authentication';

const useStyles = theme => ({
    AppBarStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        background: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
    },
    imgLogo: {
        width: 80,
        height: 28.2,
        alt: 'SUMAI',
    },
    link: {
        display: 'flex',
        alignItems: "center",
        textDecoration: 'none',
    },
    displayNone: {
        display: "none",
    },
});


function PasswordChangeMassage(props) {
    const { enqueueSnackbar } = useSnackbar()
    const { code, setCode } = props

    React.useEffect(() => {
        console.log(code)
        if(code === 1) enqueueSnackbar('회원탈퇴 되었습니다. 이용해주셔서 감사합니다.', {variant: "success"})
        if(code === 2) enqueueSnackbar('해당 계정이 존재하지 않습니다.', {variant: "error"})
        if(code === 3) enqueueSnackbar('비밀번호가 틀립니다.', {variant: "error"})
        if(code === 4) enqueueSnackbar('로그인 상태가 아닙니다.', {variant: "error"})
        setCode(0)
    }, [code])

    return (<React.Fragment></React.Fragment>)
}


class AccountPassword extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            password: "",
            passwordError: false,
            dialogOpen: false,
            code: 0,
        }
        this.textFieldRef = [React.createRef()]
    }

    componentDidMount() {
        if(this.props.status.isLoggedIn === false) {
          this.props.history.push("/")
        }
    }

    handleClickOpen = () => {
        this.setState({
            dialogOpen: true,
        })      
    };

    handleClose = () => {
        this.setState({
            dialogOpen: false,
            password: "",
        })
    };

    handleCode = (code) => {
        this.setState({
            code: code
        })
    }

    handleChange = (e) => {
        this.setState({
            password: e.target.value.trim(),
            passwordError: false,
        })
    }

    onClickPasswordCheck = () => {
        if(this.state.password === "") {
            this.textFieldRef[0].current.focus()
            return
        }

        this.onPasswordCheck(this.props.status.currentEmail, this.state.password).then(data => {
            if (data.success) {
                this.setState({
                    dialogOpen: true,
                })  
            } else {
                this.setState({
                    code: data.code,
                    passwordError: true,
                })
            }
        })
    }
    onPasswordCheck = (email, password) => {
        return axios.post('/api/account/login', { email, password }).then(
            () => {
                if(this.props.status.isLoggedIn === true) {
                    return { success: true };
                } else {
                    console.log(this.props.status.isLoggedIn)
                    return { success: false, code: 4 }
                }
            }
        ).catch(
            (error) => {
                return { success: false, code: error.response.data.code }
            }
        );
    }


    onClickWithdrawal = () => {
        if(this.state.password === "") {
            return
        }

        if(this.state.code === 1) {
            return
        }

        this.onWithdrawal(this.props.status.currentEmail, this.state.password).then(data => {
            if (data.success) {
                this.setState({
                    code: 1,
                    dialogOpen: false,
                })  

                this.props.logoutRequest().then(
                    () => {
                        // EMPTIES THE SESSION
                        let loginData = {
                            isLoggedIn: false,
                            email: ''
                        };
                        document.cookie = 'key=' + btoa(JSON.stringify(loginData));
                    }
                );

                setTimeout(function() { 
                    this.props.history.push("/login")
                }.bind(this), 2000)

            } else {
                this.setState({
                    code: data.code,
                    password: "",
                    dialogOpen: false,
                })
            }
        })
    }
    onWithdrawal = (email, password) => {
        return axios.post('/api/account/withdrawal', { email, password }).then(
            () => {
                if(this.props.status.isLoggedIn === true) {
                    return { success: true };
                } else {
                    console.log(this.props.status.isLoggedIn)
                    return { success: false, code: 4 }
                }
            }
        ).catch(
            (error) => {
                return { success: false, code: error.response.data.code }
            }
        );
    }

    render() {
        const { classes } = this.props;

        return (
            <div >
                <AppBar position="static" className={classes.AppBarStyle}>
                    <Toolbar variant="dense">

                        <a href="/accounts" className={classes.link} >
                            <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 
                            <Typography style={{color: "#0000008A", paddingLeft: "10px", fontSize: "28px"}}>계정</Typography>
                        </a>

                    </Toolbar>

                    <Box display="flex" alignItems="center" justifyContent="center" style={{paddingTop: "20px"}}>
                        <IconButton onClick={() => this.props.history.goBack()}>
                            <ArrowBackIcon style={{color: "#0000008A"}}/>  
                        </IconButton>
                        <Typography variant="h5" style={{color: "#0000008A", paddingLeft: "10px", width: "600px"}}>회원탈퇴</Typography>
                    </Box>
                </AppBar> 

                <Box style={{background: "#fff"}}>
                    <Grid container justify="center" style={{padding: "24px"}}>

                        <Paper variant="outlined" style={{width: "100%", minWidth: "200px", maxWidth: "450px", padding: "24px"}}>
                            <Typography variant="caption" style={{fontFamily: "NotoSansKR-Regular", color: "#0000008A"}}>
                                회원탈퇴
                            </Typography>

                            <TextField autoFocus fullWidth variant="outlined" value={this.state.password} onChange={this.handleChange} label="비밀번호 입력" 
                                        style={{margin: "30px 0px 7.5px 0px"}} placeholder="비밀번호를 입력해주세요." type="password" error={this.state.passwordError} inputRef={this.textFieldRef[0]}
                                        helperText={this.state.passwordError ? "잘못된 비밀번호입니다. 다시 시도하거나 비밀번호 찾기를 클릭하여 재설정하세요." : false} />

                            <Box display="flex" flexDirection="row-reverse" style={{marginTop: "10px"}}>
                                <Button onClick={this.onClickPasswordCheck} style={{background: root.PrimaryColor, color: "#fff"}}>
                                    회원탈퇴
                                </Button>
                                <Button style={{color: root.PrimaryColor}} onClick={() => this.props.history.goBack()}>
                                    취소
                                </Button>
                            </Box>
                        </Paper>

                    </Grid>
                </Box>


                <Dialog open={this.state.dialogOpen} onClose={this.handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
                    <DialogTitle id="alert-dialog-title">
                        <Box display="flex" alignItems="center">
                            <img src={imgLogo} alt="SUMAI" className={classes.imgLogo} /> 
                            <Typography variant="h5" style={{color: "#0000008A", paddingLeft: "10px"}}>서비스 탈퇴</Typography>
                        </Box>
                    </DialogTitle>

                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" style={{fontFamily: "NotoSansKR-Regular"}}>
                            회원탈퇴 시 모든 정보가 삭제되며, 삭제된 정보는 복구할 수 없습니다.<br/><br/>
                            정말 회원탈퇴를 진행하시겠습니까?
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            취소
                        </Button>
                        <Button onClick={this.onClickWithdrawal} color="primary" autoFocus>
                            회원탈퇴
                        </Button>
                    </DialogActions>
                </Dialog>


                <SnackbarProvider maxSnack={3}> 
                    <PasswordChangeMassage code={this.state.code} setCode={this.handleCode}/>
                </SnackbarProvider>

            </div>
          );
    }

}

const mapStateToProps = (state) => {
    return {
        status: state.authentication.status,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logoutRequest: () => {
            return dispatch(logoutRequest());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(withRouter(AccountPassword)));
