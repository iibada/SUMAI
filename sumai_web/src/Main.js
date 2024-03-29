import React from 'react';
import './components/Main.css';
import './componentsMob/MainMob.css';

import Header from "./components/header/Header";
import Body from "./components/Body";
import RecordLastest from "./components/RecordLastest";
import RecordRecommend from "./components/RecordRecommend";
import BodyMob from "./componentsMob/Body";
import Box from '@material-ui/core/Box';

import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import axios from 'axios';

import { connect } from 'react-redux';
import { logoutRequest } from './actions/authentication';

class Main extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      text: '',
      summaryText: '',
      fontSizeTextArea: 22,
      fontSizeSummary: 22,

      loading: false,
      error: null,

      textLimitTag: false,
      summaryLayoutTag: false,
      fabTag: false,

      convertSort: false,

      record: true,

      ip: '',
      refresh: false,
    }
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(json => this.unmount ? null : this.setState({ ip: json.ip }))
  }

  componentDidMount() {
    this.unmount = false;
  }

  componentWillUnmount() {
    this.unmount = true;
  }

  convertSortFunction = (convert) => {
    this.setState({
      convertSort: convert
    })
  }
  handleLogout = () => {
    this.props.logoutRequest().then(
      () => {
        let domainIndex = window.location.hostname.indexOf('.') // ex) asdf.good.com -> 5 (.의 위치)
        let domainName
        if (domainIndex === -1) domainName = window.location.hostname // .을 못 찾은 경우 그대로 씀 -> localhost
        else domainName = window.location.hostname.substr(domainIndex) // .이 있는 경우 -> .good.com
        // EMPTIES THE SESSION
        let loginData = {
          isLoggedIn: false,
          email: ''
        };
        document.cookie = 'key=' + btoa(JSON.stringify(loginData)) + ';domain=' + domainName + ';path=/;';
        window.location.reload()
      }
    );
  }

  handleChange = (e) => {
    if (e.target.value.length === 0) {
      this.setState({
        summaryLayoutTag: false,
      })
    }

    if (100 < e.target.value.length) {
      this.setState({
        fontSizeTextArea: 18,
      })
    } else {
      this.setState({
        fontSizeTextArea: 22,
      })
    }

    if (e.target.value.length <= 5000) {
      this.setState({
        text: e.target.value,
        textLimitTag: null,
      })
    } else {
      this.setState({
        text: e.target.value.substring(0, 5000),
      })
    }

    if (e.target.value.length >= 5000) {
      this.setState({
        textLimitTag: true,
      })
    } else {
      this.setState({
        textLimitTag: false,
      })
    }
  }

  onClick = (e) => {
    if (100 < this.state.text.length) {
      this.setState({
        fontSizeSummary: 18,
      })
    } else {
      this.setState({
        fontSizeSummary: 22,
      })
    }

    this.setState({
      summaryText: this.state.text,
    })

    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  textRemove = () => {
    this.setState({
      text: '',
      summaryText: '',
      textLimitTag: false,
      fontSizeTextArea: 22,
      fontSizeSummary: 22,
      summaryLayoutTag: false,
    })
  }

  setRecordCookie = (name, value) => {
    document.cookie = name + '=' + value + ';path=/;';
  };

  onClickRecord = () => {
    this.setRecordCookie("record", !this.state.record)
    this.setState({ record: !this.state.record })
  }
  recordTrue = () => {
    this.setRecordCookie("record", true)
    this.setState({ record: true })
  }
  recordFalse = () => {
    this.setRecordCookie("record", false)
    this.setState({ record: false })
  }

  recordFalseMob = () => {
    this.setState({ record: false })
  }

  fetchUsers = async () => {
    try {
      this.setState({
        error: null,
        summaryText: '',
        loading: true,
      })

      const response = await axios.post(
        'https://www.sumai.co.kr/api/summary/request',
        {
          data: this.state.text,
          id: this.props.status.currentId,
          record: this.state.record,
        }
      );
      if (isWidthUp('md', this.props.width)) window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      this.setState({
        summaryText: response.data.summarize,
        refresh: this.state.record ? !this.state.refresh : this.state.refresh
      })

      if (0 < this.state.summaryText.length) {
        this.setState({
          summaryLayoutTag: true,
        })
      } else {
        this.setState({
          summaryLayoutTag: false,
        })
      }

    } catch (e) {
      this.setState({
        error: true,
      })
    }
    this.setState({
      loading: false,
    })
  };


  errorSet = () => {
    this.setState({
      error: null,
    })
  }

  onClickLink = (url) => {
    setTimeout(function () {
      this.props.history.push(url)
    }.bind(this), 0);
  }

  render() {
    return (
      <>
        {[''].map((key) => {
          const isWidth = isWidthUp('md', this.props.width)
          return (
            <div key={key}>
              {isWidth ?
                <div>
                  <Header isLoggedIn={this.props.status.isLoggedIn} currentUser={this.props.status.currentUser} currentId={this.props.status.currentId}
                    onLogout={this.handleLogout} onClickLink={this.onClickLink} matches={isWidthUp('md', this.props.width)} />
                  <Body state={this.state} handleChange={this.handleChange} onClick={this.onClick} textRemove={this.textRemove} onClickRecord={this.onClickRecord}
                    recordTrue={this.recordTrue} recordFalse={this.recordFalse} fetchUsers={this.fetchUsers} errorSet={this.errorSet} />
                </div> :
                <div className="MainMob">
                  <Header isLoggedIn={this.props.status.isLoggedIn} currentUser={this.props.status.currentUser} currentId={this.props.status.currentId}
                    onLogout={this.handleLogout} onClickLink={this.onClickLink} matches={isWidthUp('md', this.props.width)} />
                  <BodyMob state={this.state} handleChange={this.handleChange} textRemove={this.textRemove}
                    recordFalseMob={this.recordFalseMob} fetchUsers={this.fetchUsers} errorSet={this.errorSet} />
                </div>}
              <Box display="flex" alignItems="center" style={isWidth ? { width: "100%" } : { display: "none" }}>
                <ins className="kakao_ad_area" style={{ display: 'none' }}
                  data-ad-unit="DAN-99dFqz7hNrCGBNUn"
                  data-ad-width="728"
                  data-ad-height="90"></ins>
              </Box>
              {isWidth ?
                <div>
                  {this.state.convertSort ? <RecordRecommend convertSortFunction={this.convertSortFunction} ip={this.state.ip} /> :
                    <RecordLastest convertSortFunction={this.convertSortFunction} ip={this.state.ip} key={this.state.refresh} />}
                </div> : null}
            </div>)
        })}
      </>)

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

export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(Main));
