import { createContext,useReducer} from "react";

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const initialState ={};
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
        console.log(action.paylaod)
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