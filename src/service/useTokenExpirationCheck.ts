import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE} from '../utils/utils';
import {decode as base64Decode} from 'base-64'; // Import hàm decode từ react-native-base64
import {useState} from 'react';
interface tokenProp {
  accessToken: string;
  refreshToken: string;
}
export const useTokenExpirationCheck = () => {
  const [IsChange, setIsChange] = useState(false);
  const refreshAccessToken = async (token: tokenProp) => {
    console.log('Bắt đầu refresh token');
    console.log('kiem tra token:', token.refreshToken);
    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({refreshToken: token.refreshToken}),
      });

      if (response.ok) {
        const tokenNew = await response.json();
        console.log('Refresh token thành công');
        setIsChange(true);
        await AsyncStorage.setItem('token', JSON.stringify(tokenNew.data));
      } else {
        // Xử lý khi refresh token không thành công, có thể yêu cầu đăng nhập lại
        const data = await response.json();
        console.log('Lỗi khi refresh token:', data.message);
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Lỗi kết nối khi refresh token:', error);
      throw error;
    }
  };

  const checkTokenExpiration = async () => {
    try {
      console.log('Kiểm tra token expiration');
      const tokenFromStorage = await AsyncStorage.getItem('token');
      console.log('token re:', tokenFromStorage);
      if (tokenFromStorage) {
        const token = JSON.parse(tokenFromStorage);
        const encodedPayload = token.accessToken.split('.')[1]; // Lấy phần payload của token
        const decodedPayload = base64Decode(encodedPayload); // Giải mã payload

        const parsedPayload = JSON.parse(decodedPayload);
        const expirationTime = parsedPayload.exp * 1000; // Đổi từ giây sang mili giây

        const currentTime = Date.now();
        console.log('Expiration time:', expirationTime);
        console.log('Current time:', currentTime);
        if (expirationTime < currentTime) {
          console.log('re là :', token.refreshToken);
          await refreshAccessToken(token);
        } else {
          console.log('token còn hạn');
        }
      }
    } catch (error) {
      console.log('Lỗi khi kiểm tra token expiration:', error);
    }
  };

  return {IsChange, checkTokenExpiration};
};
