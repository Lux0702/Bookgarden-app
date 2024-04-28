import {useState, useEffect} from 'react';
import {API_BASE} from '../utils/utils';
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
