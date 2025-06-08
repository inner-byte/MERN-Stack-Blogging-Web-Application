import React, { useContext, useState } from "react";
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const [avatarPreview, setAvatarPreview] = useState("");

  const changeAvatarHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
    } else {
      setAvatarPreview(""); // Clear preview if no file selected
    }
  };

  const { mode, isAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  const handleRegister = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("password", data.password);
    formData.append("education", data.education);
    formData.append("role", data.role);
    if (data.avatar && data.avatar[0]) {
      formData.append("avatar", data.avatar[0]);
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      reset(); // Reset form fields using react-hook-form's reset
      setAvatarPreview(""); // Clear avatar preview
      toast.success(response.data.message);
      navigateTo("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  // Watch avatar for preview (optional, as changeAvatarHandler already updates it)
  // const currentAvatarFile = watch("avatar");
  // React.useEffect(() => {
  //   if (currentAvatarFile && currentAvatarFile[0]) {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(currentAvatarFile[0]);
  //     reader.onload = () => {
  //       setAvatarPreview(reader.result);
  //     };
  //   } else if (!currentAvatarFile || currentAvatarFile.length === 0) {
  //      setAvatarPreview(""); // Clear preview if file is removed or not selected initially
  //   }
  // }, [currentAvatarFile]);


  return (
    <article className={mode === "dark" ? "dark-bg" : "light-bg"}>
      <section className="auth-form">
        <form onSubmit={handleSubmit(handleRegister)}>
          <h1>REGISTER</h1>
          <select {...register("role", { required: "Please select a role." })}>
            <option value="">SELECT ROLE</option>
            <option value="Reader">READER</option>
            <option value="Author">AUTHOR</option>
          </select>
          {errors.role && <p className="error-message">{errors.role?.message}</p>}
          <div>
            <input
              type="text"
              placeholder="Your Name"
              {...register("name", {
                required: "Name is required.",
                minLength: { value: 3, message: "Name must be at least 3 characters." },
                pattern: { value: /^[A-Za-z\s]+$/, message: "Name can only contain letters and spaces."}
              })}
            />
            {errors.name && <p className="error-message">{errors.name?.message}</p>}
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
              type="number"
              placeholder="Phone Number"
              {...register("phone", {
                required: "Phone number is required.",
                minLength: { value: 10, message: "Phone number must be at least 10 digits." },
                maxLength: { value: 15, message: "Phone number cannot exceed 15 digits." },
                pattern: { value: /^\d+$/, message: "Phone number must contain only digits." }
              })}
            />
            {errors.phone && <p className="error-message">{errors.phone?.message}</p>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required.",
                minLength: { value: 8, message: "Password must be at least 8 characters long." }
              })}
            />
            {errors.password && <p className="error-message">{errors.password?.message}</p>}
          </div>
          <select {...register("education", { required: "Please select your education level." })}>
            <option value="">SELECT YOUR EDUCATION</option>
            <option value="Matric">Matric</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Graducation">Graducation</option>
            <option value="Masters">Masters</option>
            <option value="PhD">PhD</option>
          </select>
          {errors.education && <p className="error-message">{errors.education?.message}</p>}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div className="avatar">
              <img
                src={avatarPreview ? `${avatarPreview}` : "/pic.jpg"}
                alt="avatar"
              />
            </div>
            <input
              type="file"
              {...register("avatar", {
                onChange: changeAvatarHandler,
                validate: {
                  checkFileType: (value) => {
                    if (value[0]) {
                      const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];
                      return acceptedTypes.includes(value[0].type) || "Invalid file type. Use JPG, PNG, WEBP.";
                    }
                    return true;
                  },
                  checkFileSize: (value) => {
                    if (value[0]) {
                      return value[0].size <= 2 * 1024 * 1024 || "File too large. Max 2MB.";
                    }
                    return true;
                  }
                }
              })}
              className="avatar_input_tag"
              style={{ border: "none" }}
            />
          </div>
          {errors.avatar && <p className="error-message">{errors.avatar?.message}</p>}
          <p>
            Already Registered? <Link to={"/login"}>Login Now</Link>
          </p>
          <button className="submit-btn" type="submit">
            REGISTER
          </button>
        </form>
      </section>
    </article>
  );
};

export default Register;
