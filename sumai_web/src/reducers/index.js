// combineReducers 를 이용해 여러개의 리듀서를 합치는 역할을 하는 파일입니다.
import authentication from './authentication';
import { combineReducers } from 'redux';
 
export default combineReducers({
    authentication
});