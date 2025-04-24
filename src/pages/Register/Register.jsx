import "./Register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../action/authAction";

const Register = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, authData } = useSelector((state) => state.authReducer);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handelChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handelSubmit = (e) => {
    e.preventDefault();

    // dispatch(signUp(data));
  };

  useEffect(() => {
    if (authData && !loading) {
      Navigate("/");
    }
  }, [authData, loading, Navigate]);

  return (
    <div className="register">
      <img src={""} alt="" />

      <div className="header">
        <h1>
          Sign Up to <span> BiteMe </span> WebSite
        </h1>
        <h3>
          Already have an account ?{" "}
          <Link to="/login">
            <span>Log In</span>
          </Link>
        </h3>
      </div>

      <div className="box">
        <div className="content">
          <form onSubmit={handelSubmit}>
            <input
              required
              type="text"
              name="name"
              value={data.name}
              onChange={handelChange}
              placeholder="Name"
            />
            <input
              required
              type="email"
              name="email"
              value={data.email}
              onChange={handelChange}
              placeholder="Email"
            />

            <input
              required
              type="password"
              name="password"
              value={data.password}
              onChange={handelChange}
              placeholder="Password"
            />

            <button display={loading}>
              {loading ? "loading ..." : "Sign Up"}
            </button>
          </form>
        </div>

        <div className="line-container">
          <div className="line"></div>
          <p>Or</p>
          <div className="line"></div>
        </div>

        {/* <div className="social-option">
                    <div className="social-option">
                        <div className="groub-1">
                            <img src={google} alt="" />
                            <button className="btn-1"> continue with Google</button>
                        </div>

                        <div className="groub-1">
                            <img src={facebook} alt="" />
                            <button className="btn-2"> continue with FaceBook</button>
                        </div>
                    </div>
                </div> */}
      </div>

      <div className="footor">
        <p>
          * By signing up, you agree to our Terms of Use and acknowledge you’ve
          read our Privacy Policy
        </p>
        <hr />
        <p>
          This site is protected by reCAPTCHA Enterprise. Google's Privacy
          Policy and Terms of Use apply.
        </p>
      </div>
    </div>
  );
};

export default Register;
