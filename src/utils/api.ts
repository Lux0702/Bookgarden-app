import {useState} from 'react';
import {API_BASE} from './utils';
import Toast from 'react-native-toast-message';
import {useNotification} from '../service/useNotification';
import notifee, {EventType} from '@notifee/react-native';
import { navigationRef } from './RootNavigation';
interface filterProp {
  filters: {
    categories: string[];
    authors: string[];
    minPrice: number;
    maxPrice: number;
    sortBy: number;
  };
}
interface Book {
  _id: string;
  title: string;
  image: any;
  price: number;
  soldQuantity: number;
  description: string;
  stock: number;
  publisher: string;
  publishedDate: string;
  language: string;
  pageNumbers: string;
  isbn: string;
  categories: [{id: string; categoryName: string}];
  authors: [{id: string; authorName: string}];
  reviews: [
    {
      id: string;
      user: {
        id: string;
        fullname: string;
        avatar: string;
      };
      review: string;
      rating: number;
    },
  ];
}
interface SearchKey {
  searchKey: string;
}
interface tokenProp {
  accessToken: string;
  refreshToken: string;
}
interface CartProp {
  _id: string;
  book: Book;
  quantity: number;
}
// interface User{

// }
export const useWishlistData = ({token}: {token: tokenProp | null}) => {
  const [wishlist, setWishlist] = useState([]);
  console.log('token la:', token?.accessToken);
  // console.log('refresh token la:', token?.refreshToken);
  const fetchWishlist = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/customer/wishList`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token?.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setWishlist(data.data);
        console.log('get wish list success:');
      } else {
        const data = await response.json();
        console.log('Lỗi fetching wishlist data:', data.message);
      }
    } catch (error) {
      console.log('Error fetching wishlist data:', error);
    }
  };

  return {wishlist, fetchWishlist};
};
export const useCartData = ({token}: {token: tokenProp | null}) => {
  const [cart, setCart] = useState<CartProp[]>([]);
  console.log('token la:', token?.accessToken);
  // console.log('refresh token la:', token?.refreshToken);
  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/customer/cart`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token?.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData.data.items);
        console.log('get cart list success:');
      } else {
        const data = await response.json();
        console.log('Lỗi lấy dữ liêu cart data:', data.message);
      }
    } catch (error) {
      console.log('Error connect fetching cart data:', error);
    }
  };

  return {cart, fetchCart};
};
export const useCategoryData = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data);
      } else {
        console.log('Error fetching category data:', response.statusText);
      }
    } catch (error) {
      console.log('Error fetching category data:', error);
    }
  };

  return {categories, fetchCategory};
};
export const useAuthorsData = () => {
  const [authors, setAuthors] = useState([]);

  const fetchAuthors = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/authors`);
      if (response.ok) {
        const data = await response.json();
        setAuthors(data.data);
      } else {
        console.log('Error fetching authors data:', response.statusText);
      }
    } catch (error) {
      console.log('Error fetching authors data:', error);
    }
  };

  return {authors, fetchAuthors};
};
export const useBookData = ({filters}: filterProp, {searchKey}: SearchKey) => {
  console.log('filter book:', filters);
  console.log('filter book type:', typeof filters);
  const [books, setBooks] = useState<Book | null>(null);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/books`);
      if (response.ok) {
        const bookData = await response.json();
        //price
        let filteredBooks = bookData.data;
        if (filters.minPrice !== 0 && filteredBooks !== 2000000) {
          filteredBooks = filteredBooks.filter((book: Book) => {
            const price = book.price || 0;
            return price >= filters.minPrice && price <= filters.maxPrice;
          });
        }
        // console.log('amount book:', filteredBooks.length);
        //bestseller
        if (filters.sortBy === 0) {
          filteredBooks = filteredBooks.sort(
            (a: {soldQuantity: number}, b: {soldQuantity: number}) =>
              b.soldQuantity - a.soldQuantity,
          );
        }
        if (filters.sortBy === 1) {
          filteredBooks = filteredBooks.sort(
            (a: {price: number}, b: {price: number}) => a.price - b.price,
          );
        }
        if (filters.sortBy === 2) {
          filteredBooks = filteredBooks.sort(
            (a: {price: number}, b: {price: number}) => b.price - a.price,
          );
        }
        if (filters.sortBy === 3) {
          filteredBooks = filteredBooks.sort(
            (a: {title: string}, b: {title: string}) =>
              a.title.localeCompare(b.title),
          );
        }
        if (filters.sortBy === 4) {
          filteredBooks = filteredBooks.sort(
            (a: {title: string}, b: {title: string}) =>
              b.title.localeCompare(a.title),
          );
        }
        //filter category
        if (filters.categories && filters.categories.length > 0) {
          filteredBooks = filteredBooks.filter((book: Book) => {
            return book.categories.some(category =>
              filters.categories.includes(category.categoryName),
            );
          });
        }
        //filter author
        if (filters.authors && filters.authors.length > 0) {
          filteredBooks = filteredBooks.filter((book: Book) => {
            return book.authors.some(author =>
              filters.authors.includes(author.authorName),
            );
          });
        }
        if (searchKey && searchKey !== '') {
          filteredBooks = filteredBooks.filter((book: Book) => {
            return book.title.includes(searchKey);
          });
        }
        setBooks(filteredBooks);
        console.log('Get data book success');
      } else {
        console.error('Error fetching books:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  return {books, fetchBooks};
};
export const BestSeller = () => {
  const [bestbooks, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/books/best-seller`);
      if (response.ok) {
        const book = await response.json();
        setBooks(book.data);
        //localStorage.setItem('bookData',JSON.stringify(book.data))
        console.log('Get data book success');
      } else {
        console.error('Error fetching books:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  return {bestbooks, fetchBooks};
};
export const AppointBook = () => {
  const [appointBook, setBooks] = useState([]);
  const fetchAppointBooks = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/books`);
      if (response.ok) {
        const books = await response.json();
        const sortedBooks = books.data;
        // .sort(
        //   (a: {soldQuantity: number}, b: {soldQuantity: number}) =>
        //     b.soldQuantity - a.soldQuantity,
        // )
        // .slice(0, 10);
        setBooks(sortedBooks);
        console.log('Get data book success AppointBook');
      } else {
        console.log('Error fetching books:', response.statusText);
      }
    } catch (error) {
      console.log('Error fetching books:', error);
    }
  };
  return {appointBook, fetchAppointBooks};
};
interface BookDetailProp {
  bookId: string;
}
interface id {
  id: string;
}

