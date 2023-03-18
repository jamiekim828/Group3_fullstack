import axios from 'axios';
import Cookies from 'js-cookie'

import { AppDispatch } from '../store';
import { userActions } from '../slices/user';
import { LoginUserType, UserDataType, UserType } from '../../types/type';
import { PORT } from '../../port/Port';

const url = `http://localhost:${PORT}/user`;

export function registerUser(user: UserType) {
  return async (dispatch: AppDispatch) => {
    await axios
      .post(url, user)
      .then((res) => {
        if (res.status === 200) {
          dispatch(userActions.setMessage('Register Success. Please log in.'));
        } 
      })
      .catch((err) => {
        const {message} = err.response.data
        dispatch(userActions.setMessage(message))});
  };
}

export function loginUserThunk(user: LoginUserType) {
  return async (dispatch: AppDispatch) => {
    await axios
      .post(`${url}/login`, user)
      .then((res) => {
        if (res.status === 200) {
          const token = res.data.token;
          localStorage.setItem('userToken', token);
          Cookies.set('userToken', token, { expires: 7 });
          dispatch(userActions.loginAction(true))
          dispatch(userActions.getLoginUser(res.data.userData))
          dispatch(userActions.setMessage(res.data.message))
        }
        if (res.status === 400 || res.status === 500) {
          dispatch(userActions.loginAction(false))
          dispatch(userActions.getLoginUser(null))
          dispatch(userActions.setMessage(res.data.message))
        }
      })
      .catch((err) => dispatch(userActions.setMessage('Server error')));
  };
}

export function getAllUserData() {
  return async (dispatch: AppDispatch) => {
    const response = await axios.get(`${url}`)
    const userData = await response.data
    dispatch(userActions.getAllUsers(userData))
  }
}

export function getUserByLogInUserId(id:string) {
  return async (dispatch: AppDispatch) => {
    const response = await axios.get(`${url}/${id}`)
    // dispatch(userActions.getLoginUser(response.data))
  }
}

export function addBookToUserBookShelf(userId:string, bookId:string) {
  return async(dispatch:AppDispatch) => {
    const response = await axios.post(`${url}/${userId}/${bookId}`)
    console.log(response,'hey!')
  }
}