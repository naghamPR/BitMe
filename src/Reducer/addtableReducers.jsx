// tableReducer.js
const initialState = {
  tables: [],
  loading: false,
  error: null,
};

const addtableReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_TABLES_START":
    case "ADD_TABLE_START":
    case "UPDATE_TABLE_START":
    case "DELETE_TABLE_START":
      return { ...state, loading: true };

    case "FETCH_TABLES_SUCCESS":
      return { ...state, loading: false, tables: action.payload };

    case "ADD_TABLE_SUCCESS":
      return {
        ...state,
        loading: false,
        tables: [...state.tables, action.payload.data],
      };

    case "UPDATE_TABLE_SUCCESS":
      return {
        ...state,
        loading: false,
        tables: state.tables.map((table) =>
          table.id === action.payload.data.id ? action.payload.data : table
        ),
      };

    case "DELETE_TABLE_SUCCESS":
      return {
        ...state,
        loading: false,
        tables: state.tables.filter((t) => t.id !== action.payload),
      };

    case "FETCH_TABLES_FAIL":
    case "ADD_TABLE_FAIL":
    case "UPDATE_TABLE_FAIL":
    case "DELETE_TABLE_FAIL":
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
};

export default addtableReducer;
