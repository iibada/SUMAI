import React, { Component } from 'react';
import { withRouter } from 'react-router'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Slide from '@material-ui/core/Slide';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import moment from "moment"
import axios from "axios"
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import DialogContents from './DialogContents'

import { checkSite } from '../functions/CheckSite';
import { returnUrl } from '../functions/util';

const root = checkSite();

const useStyles = theme => ({
    root: {
        minHeight: '100vh',
        flexDirection: 'column',
        display: 'flex',
        [theme.breakpoints.between(0, 600)]: {
            position: "relative",
        },
        [theme.breakpoints.up(600)]: {
            '&::before, &::after': {
                minHeight: '30px',
                height: '24px',
                boxSizing: 'border-box',
                display: 'block',
                content: '""',
                flexGrow: 1,
            },
        },
    },
    card: {
        width: '100vw',
        position: 'relative',
        [theme.breakpoints.between(0, 600)]: {
            padding: '40px 40px 0px 40px',
            boxShadow: '0px 0px'
        },
        [theme.breakpoints.up(600)]: {
            maxWidth: '450px',
            minWidth: '300px',
        },
    },
    cardHead: {
        [theme.breakpoints.between(0, 600)]: {
            padding: '0px',
            marginBottom: '15px'
        },
        [theme.breakpoints.up(600)]: {
            borderBottom: '1px solid #e0e0e0',
            color: '#0000008a',
            padding: theme.spacing(1),
            paddingLeft: theme.spacing(2),
        },
    },
    cardBody: {
        [theme.breakpoints.between(0, 600)]: {
            position: "relative",
            overflow: 'hidden',
            paddingBottom: '25px',
        },
        [theme.breakpoints.up(600)]: {
            padding: "16px 10%",
            minHeight: '450px',
        }
    },
    textInput: {
        background: '#ffffff',
        width: '100%',
        height: '100%',
        lineHeight: '35px',
        minHeight: theme.spacing(20),
        fontSize: '24px',
        fontFamily: 'NotoSansKR-Black',
        border: 'none',
        outline: 'none',
        resize: 'none',
    },
    signupButtonLayout: {
        padding: theme.spacing(0),
    },
    signupButton: {
        variant: 'contained',
        color: '#ffffff',
        background: root.PrimaryColor,
        "&:hover": {
            background: root.HoberColor
        },
        width: '100%',
        height: '50px',
        fontSize: '20px',
        fontWeight: 'bold',
        borderRadius: '0px',
    },
    signupButtonMobLayout: {
        display: "flex",
        flexDirection: "column",
        padding: "0px 40px 20px 40px",
    },
    signupButtonMob: {
        variant: 'contained',
        color: '#ffffff',
        background: root.PrimaryColor,
        "&:hover": {
            background: root.HoberColor,
        },
        width: '100%',
        height: '50px',
        fontSize: '20px',
        fontWeight: 'bold',
    },
    imgLogo: {
        width: root.logoWidth,
        height: root.logoHeight,
        alt: root.site,
    },
    termsButton: {
        width: "105px",
        padding: "7.5px",
        fontSize: "12px",
        color: "#fff",
        fontFamily: "NotoSansKR-Light",
        background: root.PrimaryColor,
        "&:hover": {
            background: root.HoberColor,
        },
    },
    termsCheckBox: {
        margin: '0px',
        color: "#757575",
        fontFamily: "NotoSansKR-Light",
    },
    formControl: {
        margin: "0px 15px",
    },
    displayNone: {
        display: "none",
    },
})

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Signup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            emailerror: false,
            name: "",
            nameerror: false,
            password: "",
            passworderror: false,
            passwordcheck: "",
            passwordcheckerror: false,
            termsChecked: false,
            termsCheckederror: false,
            privacyChecked: false,
            privacyCheckederror: false,
            year: '',
            month: '',
            date: '',
            errorMassage: '',
            dateError: false,
            gender: '',
            genderCustom: '',
            genderError: '',
            certNumber: '',
            certError: false,
            slideNumber: 0,
            errorCode: 0,
            errorMessage: '',
            birthCode: 0,
            emailSendCount: 3,
            emailSendMessage: false,
            beforeSlide: null,
            afterSlide: null,
            dialogOpen: false,
            dialogContentType: undefined,
        }
        this.textFieldRef = [React.createRef(), React.createRef(), React.createRef(), React.createRef()]
        this.textFieldRefBirthday = [React.createRef(), React.createRef()]
        this.textFieldRefGender = [React.createRef()]
    }

    handleChange = (type, e) => {
        if (type === "email") {
            if (this.state.errorCode === 1) {
                this.setState({
                    errorCode: 0,
                })
            }
            this.setState({
                email: e.target.value.trim(),
            })
        } else if (type === "name") {
            this.setState({
                name: e.target.value.trim(),
            })
        } else if (type === "password") {
            this.setState({
                password: e.target.value.trim(),
            })
        } else if (type === "passwordcheck") {
            this.setState({
                passwordcheckerror: false,
                passwordcheck: e.target.value.trim(),
            })
        } else if (type === "terms") {
            this.setState({
                termsChecked: e.target.checked,
            })
        } else if (type === "privacy") {
            this.setState({
                privacyChecked: e.target.checked,
            })
        } else if (type === "certNumber") {
            this.setState({
                certNumber: e.target.value.trim(),
            })
        }

        this.validation(type, e.target.value.trim(), e.target.checked)
    }
    validation = (type, value, checked) => {
        if (type === "email") {
            // 이메일 형식 검사
            const emailRegex = /^[0-9a-z]([-_.]?[0-9a-z])*@[0-9a-z]([-_.]?[0-9a-z])*\.[a-z]{2,}$/i;
            if (!emailRegex.test(value) && value !== "") {
                this.setState({
                    emailerror: true,
                })
            } else {
                this.setState({
                    emailerror: false,
                })
            }
        } else if (type === "name") {
            // 이름 형식 검사
            const nameRegex = /^[a-zA-Z가-힣0-9]{2,10}$/;
            if (!nameRegex.test(value) && value !== "") {
                this.setState({
                    nameerror: true,
                })
            } else {
                this.setState({
                    nameerror: false,
                })
            }
        } else if (type === "password") {
            // 비밀번호 유형 검사 (영어, 숫자 8~15자리)
            const passwordRegex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[`~!@#$%^&+*()\-_+=.,<>/?'";:[\]{}\\|]).*$/;
            if (!passwordRegex.test(value) && value !== "") {
                this.setState({
                    passworderror: true,
                })
            } else {
                this.setState({
                    passworderror: false,
                })
            }
        } else if (type === "passwordcheck") {
            // 비밀번호 확인
        } else if (type === "terms" && checked) {
            // 이용약관 동의 확인
            this.setState({
                termsCheckederror: false,
            })
        } else if (type === "privacy" && checked) {
            // 개인정보처리방침 동의 확인
            this.setState({
                privacyCheckederror: false,
            })
        } else if (type === "certNumber") {
            this.setState({
                certError: false,
            })
        }
    }

    onResize = () => {
        const zoom = Math.min(window.innerWidth / 400, 1);
        document.documentElement.style.zoom = `${zoom}`;
    }

    componentDidMount() {
        this.onResize()
        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize)
    }

    setDialogOpen = (bool, contentType) => {
        this.setState({
            dialogOpen: bool,
            dialogContentType: contentType,
        })
    }

    handleChangeBirthday = (value, type) => {
        const re = /^[0-9\b]+$/

        if (type === "year" && (value === '' || re.test(value.trim()))) {
            this.setState({ year: value.trim() })
        } else if (type === "month") {
            this.setState({ month: value.trim() })
        } else if (type === "date" && (value === '' || re.test(value.trim()))) {
            this.setState({ date: value.trim() })
        }
    }
    validationBirthday = () => {
        let currentYear = parseInt(moment().format('YYYY'))

        let year = parseInt(this.state.year)
        let month = parseInt(this.state.month)
        let date = parseInt(this.state.date)

        if (this.state.year === '' && this.state.month === '' && this.state.date === '') {
            return true
        }

        if (this.state.year === '') {
            this.textFieldRefBirthday[0].current.focus()
            this.setState({ errorMassage: '생년월일을 정확히 입력해 주세요.' })
            return false
        } else if (this.state.month === '') {
            this.setState({ errorMassage: '생년월일을 정확히 입력해 주세요.' })
            return false
        } else if (this.state.date === '') {
            this.textFieldRefBirthday[1].current.focus()
            this.setState({ errorMassage: '생년월일을 정확히 입력해 주세요.' })
            return false
        }

        if (year < 1000 || 10000 <= year) {  // 연도 4자리 수 입력
            this.textFieldRefBirthday[0].current.focus()
            this.setState({ errorMassage: '4자리 연도를 입력해 주세요.' })
            return false
        } else if (year < 1890) {  // 1890년도 이후 입력 
            this.textFieldRefBirthday[0].current.focus()
            this.setState({ errorMassage: '올바른 연도를 입력해 주세요.' })
            return false
        } else if (currentYear < year) {
            this.textFieldRefBirthday[0].current.focus()
            this.setState({ errorMassage: '올바른 연도를 입력해 주세요.' })
            return false
        } else {
            this.setState({ errorMassage: '' })
        }

        if (month < 1 || 12 < month) {  // 월 범위 벗어나는 경우
            this.setState({ errorMassage: '올바른 월을 입력해 주세요.' })
            return false
        } else {
            this.setState({ errorMassage: '' })
        }

        if (date < 1 || 31 < date) {  // 일 범위 벗어나는 경우
            this.textFieldRefBirthday[1].current.focus()
            this.setState({ errorMassage: '올바른 일을 입력해 주세요.' })
            return false
        } else {
            this.setState({ errorMassage: '' })
        }

        if (this.state.year !== '' && this.state.month !== '' && this.state.date !== '') {
            let birthday
            if (this.state.month.length === 1) birthday = this.state.year + "0" + this.state.month + this.state.date
            else birthday = this.state.year + this.state.month + this.state.date
            if (this.state.date.length === 1) birthday = this.state.year + this.state.month + "0" + this.state.date
            else birthday = this.state.year + this.state.month + this.state.date

            if (!moment(birthday).isValid()) {
                this.setState({ errorMassage: '올바른 생년월일을 입력해 주세요.' })  // 올바른 날짜인지 검증
                return false
            }
            else if (moment().isBefore(moment(birthday), 'date')) {
                this.setState({ errorMassage: '올바른 생년월일을 입력해 주세요.' })  // 현재 날짜 이후 생년월일 오류
                return false
            } else {
                return true
            }

        }
    }

    handleChangeGender = (e) => {
        this.setState({
            genderCurrent: e.target.value,
            genderError: 1,
        })
    }
    handleChangeGenderCustom = (e) => {
        this.setState({
            genderCustom: e.target.value,
        })
    }
    validationGender = () => {
        if (this.state.genderCurrent === "") {
            return true
        }

        if (this.state.genderCurrent === "사용자 지정" && this.state.genderCustom === "") {
            this.textFieldRefGender[0].current.focus()
            this.setState({ genderError: -2 })
            return false
        }

        if (this.state.genderCurrent !== "" && this.state.genderCurrent !== "사용자 지정") {
            return true
        }

        if (this.state.genderCurrent === "사용자 지정" && this.state.genderCustom !== "") {
            return true
        }
    }

    snackBarHandleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        if (this.state.termsCheckederror) {
            this.setState({ termsCheckederror: false })
        } else if (this.state.privacyCheckederror) {
            this.setState({ privacyCheckederror: false })
        }

        if (this.state.errorCode !== 0) {
            this.setState({ errorCode: 0 })
        }

        if (this.state.emailSendMessage === true) {
            this.setState({ emailSendMessage: false })
        }
    }
    onClickSignup = async (e) => {

        if (this.state.slideNumber === 0) { // 회원가입 누르면
            if (this.state.email === "" || this.state.emailerror) {
                this.textFieldRef[0].current.focus()
                return
            } else if (this.state.name === "" || this.state.nameerror) {
                this.textFieldRef[1].current.focus()
                return
            } else if (this.state.password === "" || this.state.passworderror) {
                this.textFieldRef[2].current.focus()
                return
            } else if (this.state.password !== this.state.passwordcheck) {
                this.setState({
                    passwordcheckerror: true,
                    passwordcheck: '',
                })
                this.textFieldRef[3].current.focus()
                return
            } else if (this.state.password === this.state.passwordcheck) {
                this.setState({
                    passwordcheckerror: false,
                })
            }
            if (!this.state.termsChecked) {
                this.setState({
                    termsCheckederror: true,
                })
                return
            } else if (!this.state.privacyChecked) {
                this.setState({
                    privacyCheckederror: true,
                })
                return
            }
        }


        if (!this.state.emailerror && !this.state.nameerror && !this.state.passworderror && !this.state.passwordcheckerror && !this.state.termsCheckederror && !this.state.privacyCheckederror) {
            if (this.state.slideNumber === 0) {
                this.props.onCheckSignupEmail(this.state.email).then((res) => { // 다음을 누를경우 이메일을 검사하는 코드
                    if (res.success) {
                        this.setState({
                            slideNumber: 1,
                        })
                    } else {
                        this.setState({
                            errorCode: 1,
                        })
                    }
                })
            } else if (this.state.slideNumber === 1 && this.validationBirthday() && this.validationGender()) { // 2번째 페이지에서 다음을 누를 경우..
                this.sendCertMail();
                this.setState({ slideNumber: 2 })
                e.target.textContent = '완료'
            } else if (this.state.slideNumber === 2) {
                let birthday
                if (this.state.month.length === 1) birthday = this.state.year + "0" + this.state.month + this.state.date
                else birthday = this.state.year + this.state.month + this.state.date
                if (this.state.date.length === 1) birthday = this.state.year + this.state.month + "0" + this.state.date
                else birthday = this.state.year + this.state.month + this.state.date

                let gender = this.state.genderCurrent
                if (this.state.genderCurrent === '사용자 지정') gender = this.state.genderCustom

                try {
                    const response = await axios.post('/api/email/EmailCertification', { email: this.state.email, name: this.state.name, password: this.state.password, birthday: birthday, gender: gender, cert: this.state.certNumber })
                    
                    if (response.data.code === 0) {
                        this.props.onLogin(this.state.email, this.state.password).then(data => { // login 부분 ***********
                            if (data.success) {
                                this.props.history.push(returnUrl())
                            } else {
                                this.setState({ errorCode: 2, certError: true })
                            }
                        })
                    } else {
                        this.setState({ errorCode: 2, certError: true })
                    }
                    
                } catch (e) {
                    this.setState({ errorCode: 5 })
                }
            }
        }
    }

    sendCertMail = () => {
        return axios.post('/api/email/sendEmailCertification', { email: this.state.email, name: this.state.name, siteType:root.site })
    }

    onClickSendMail = () => {
        if (0 < this.state.emailSendCount) {
            this.sendCertMail();
            this.setState({
                emailSendCount: this.state.emailSendCount - 1,
                emailSendMessage: true,
            })
        } else {
            this.setState({ errorCode: 4 })
        }
    }
    onKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.onClickSignup();
        }
    }

    onEnterSlide = (e) => {
        e.style.position = 'relative'
        this.setState({
            beforeSlide: this.state.afterSlide,
            afterSlide: e
        })
    }
    onEnteredSlide = (e) => {
        if (this.state.slideNumber === 0) {
            this.textFieldRef[0].current.focus()
        } else if (this.state.slideNumber === 1) {
            this.textFieldRefBirthday[0].current.focus()
        }
    }
    onExitingSlide = (e) => {
        const beforeslide = this.state.beforeSlide
        beforeslide.style.position = 'absolute'
        // this.state.beforeSlide.style.position='absolute'
    }

    onClickBack = () => {
        if (this.state.slideNumber === 1) this.setState({ slideNumber: 0 })
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Box display="flex" justifyContent="center">
                    <Card elevation={3} className={classes.card}>
                        <CardHeader className={classes.cardHead} style={{ minHeight: '48px' }}
                            title={
                                isWidthUp('sm', this.props.width) ?
                                    <Box display="flex" alignItems="center">
                                        {this.state.slideNumber < 2
                                            ? <IconButton style={{ marginRight: "10px" }} onClick={this.state.slideNumber === 0 ? () => this.props.history.goBack() : this.onClickBack}>
                                                <ArrowBackIcon style={{ color: "#0000008A" }} />
                                            </IconButton>
                                            : null}

                                        <img src={root.imgLogo} alt={root.site} className={classes.imgLogo} />

                                        <Typography style={{ color: "#0000008A", fontSize: "28px", marginLeft: "10px" }}>
                                            계정 만들기
                                        </Typography>
                                    </Box>
                                    :
                                    <Box>
                                        <Box display="flex" alignItems="center" justifyContent="center">
                                            <Box style={{ position: "absolute", left: "20px" }}>
                                                {this.state.slideNumber < 2
                                                    ? <IconButton onClick={this.state.slideNumber === 0 ? () => this.props.history.goBack() : this.onClickBack}>
                                                        <ArrowBackIcon style={{ color: "#0000008A" }} />
                                                    </IconButton>
                                                    : null}
                                            </Box>

                                            <img src={root.imgLogo} alt={root.site} className={classes.imgLogo} />
                                        </Box>

                                        <Box display="flex" justifyContent="center" style={{ paddingTop: "10px" }}>
                                            <Typography style={{ color: "#0000008A", fontSize: "28px", minWidth: "140px" }}>
                                                계정 만들기
                                            </Typography>
                                        </Box>
                                    </Box>
                            }
                        />
                        <form autoComplete="off">
                            <Box className={classes.cardBody}>
                                <Slide style={{ position: 'relative', }} direction="left" in={this.state.slideNumber === 0} timeout={{ exit: 0, enter: 0, }} mountOnEnter unmountOnExit onEnter={this.onEnterSlide.bind(this)} onExiting={this.onExitingSlide.bind(this)} onEntered={this.onEnteredSlide.bind(this)}>
                                    <CardContent style={{ padding: 0 }}>
                                        <TextField variant="outlined" onChange={this.handleChange.bind(this, "name")} error={this.state.nameerror}
                                            fullWidth label="이름" placeholder="이름을 입력해주세요." name="nickname" id="nickname" autoComplete="nickname" style={{ margin: "15px 0px 7.5px 0px" }} inputRef={this.textFieldRef[1]}
                                            helperText={this.state.nameerror ? "한글, 영어만 사용, 2~10자리" : false} onKeyPress={this.onKeyPress} spellCheck="false" />
                                        <TextField variant="outlined" onChange={this.handleChange.bind(this, "email")} error={this.state.emailerror || this.state.errorCode === 1}
                                            fullWidth label="이메일" placeholder="이메일을 입력해주세요." type="email" name="username" id="username" autoComplete="username" style={{ margin: "7.5px 0px" }} inputRef={this.textFieldRef[0]}
                                            helperText={this.state.emailerror ? "이메일 형식이 올바르지 않습니다." : false} onKeyPress={this.onKeyPress} spellCheck="false" />
                                        <TextField variant="outlined" onChange={this.handleChange.bind(this, "password")} error={this.state.passworderror}
                                            fullWidth label="비밀번호" placeholder="비밀번호를 입력해주세요." type="password" name="newPassword" id="newPassword" autoComplete="new-password" style={{ margin: "7.5px 0px" }} inputRef={this.textFieldRef[2]}
                                            helperText={this.state.passworderror ? "영어, 숫자, 특수문자 포함, 8~15자리" : false} onKeyPress={this.onKeyPress} />
                                        <TextField variant="outlined" onChange={this.handleChange.bind(this, "passwordcheck")} error={this.state.passwordcheckerror}
                                            fullWidth label="비밀번호 확인" placeholder="비밀번호를 한 번 더 입력해주세요." type="password" name="confimPassword" id="confimPassword" autoComplete="new-password" style={{ margin: "7.5px 0px 15px 0px" }} inputRef={this.textFieldRef[3]}
                                            helperText={this.state.passwordcheckerror ? "비밀번호가 다릅니다." : false} onKeyPress={this.onKeyPress} />


                                        <Box display="flex" style={{ marginTop: "10px" }}>
                                            <FormControlLabel label="이용약관 동의" className={classes.termsCheckBox} control={<Checkbox checked={this.state.termsChecked} onChange={this.handleChange.bind(this, "terms")} size="medium" value="termsChecked" color="primary" />} />
                                            <Button className={classes.termsButton} onClick={this.setDialogOpen.bind(this, true, 'terms')} style={{ textDecoration: 'none', marginLeft: "auto", maxHeight: '35px', minWidth: '105px' }}>이용약관</Button>
                                        </Box>
                                        <Box display="flex">
                                            <FormControlLabel label="개인정보처리방침 동의" className={classes.termsCheckBox} control={<Checkbox checked={this.state.privacyChecked} onChange={this.handleChange.bind(this, "privacy")} size="medium" value="privacyChecked" color="primary" />} />
                                            <Button className={classes.termsButton} onClick={this.setDialogOpen.bind(this, true, 'privacy')} style={{ textDecoration: 'none', marginLeft: "auto", maxHeight: '35px', minWidth: '105px' }}>개인정보처리방침</Button>
                                        </Box>
                                    </CardContent>
                                </Slide>

                                <Slide style={{ position: 'relative', }} direction="left" in={this.state.slideNumber === 1} timeout={{ exit: 0, enter: 500, }} mountOnEnter unmountOnExit onEnter={this.onEnterSlide.bind(this)} onExiting={this.onExitingSlide.bind(this)} onEntered={this.onEnteredSlide.bind(this)}>
                                    <CardContent style={{ padding: 0 }}>
                                        <Box height='388px'>
                                            <Typography style={{ color: '#0000008A', fontFamily: 'NotoSansKR-Regular' }}>생년월일 (선택사항)</Typography>
                                            <Box display="flex" mt={2}>
                                                <TextField fullWidth variant="outlined" value={this.state.year || ""} onChange={event => this.handleChangeBirthday(event.target.value, "year")}
                                                    label={"연"} style={{ minWidth: "120px" }} spellCheck="false" inputRef={this.textFieldRefBirthday[0]} />

                                                <FormControl variant="outlined" className={classes.formControl} style={{ width: "100%" }}>
                                                    <InputLabel id="demo-simple-select-outlined-label">월</InputLabel>
                                                    <Select labelId="demo-simple-select-outlined-label" id="demo-simple-select-outlined" value={this.state.month} onChange={event => this.handleChangeBirthday(event.target.value, "month")} label="월" >
                                                        <MenuItem value={"01"}>1월</MenuItem> <MenuItem value={"02"}>2월</MenuItem> <MenuItem value={"03"}>3월</MenuItem>
                                                        <MenuItem value={"04"}>4월</MenuItem> <MenuItem value={"05"}>5월</MenuItem> <MenuItem value={"06"}>6월</MenuItem>
                                                        <MenuItem value={"07"}>7월</MenuItem> <MenuItem value={"08"}>8월</MenuItem> <MenuItem value={"09"}>9월</MenuItem>
                                                        <MenuItem value={"10"}>10월</MenuItem> <MenuItem value={"11"}>11월</MenuItem> <MenuItem value={"12"}>12월</MenuItem>
                                                    </Select>
                                                </FormControl>

                                                <TextField fullWidth variant="outlined" value={this.state.date || ""} onChange={event => this.handleChangeBirthday(event.target.value, "date")}
                                                    label={"일"} style={{ width: "100%" }} spellCheck="false" inputRef={this.textFieldRefBirthday[1]} />
                                            </Box>

                                            <Typography variant="body2" style={{ fontFamily: "NotoSansKR-Regular", color: "#f44336", marginTop: "3px" }}>
                                                &nbsp;{this.state.errorMassage}&nbsp;
                                            </Typography>

                                            <FormControl variant="outlined" style={{ width: '100%', marginTop: "10px" }}>
                                                <InputLabel htmlFor="gender">성별 (선택사항)</InputLabel>
                                                <Select native label="성별 (선택사항)" labelId='gender' onChange={this.handleChangeGender} defaultValue=''>
                                                    <option aria-label="None" value="" disabled hidden />
                                                    <option value={"여성"}>여성</option>
                                                    <option value={"남성"}>남성</option>
                                                    <option value={"공개 안함"}>공개 안함</option>
                                                    <option value={"사용자 지정"}>사용자 지정</option>
                                                </Select>
                                            </FormControl>

                                            <TextField fullWidth variant="outlined" value={this.state.genderCustom || ''} label="성별 입력" style={{ width: "100%", marginTop: "10px" }} onChange={this.handleChangeGenderCustom}
                                                className={clsx("none", { [classes.displayNone]: this.state.genderCurrent !== "사용자 지정" })}
                                                error={this.state.genderError === -2} inputRef={this.textFieldRefGender[0]}
                                                helperText={this.state.genderError === -2 ? "사용자 지정 성별을 입력해주세요." : false} />
                                        </Box>
                                    </CardContent>
                                </Slide>

                                <Slide style={{ position: 'relative', }} direction="left" in={this.state.slideNumber === 2} timeout={{ exit: 0, enter: 500, }} mountOnEnter unmountOnExit onEnter={this.onEnterSlide.bind(this)} onExiting={this.onExitingSlide.bind(this)} onEntered={this.onEnteredSlide.bind(this)}>
                                    <CardContent style={{ padding: 0 }}>
                                        <Box height='auto' mt={2}>
                                            <Typography variant='subtitle1' align="center" style={{ color: '#0000008A' }}>
                                                인증 번호가 <span style={{ color: root.PrimaryColor }}>{this.state.email}</span>(으)로 전송되었습니다.<br /><br /><br />
                                            </Typography>
                                        </Box>
                                        <TextField variant="outlined" onChange={this.handleChange.bind(this, "certNumber")} error={this.state.certError}
                                                fullWidth label="인증 번호" placeholder="인증 번호를 입력해주세요." style={{ margin: "15px 0px 7.5px 0px" }} inputRef={this.textFieldRef[1]}
                                                helperText={this.state.certError ? "인증 번호가 다릅니다." : false} onKeyPress={this.onKeyPress} spellCheck="false" />
                                        <Box height='auto' mt={5}>
                                            <Typography variant='subtitle2' align="center" style={{ color: '#0000008A' }}>
                                                이메일을 확인할 수 없나요?<br />
                                                스팸편지함 확인 또는 <span onClick={this.onClickSendMail} style={{ color: root.PrimaryColor, cursor: 'pointer' }}>인증 메일 다시 보내기</span>
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Slide>
                            </Box>
                        </form>

                        <CardActions className={classes.signupButtonLayout}>
                            <Button onClick={this.onClickSignup} className={classes.signupButton}>
                                다음
                            </Button>
                        </CardActions>
                    </Card >
                </Box >

                <Snackbar open={this.state.errorCode !== 0} autoHideDuration={3000} onClose={this.snackBarHandleClose}>
                    <Alert severity="error">
                        {
                            (this.state.errorCode === 1 && "해당 이메일로 가입한 계정이 존재합니다.") ||
                            (this.state.errorCode === 2 && "인증 번호가 다릅니다.") ||
                            (this.state.errorCode === 3 && "인증 상태가 아닙니다.") ||
                            (this.state.errorCode === 4 && "더 이상 인증 메일을 보낼 수 없습니다.") ||
                            (this.state.errorCode === 5 && "죄송합니다. 서버에 오류가 발생하여 처리할 수가 없습니다.")
                        }
                    </Alert>
                </Snackbar>

                <Snackbar open={this.state.emailSendMessage} autoHideDuration={3000} onClose={this.snackBarHandleClose}>
                    <Alert severity="success">
                        인증 메일을 전송했습니다.<br />(남은 전송 횟수: {this.state.emailSendCount})
                    </Alert>
                </Snackbar>

                <Snackbar open={this.state.termsCheckederror} autoHideDuration={3000} onClose={this.snackBarHandleClose}>
                    <Alert severity="error">
                        이용약관에 동의해주세요.
                    </Alert>
                </Snackbar>

                <Snackbar open={this.state.privacyCheckederror} autoHideDuration={3000} onClose={this.snackBarHandleClose}>
                    <Alert severity="error">
                        개인정보처리방침에 동의해주세요.
                    </Alert>
                </Snackbar>
                <DialogContents DialogContentState={this.state.dialogOpen} setDialogContentState={this.setDialogOpen} contentType={this.state.dialogContentType} />
            </div>
        )
    }
}

export default withStyles(useStyles)(withWidth()(withRouter(Signup)));
