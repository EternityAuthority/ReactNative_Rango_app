import * as React from 'react';
import {StackActions} from '@react-navigation/native';
export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function replace(...args) {
  navigationRef.current?.dispatch(StackActions.replace(...args));
}

export function goBack() {
  navigationRef.current?.goBack();
}

export function canGoBack() {
  return navigationRef.current?.canGoBack();
}

// add other navigation functions that you need and export them
