import { createContext,useReducer} from "react";

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const initialState ={
    // id: "64e14156b70572f41315d4f1",
    // email: "toni@gmail.com",
    // name: "Toni",
    // pic_url: "emptyProfile.png",
    // following: [],
    // followers: [
    //     {
    //         _id: "64e14ce1a9ea417c969d05a4",
    //         name: "Toni1",
    //         email: "toni1@gmail.com",
    //         password: "$2a$10$yuBUZbidJUU9m.jIgLTy/.T0t7dn3xFKpQDr3a.Dl2T7CSWP93cTG",
    //         pic_url: "emptyProfile.png",
    //         followers: [],
    //         following: [
    //            "64e14156b70572f41315d4f1"
    //         ],
    //         recommendations: [
    //             "64e16a6c501259bdb4bd1c15"
    //         ],
    //         likedBooks: [],
    //         createdAt: "2023-08-19T23:14:41.919Z",
    //         updatedAt: "2023-08-20T01:20:45.027Z",
    //         __v: 3
    //     }
    // ],
    // recommendedBooks: [
    //     {
    //         author: {
    //             name: "J.D. Salinger",
    //             pic_url: "th.jpg"
    //         },
    //         _id: "64e151eaf3660a7c705f7098",
    //         bookName: "The book of tranks",
    //         review: "A classic novel that captures the struggles of adolescence.",
    //         book_pic_url: "chest.png",
    //         genre: "Fiction",
    //         createdBy: "64e14156b70572f41315d4f1",
    //         likes: 0,
    //         __v: 0
    //     },
    //     {
    //         author: {
    //             name: "Harper Lee",
    //             pic_url: "smiling-young-man-2.png"
    //         },
    //         _id: "64e16ad9501259bdb4bd1c1a",
    //         bookName: "To Kill a Mockingbird",
    //         review: "A powerful novel dealing with racial injustice and moral growth.",
    //         book_pic_url: "oneBillions.png",
    //         genre: "Classic",
    //         createdBy: "64e14156b70572f41315d4f1",
    //         likes: 0,
    //         __v: 0
    //     }
    // ],
    // likedBooks: []
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case 'INITIALIZE_STATE':
        return action.payload;
      case 'ADD_FOLLOWING':
      if (!state.following?.includes(action.payload)) {
        return {
          ...state,
          following: [...state.following, action.payload]
        };
      }
      return state;
      case 'REMOVE_FOLLOWING':
        return {
          ...state,
          following: state.following.filter(user => user._id !== action.payload)
        };
      case 'ADD_LIKED_BOOK':
        if (!state.likedBooks?.includes(action.payload)) {
          return {
            ...state,
            likedBooks: [...state.likedBooks, action.payload]
          };
        }
        return state;
      case 'REMOVE_LIKED_BOOK':
        return {
          ...state,
          likedBooks: state.likedBooks.filter(book => book._id !== action.payload._id)
        };
      case "DELETE_RECOMMENDED_BOOK":
        const updatedRecommendedBooks = state.recommendedBooks.filter(
          book => book._id !== action.payload
        );
        return {
          ...state,
          recommendedBooks: updatedRecommendedBooks
        };
        case "EDIT_RECOMMENDED_BOOK":
          console.log(action.payload)
          const updatedEditedRecommendedBooks = state.recommendedBooks.map(book =>
            book._id === action.payload._id ? { ...book, ...action.payload } : book
          );
         
          return {
            ...state,
            recommendedBooks: updatedEditedRecommendedBooks
          };    
        case 'ADD_RECOMMENDED_BOOK':
          return {
            ...state,
            recommendedBooks: [...state.recommendedBooks, action.payload]
          };
          case 'INCREMENT_LIKES_FOR_FOLLOWING_RECOMMENDATION':
            const { userIdInc, bookIdInc } = action.payload;
            console.log(userIdInc , bookIdInc)
            const updatedFollowingWithIncrementedLike = state.following.map(user => {
              if (user._id === userIdInc) {
                console.log('found user')
                const updatedRecommendations = user.recommendations.map(recommendation => {
                  
                  if (recommendation._id === bookIdInc) {
                    console.log(recommendation)
                    return { ...recommendation, likes: recommendation.likes + 1 };
                  }
                  return recommendation;
                });
                console.log(updatedRecommendations)
                return { ...user, recommendations: updatedRecommendations };
              }
              return user;
            });
      
            return {
              ...state,
              following: updatedFollowingWithIncrementedLike,
            };
      
          case 'DECREMENT_LIKES_FOR_FOLLOWING_RECOMMENDATION':
            const { userId, bookId } = action.payload;
            const updatedFollowing = state.following.map(user => {
              if (user._id === userId) {
                const updatedRecommendations = user.recommendations.map(recommendation => {
                  if (recommendation._id === bookId) {
                    return { ...recommendation, likes: recommendation.likes - 1 };
                  }
                  return recommendation;
                });
                return { ...user, recommendations: updatedRecommendations };
              }
              return user;
            });
      
            return {
              ...state,
              following: updatedFollowing,
            };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);


  
  return (
    <UserContext.Provider value={{state ,dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext