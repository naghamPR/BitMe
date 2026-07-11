import "./Editeresturant.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateRestaurant } from "../../actions/resturantsActions";

const Editeresturant = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const restaurant = state?.restaurant;

  const [form, setForm] = useState({
    name: "",
    location: "",
    cuisine_type: "",
    type: "",
    startTime: "",
    endTime: "",
  });

  const [tables, setTables] = useState([]);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    if (restaurant) {
      setForm({
        name: restaurant.name,
        location: restaurant.location,
        cuisine_type: restaurant.cuisine_type,
        type: restaurant.type,
        startTime: restaurant.startTime,
        endTime: restaurant.endTime,
      });
      setTables(restaurant.tables || []);
      setFeatures(restaurant.features || []);
    }
  }, [restaurant]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTableChange = (index, key, value) => {
    const updated = [...tables];
    updated[index][key] = value;
    setTables(updated);
  };

  const handleFeatureChange = (index, key, value) => {
    const updated = [...features];
    updated[index][key] = value;
    setFeatures(updated);
  };

  const handleSubmit = () => {
    const updateData = {
      ...form,
      tables,
      features,
    };

    dispatch(updateRestaurant(restaurant.id, updateData))
      .then(() => {
        alert("Restaurant updated successfully!");
        navigate("/Managerhom");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to update restaurant.");
      });
  };

  return (
    <div className="editresturant-page">
      <div className="editresturant-input-card">
        <div className="editresturant-card-content">
          <div className="editresturant-card-title">Edit Restaurant</div>

          <label className="input-label">Name:</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input-field2"
          />

          <label className="input-label">Location:</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="input-field2"
          />

          <label className="input-label">Cuisine Type:</label>
          <input
            name="cuisine_type"
            value={form.cuisine_type}
            onChange={handleChange}
            className="input-field2"
          />

          <label className="input-label">Type:</label>
          <input
            name="type"
            value={form.type}
            onChange={handleChange}
            className="input-field2"
          />

          <label className="input-label">Start Time:</label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="input-field2"
          />

          <label className="input-label">End Time:</label>
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="input-field2"
          />

          <h3 className="editresturant-subsection-title">Tables</h3>
          {tables.map((table, index) => (
            <div key={index} className="table-feature-group">
              <label>Type:</label>
              <input
                value={table.type}
                onChange={(e) =>
                  handleTableChange(index, "type", e.target.value)
                }
              />
              <label>Count:</label>
              <input
                type="number"
                value={table.count}
                onChange={(e) =>
                  handleTableChange(index, "count", e.target.value)
                }
              />
              <label>Persons:</label>
              <input
                type="number"
                value={table.number_of_persons}
                onChange={(e) =>
                  handleTableChange(index, "number_of_persons", e.target.value)
                }
              />
              <label>Available:</label>
              <input
                type="number"
                value={table.available_count}
                onChange={(e) =>
                  handleTableChange(index, "available_count", e.target.value)
                }
              />
            </div>
          ))}

          <h3 className="editresturant-subsection-title">Features</h3>
          {features.map((feature, index) => (
            <div key={index} className="table-feature-group">
              <label>Type:</label>
              <input
                value={feature.type}
                onChange={(e) =>
                  handleFeatureChange(index, "type", e.target.value)
                }
              />
              <label>Description:</label>
              <input
                value={feature.description}
                onChange={(e) =>
                  handleFeatureChange(index, "description", e.target.value)
                }
              />
            </div>
          ))}

          <button
            className="editresturant-submit-button"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="editresturant-preview">
        <img
          src={`http://localhost:8000${restaurant.image_path}`}
          alt="Preview"
          className="preview-image"
        />
        <video controls className="preview-video">
          <source
            src={`http://localhost:8000${restaurant.video_path}`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default Editeresturant;