export const useAddWish = ({
  token,
  bookId,
}: {
  token: tokenProp | null;
  bookId: id;
}) => {
  const fetchAddWish = async () => {
    console.log('Toke & id: ', token?.accessToken, bookId);
    try {
      const response = await fetch(
        `${API_BASE}/api/v1/books/${bookId}/addToWishList`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token?.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        const updatedData = await response.json();
        console.log('Add successfully:', updatedData.message);
        Toast.show({
          type: 'success',
          text1: 'Thêm vào yêu thích ',
          text2: 'Thêm thành công',
        });
      } else {
        const updatedData = await response.json();
        console.log('Lỗi add list:', updatedData.message);
        Toast.show({
          type: 'info',
          text1: 'Thêm vào yêu thích ',
          text2: updatedData.message,
        });
      }
    } catch (error) {
      console.error('Lỗi kết nối wishlist:', error);
    }
  };
  return {fetchAddWish};
};
export const useDeleteWish = ({token}: {token: tokenProp | null}) => {
  const fetchDeleteWish = async (bookId: string) => {
    console.log('Toke & id xoa la: ', token?.accessToken, bookId);
    try {
      const response = await fetch(
        `${API_BASE}/api/v1/customer/wishList/${bookId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token?.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        const updatedData = await response.json();
        console.log('Add successfully:', updatedData.message);
        Toast.show({
          type: 'success',
          text1: 'Thêm vào yêu thích ',
          text2: 'Xóa thành công',
        });
      } else {
        const updatedData = await response.json();
        console.log('Lỗi xóa book list:', updatedData.message);
        Toast.show({
          type: 'info',
          text1: 'Thêm vào yêu thích ',
          text2: updatedData.message || 'Lỗi xóa khỏi danh sách',
        });
      }
    } catch (error) {
      console.error('Lỗi kết nối wishlist:', error);
    }
  };
  return {fetchDeleteWish};
};

export const useBookDetail = ({bookId}: BookDetailProp) => {
  const [detailBook, setBooks] = useState<Book | null>(null);
  const fetchDetail = async () => {
    console.log('ID book detail', bookId);
    console.log('ID book detail type', typeof bookId);
    try {
      const response = await fetch(`${API_BASE}/api/v1/books/${bookId}`);
      if (response.ok) {
        const books = await response.json();
        setBooks(books.data);
        console.log('Get data book detail success');
      } else {
        const error = await response.json();
        console.log('Error get books:', error.message); // In ra thông điệp lỗi từ máy chủ
      }
    } catch (error) {
      console.log('Error fetching books:', error);
    }
  };

  return {detailBook, fetchDetail};
};

export const useBookRelate = ({bookId}: BookDetailProp) => {
  const [relateBook, setBooks] = useState<Book | null>(null);
  const fetchRelate = async () => {
    console.log('ID book relate', bookId);
    // console.log('ID book detail type', typeof bookId);
    try {
      const response = await fetch(
        `${API_BASE}/api/v1/books/${bookId}/related`,
      );
      if (response.ok) {
        const books = await response.json();
        setBooks(books.data);
        console.log('Get data book relate success');
      } else {
        const error = await response.json();
        console.log('Error get relate books:', error.message); // In ra thông điệp lỗi từ máy chủ
      }
    } catch (error) {
      console.log('Error fetching relate books:', error);
    }
  };
  return {relateBook, fetchRelate};
};
interface user {
  userId: string;
  fullName: string;
  email: string;
  avatar: string;
  role: string;
  phone: string;
  points: 0;
  birthday: string;
  gender: string;
  addresses: [
    {
      id: string;
      address: string;
    },
  ];
}
export const useProfileData = ({token}: {token: tokenProp | null}) => {
  const [userData, setUserData] = useState<user | null>(null);
  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/user/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.data);
        console.log('get user success');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };
  return {userData, fetchProfileData};
};
export const useUpdateProfile = ({token}: {token: tokenProp | null}) => {
  const fetchUpdateProfile = async (user: user) => {
    try {
      const formData = new FormData();
      formData.append('fullName', user.fullName);
      formData.append('phone', user.phone);
      formData.append('gender', user.gender);
      formData.append('birthday', user.birthday);
      if (user.avatar) {
        const avatarFile = {
          uri: user.avatar,
          type: 'image/*',
          name: user.avatar.split('/').pop(),
        };
        console.log('ava ', avatarFile);
        formData.append('avatar', avatarFile);
      }
      const response = await fetch(
        `${API_BASE}/api/v1/user/profile/updateProfile`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token?.accessToken}`,
          },
          body: formData,
        },
      );

      if (response.ok) {
        console.log('get update user success');
        Toast.show({
          type: 'success',
          text1: 'Thông tin cá nhân ',
          text2: 'Cập nhật thành công',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Thông tin cá nhân ',
          text2: 'Lỗi cập nhật thông tin',
        });
      }
    } catch (error) {
      console.error('Error fetching update profile data:', error);
    }
  };
  return {fetchUpdateProfile};
};
interface address {
  address: string[];
}
export const useUpdateAddress = (
  {token}: {token: tokenProp | null},
  {navigation}: any,
) => {
  const fetchUpdateAddress = async (addresses: address) => {
    try {
      console.log('update address:', addresses);
      const response = await fetch(
        `${API_BASE}/api/v1/user/profile/updateAddresses`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token?.accessToken}`,
          },
          body: JSON.stringify({addresses: addresses}),
        },
      );

      if (response.ok) {
        console.log('get update address success');
        Toast.show({
          type: 'success',
          text1: 'Cập nhật địa chỉ mới ',
          text2: 'Cập nhật thành công',
        });
        setTimeout(() => {
          // console.log('data user add success', userData);
          navigation.replace('AddressPage');
        }, 1000);
      } else {
        const error = await response.json();
        Toast.show({
          type: 'error',
          text1: 'Cập nhật địa chỉ mới ',
          text2: error.message || 'Lỗi cập nhật thông tin',
        });
      }
    } catch (error) {
      console.error('Error fetching update address data:', error);
    }
  };
  return {fetchUpdateAddress};
};

export const useAddToCart = ({
  token,
  bookId,
  quantity,
}: {
  token: tokenProp | null;
  bookId: id;
  quantity: number;
}) => {
  const fetchAddToCart = async () => {
    console.log('Toke & id cart: ', token?.accessToken, bookId);
    console.log('Quantity:', quantity);
    console.log('Quantity of:', typeof quantity);
    try {
      const response = await fetch(
        `${API_BASE}/api/v1/books/${bookId}/addToCart`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token?.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookID: bookId,
            quantity: quantity,
          }),
        },
      );

      if (response.ok) {
        const updatedData = await response.json();
        console.log('Add successfully:', updatedData.message);
        Toast.show({
          type: 'success',
          text1: 'Thêm vào giỏ hàng ',
          text2: 'Thêm thành công',
        });
      } else {
        const updatedData = await response.json();
        console.log(
          'Lỗi thêm vào cart:',
          updatedData.message || 'Lỗi thêm sản phẩm',
        );
        Toast.show({
          type: 'error',
          text1: 'Thêm vào giỏ hàng ',
          text2: updatedData.message
            ? updatedData.message
            : 'Lỗi thêm sản phẩm',
        });
      }
    } catch (error) {
      console.error('Lỗi kết nối wishlist:', error);
    }
  };
  return {fetchAddToCart};
};
export const useReview = ({
  token,
  rating,
  review,
}: {
  token: tokenProp | null;
  rating: number;
  review: string;
}) => {
  const {displayTriggerNotification} = useNotification();
  notifee.onBackgroundEvent(async ({type, detail}) => {
    console.log('Background event:', type, detail);
  });
  const fetchReview = async (bookId: string) => {
    console.log('Toke & id cart: ', token?.accessToken, bookId);
    console.log('id cart: ', bookId);
    console.log('rating:', rating);
    try {
      const response = await fetch(
        `${API_BASE}/api/v1/customer/${bookId}/review`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token?.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            review: review,
            rating: rating,
          }),
        },
      );

      if (response.ok) {
        const updatedData = await response.json();
        console.log('Add successfully:', updatedData.message);
        Toast.show({
          type: 'success',
          text1: 'Đánh giá sản phẩm ',
          text2: 'Đánh giá thành công',
        });
        displayTriggerNotification(
          'TĐánh giá sản phẩm',
          'Cảm ơn bạn đã đánh giá sản phẩm',
          Date.now() + 3000,
        );
      } else {
        const updatedData = await response.json();
        console.log(
          'Lỗi thêm vào cart:',
          updatedData.message || 'Lỗi thêm sản phẩm',
        );
        Toast.show({
          type: 'error',
          text1: 'Đánh giá sản phẩm ',
          text2: updatedData.message
            ? updatedData.message
            : 'Lỗi thêm sản phẩm',
        });
      }
    } catch (error) {
      console.error('Lỗi kết nối review:', error);
    }
  };
  return {fetchReview};
};
export const useDeleteCartItem = ({token}: {token: tokenProp | null}) => {
  const fetchDeleteCartItem = async (bookId: id) => {
    console.log('Toke & id cart: ', token?.accessToken, bookId);
    try {
      const response = await fetch(
        `${API_BASE}/api/v1/customer/cart/removeCartItem`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token?.accessToken}`,
          },
          body: JSON.stringify({
            cartItemID: bookId,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        Toast.show({
          type: 'success',
          text1: 'Giỏ hàng ',
          text2: data.message || 'Xóa thành công',
        });
      } else {
        const data = await response.json();
        console.log(
          'Đã xảy ra lỗi khi xóa sản phẩm:',
          data.message || 'Lỗi xóa',
        );
      }
    } catch (error) {
      console.log('Đã xảy ra lỗi khi gửi yêu cầu DELETE:', error);
    }
  };
  return {fetchDeleteCartItem};
};
export const useUploadCartItem = ({token}: {token: tokenProp | null}) => {
  const fetchUploadCartItem = async ({
    bookId,
    quantity,
  }: {
    bookId: id;
    quantity: number;
  }) => {
    console.log('Toke & id cart upload: ', token?.accessToken, bookId);
    console.log('Quantity upload:', quantity);
    try {
      const response = await fetch(
        `${API_BASE}/api/v1/customer/cart/updateCartItem`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token?.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookID: bookId,
            quantity: quantity,
          }),
        },
      );

      if (response.ok) {
        const updatedData = await response.json();
        console.log('Add successfully:', updatedData.message);
      } else {
        const updatedData = await response.json();
        console.log(
          'Lỗi cập nhật cart:',
          updatedData.message || 'Lỗi cập nhật sản phẩm',
        );
      }
    } catch (error) {
      console.log('Lỗi kết nối wishlist:', error);
    }
  };
  return {fetchUploadCartItem};
};
interface CartData {
  cartItems: string[];
}
interface infoOder {
  fullName: string;
  phone: string;
  address: string;
  payMethod: string;
  totalPrice: number;
}
export const useOrder = ({token}: {token: tokenProp | null}) => {
  const {displayTriggerNotification} = useNotification();
  notifee.onBackgroundEvent(async ({type, detail}) => {
    console.log('Background event:', type, detail);
  });
  const fetchOrderCart = async ({
    cartItem,
    info,
  }: {
    cartItem: CartData;
    info: infoOder;
  }) => {
    console.log('Toke & id cart upload: ', token?.accessToken);
    console.log('Quantity upload:', info);
    console.log('cartItem order data:', cartItem);
    console.log(
      'data order:',
      info.totalPrice,
      info.fullName,
      info.address,
      info.phone,
      info.payMethod,
    );

    try {
      const response = await fetch(
        `${API_BASE}/api/v1/customer/orders/create`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token?.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cartItems: cartItem,
            totalAmount: info.totalPrice,
            fullName: info.fullName,
            address: info.address,
            phone: info.phone,
            paymentMethod: info.payMethod,
          }),
        },
      );

      if (response.ok) {
        const updatedData = await response.json();
        console.log('order successfully:', updatedData.message);
        setTimeout(() => {
          Toast.show({
            type: 'success',
            text1: 'Đặt hàng ',
            text2: 'Đặt hàng thành công',
          });
          displayTriggerNotification(
            'Thông báo đơn hàng',
            'Bạn vừa đặt hàng thành công, truy cập lịch sử mua hàng để xem chi tiết',
            Date.now() + 4000,
          );
        }, 3000);
      } else {
        const updatedData = await response.json();
        console.log(
          'Lỗi cập nhật order:',
          updatedData.message || 'Lỗi order sản phẩm',
        );
        Toast.show({
          type: 'error',
          text1: 'Đặt hàng ',
          text2: 'Đặt hàng không thành công',
        });
      }
    } catch (error) {
      console.log('Lỗi kết nối order:', error);
    }
  };
  return {fetchOrderCart};
};
interface historyProp {
  _id: string;
  user: string;
  totalAmount: number;
  orderItems: CartProp[];
  fullName: string;
  address: string;
  phone: string;
  status: string;
  orderDate: string;
  paymentMethod: string;
  paymentDate: string;
  paymentAmount: number;
  paymentStatus: string;
}
export const useHistoryData = ({token}: {token: tokenProp | null}) => {
  const [historyOrder, setHistoryOrder] = useState<historyProp[]>([]);
  console.log('token la:', token?.accessToken);
  // console.log('refresh token la:', token?.refreshToken);
  const fetcHistoryOrder = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/customer/orders`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token?.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setHistoryOrder(data.data);
        console.log('get history list success:');
      } else {
        const data = await response.json();
        console.log('Lỗi fetching history data:', data.message);
      }
    } catch (error) {
      console.log('Error fetching history data:', error);
    }
  };

  return {historyOrder, fetcHistoryOrder};
};
