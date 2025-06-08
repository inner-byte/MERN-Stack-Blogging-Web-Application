import React, { useContext } from "react";
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { mode, isAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogin = async (data) => {
    await axios
      .post(
        "http://localhost:4000/api/v1/user/login",
        { email: data.email, password: data.password, role: data.role },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        reset(); // Reset form fields
        navigateTo("/");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  if(isAuthenticated){
    return <Navigate to={'/'}/>
  }

  return (
    <article className={mode === "dark" ? "dark-bg" : "light-bg"}>
      <section className="auth-form">
        <form onSubmit={handleSubmit(handleLogin)}>
          <h1>LOGIN</h1>
          <div>
            <select {...register("role", { required: "Please select a role." })}>
              <option value="">SELECT ROLE</option>
              <option value="Reader">READER</option>
              <option value="Author">AUTHOR</option>
            </select>
            {errors.role && <p className="error-message">{errors.role?.message}</p>}
          </div>
          <div>
            <input
              type="email"
              placeholder="Your Email"
              {...register("email", {
                required: "Email is required.",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Please enter a valid email address." }
              })}
            />
            {errors.email && <p className="error-message">{errors.email?.message}</p>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required." })}
            />
            {errors.password && <p className="error-message">{errors.password?.message}</p>}
          </div>
          <p>
            Don't have any Account? <Link to={"/register"}>Register Now</Link>
          </p>

          <button className="submit-btn" type="submit">
            LOGIN
          </button>
        </form>
      </section>
    </article>
  );
};

export default Login;
