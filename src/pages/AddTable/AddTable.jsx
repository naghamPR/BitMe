import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTable } from "../../actions/addTablesActions";

const AddTable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

   const restaurantId = useSelector(state => 
    state.authReducer?.authData?.data?.restaurants?.[0]?.id || null
  );
const [tableData, setTableData] = useState({
    type: "",
    number_of_persons: "",
    count: "",
    restaurants_id: restaurantId || "",
  });

  useEffect(() => {
    if (!restaurantId) {
      alert("No restaurant selected.");
      navigate(""); 
    }
  }, [restaurantId, navigate]);

  const handleChange = (e) => {
    setTableData({ ...tableData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(addTable(tableData))
    console.log(tableData)
      .then(() => {
        alert("Table added successfully!");
        navigate(""); 
      })
      .catch((error) => {
        alert("Error adding table: " + error.message);
      });
  };

  return (
    <div className="form-container">
      <h2>Add Table</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="type"
          placeholder="Table Type"
          value={tableData.type}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="number_of_persons"
          placeholder="Number of Persons"
          value={tableData.number_of_persons}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="count"
          placeholder="Count"
          value={tableData.count}
          onChange={handleChange}
          required
        />

        {/* You can hide the restaurant_id input since it's prefilled */}
        <input
          type="hidden"
          name="restaurant_id"
          value={tableData.restaurant_id}
        />

        <button type="submit">Add Table</button>
      </form>
    </div>
  );
};

export default AddTable;
