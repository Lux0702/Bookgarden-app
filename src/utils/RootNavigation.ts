import {NavigationContainerRef} from '@react-navigation/native';
import React from 'react';

// Tạo một biến ref global để lưu trữ navigation container
export const navigationRef = React.createRef<NavigationContainerRef<any>>();

// Tạo một hàm navigate tự định nghĩa để sử dụng với navigationRef
export function navigate(name: string, params?: object) {
  console.log('Navigate to:', name, 'with params:', params);
  navigationRef.current?.navigate(name, params);
}
