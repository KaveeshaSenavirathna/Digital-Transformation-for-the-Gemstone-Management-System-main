import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import "../Styles/RequestPage.css";

function RequestPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    desiredShape: "",
    desiredColor: "",
    desiredSize: "",
    quantity: 1,
    intensity: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    contactMethod: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${productId}`);
        setProduct(res.data);
      } catch (err) {
        alert("Failed to load product");
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, navigate]);

  const validate = () => {
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Invalid email";
    if (!/^[0-9]{10,15}$/.test(form.phone)) errs.phone = "Phone must be 10–15 digits";
    if (form.quantity < 1) errs.quantity = "Please select a quantity";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/requests/create",
        { ...form, productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Request submitted successfully!");
      navigate("/request_history");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit request");
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found</p>;

  const totalPrice = product.price * form.quantity;

  return (
  <div className="request-overlay">
    <div className="request-modal">
      <h1 className="request-title">Request Product: {product.type}</h1>

      <div className="request-form">
        <div className="form-section">
          <h3>Desired Options</h3>
          <div className="form-row">
            <select name="desiredShape" value={form.desiredShape} onChange={handleChange}>
              <option value="">Select Desired Shape</option>
              <option value="Round">Round</option>
              <option value="Oval">Oval</option>
              <option value="Princess">Princess</option>
              <option value="Emerald">Emerald</option>
              <option value="Pear">Pear</option>
            </select>
            <select name="desiredColor" value={form.desiredColor} onChange={handleChange}>
              <option value="">Select Desired Color</option>
              <option value="D">D (Colorless)</option>
              <option value="E">E (Colorless)</option>
              <option value="F">F (Colorless)</option>
              <option value="G">G (Near Colorless)</option>
              <option value="H">H (Near Colorless)</option>
            </select>
          </div>
          <div className="form-row">
            <select name="desiredSize" value={form.desiredSize} onChange={handleChange}>
              <option value="">Select Desired Size</option>
              <option value="0.25-0.50">0.25-0.50 carat</option>
              <option value="0.50-1.00">0.50-1.00 carat</option>
              <option value="1.00-1.50">1.00-1.50 carat</option>
              <option value="1.50-2.00">1.50-2.00 carat</option>
              <option value="2.00+">2.00+ carat</option>
            </select>
            <select name="intensity" value={form.intensity} onChange={handleChange}>
              <option value="">Select Intensity Level</option>
              <option value="Faint">Faint</option>
              <option value="Very Light">Very Light</option>
              <option value="Light">Light</option>
              <option value="Fancy Light">Fancy Light</option>
              <option value="Fancy">Fancy</option>
            </select>
          </div>
          <div className="form-row single">
            <input 
              name="quantity" 
              type="number" 
              placeholder="Quantity" 
              value={form.quantity} 
              onChange={handleChange}
              min="0"
              max="10"
            />
            {errors.quantity && <small className="error">{errors.quantity}</small>}
          </div>
        </div>

        <div className="form-section">
          <h3>User Details</h3>
          <div className="form-row">
            <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} />
            <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} />
          </div>
          <div className="form-row">
            <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} />
            <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
          </div>
          {errors.email && <small className="error">{errors.email}</small>}
          {errors.phone && <small className="error">{errors.phone}</small>}
          <div className="form-row single">
            <select name="contactMethod" value={form.contactMethod} onChange={handleChange}>
              <option value="">Preferred Contact Method</option>
              <option value="call">Phone Call</option>
              <option value="email">Email</option>
              <option value="online meeting">Online Meeting</option>
              <option value="appointment">In-Person Appointment</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Pricing Summary</h3>
          <div className="total-price">Total Price: ${totalPrice}</div>
        </div>

        <button className="submit-btn" onClick={handleSubmit}>Confirm Request</button>
      </div>
    </div>
  </div>
);

}

export default RequestPage;
