import axios from "axios";
import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import toast from "react-hot-toast";

const CreateBlog = () => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: { published: true }
  });

  const [mainImagePreview, setMainImagePreview] = useState("");
  const [paraOneImagePreview, setParaOneImagePreview] = useState("");
  const [paraTwoImagePreview, setParaTwoImagePreview] = useState("");
  const [paraThreeImagePreview, setParaThreeImagePreview] = useState("");

  const mainImagePreviewHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setMainImagePreview(reader.result);
      };
    } else {
      setMainImagePreview("");
    }
  };
  const paraOneImagePreviewHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setParaOneImagePreview(reader.result);
      };
    } else {
      setParaOneImagePreview("");
    }
  };
  const paraTwoImagePreviewHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setParaTwoImagePreview(reader.result);
      };
    } else {
      setParaTwoImagePreview("");
    }
  };
  const paraThreeImagePreviewHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setParaThreeImagePreview(reader.result);
      };
    } else {
      setParaThreeImagePreview("");
    }
  };

  const handleBlog = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("intro", data.intro);
    formData.append("category", data.category);
    formData.append("published", data.published);
    if (data.mainImage && data.mainImage[0]) {
      formData.append("mainImage", data.mainImage[0]);
    }
    if (data.paraOneTitle && data.paraOneTitle.length > 0) {
      formData.append("paraOneTitle", data.paraOneTitle);
    }
    if (data.paraOneDescription && data.paraOneDescription.length > 0) {
      formData.append("paraOneDescription", data.paraOneDescription);
    }
    if (data.paraOneImage && data.paraOneImage[0]) {
      formData.append("paraOneImage", data.paraOneImage[0]);
    }
    if (data.paraTwoTitle && data.paraTwoTitle.length > 0) {
      formData.append("paraTwoTitle", data.paraTwoTitle);
    }
    if (data.paraTwoDescription && data.paraTwoDescription.length > 0) {
      formData.append("paraTwoDescription", data.paraTwoDescription);
    }
    if (data.paraTwoImage && data.paraTwoImage[0]) {
      formData.append("paraTwoImage", data.paraTwoImage[0]);
    }
    if (data.paraThreeTitle && data.paraThreeTitle.length > 0) {
      formData.append("paraThreeTitle", data.paraThreeTitle);
    }
    if (data.paraThreeDescription && data.paraThreeDescription.length > 0) {
      formData.append("paraThreeDescription", data.paraThreeDescription);
    }
    if (data.paraThreeImage && data.paraThreeImage[0]) {
      formData.append("paraThreeImage", data.paraThreeImage[0]);
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/blog/post",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      reset();
      setMainImagePreview("");
      setParaOneImagePreview("");
      setParaTwoImagePreview("");
      setParaThreeImagePreview("");
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="create-blog">
      <h3>CREATE BLOG</h3>
      <div className="container">
        <form onSubmit={handleSubmit(handleBlog)}>
          <div className="category-box">
            <label>Category</label>
            <select {...register("category", { required: "Category is required." })}>
              <option value="">Select Blog Category</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Technology">Technology</option>
              <option value="Sports">Sports</option>
              <option value="Travel">Travel</option>
              <option value="Business">Business</option>
              <option value="Economy">Economy</option>
            </select>
            {errors.category && <p className="error-message">{errors.category?.message}</p>}
          </div>
          <input
            type="text"
            placeholder="BLOG MAIN TITLE"
            {...register("title", {
              required: "Title is required.",
              minLength: { value: 10, message: "Title must be at least 10 characters." },
              maxLength: { value: 150, message: "Title cannot exceed 150 characters." }
            })}
          />
          {errors.title && <p className="error-message">{errors.title?.message}</p>}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>BLOG MAIN IMAGE</label>
            <img
              src={mainImagePreview ? `${mainImagePreview}` : "/imgPL.webp"}
              alt="mainImg"
              className="mainImg"
            />
            <input
              type="file"
              {...register("mainImage", {
                required: "Main image is required.",
                onChange: mainImagePreviewHandler,
                validate: {
                  checkFileType: (value) => { if (value[0]) { const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']; return acceptedTypes.includes(value[0].type) || "Invalid file type (JPG, PNG, WEBP)."; } return true; },
                  checkFileSize: (value) => { if (value[0]) { return value[0].size <= 5 * 1024 * 1024 || "Main image too large. Max 5MB."; } return true; }
                }
              })}
              style={{ border: "none" }}
            />
            {errors.mainImage && <p className="error-message">{errors.mainImage?.message}</p>}
          </div>
          <textarea
            rows="25"
            className="intro"
            placeholder="BLOG INTRO..... (Must contain at least 250 characters!)"
            {...register("intro", {
              required: "Blog introduction is required.",
              minLength: { value: 250, message: "Introduction must be at least 250 characters." },
              maxLength: { value: 2000, message: "Introduction cannot exceed 2000 characters." }
            })}
          />
          {errors.intro && <p className="error-message">{errors.intro?.message}</p>}
          <div className="sub-para">
            <input
              type="text"
              placeholder="Paragraph one title"
              {...register("paraOneTitle", {
                minLength: { value: 5, message: "Paragraph title min 5 chars." },
                maxLength: { value: 100, message: "Paragraph title max 100 chars." }
              })}
            />
            {errors.paraOneTitle && <p className="error-message">{errors.paraOneTitle?.message}</p>}
            <img
              src={
                paraOneImagePreview ? `${paraOneImagePreview}` : "/imgPL.webp"
              }
              alt="subParaOneImg"
            />
            <input
              type="file"
              {...register("paraOneImage", {
                onChange: paraOneImagePreviewHandler,
                validate: {
                  checkFileType: (value) => { if (value[0]) { const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']; return acceptedTypes.includes(value[0].type) || "Invalid file type (JPG, PNG, WEBP)."; } return true; },
                  checkFileSize: (value) => { if (value[0]) { return value[0].size <= 2 * 1024 * 1024 || "Image too large. Max 2MB."; } return true; }
                }
              })}
              style={{ border: "none" }}
            />
            {errors.paraOneImage && <p className="error-message">{errors.paraOneImage?.message}</p>}
            <textarea
              rows="10"
              placeholder="Blog First Sub Paragraph Comes Here..."
              {...register("paraOneDescription", {
                validate: value =>
                  (watch('paraOneTitle') && !value) ? "Description is required if paragraph title is provided." :
                  (watch('paraOneTitle') && value && value.length < 50) ? "Min 50 chars for description." :
                  (watch('paraOneTitle') && value && value.length > 2500) ? "Max 2500 chars for description." :
                  true
              })}
            />
            {errors.paraOneDescription && <p className="error-message">{errors.paraOneDescription?.message}</p>}
          </div>
          <div className="sub-para">
            <input
              type="text"
              placeholder="Paragraph two title"
              {...register("paraTwoTitle", {
                minLength: { value: 5, message: "Paragraph title min 5 chars." },
                maxLength: { value: 100, message: "Paragraph title max 100 chars." }
              })}
            />
            {errors.paraTwoTitle && <p className="error-message">{errors.paraTwoTitle?.message}</p>}
            <img
              src={
                paraTwoImagePreview ? `${paraTwoImagePreview}` : "/imgPL.webp"
              }
              alt="subParaTwoImg"
            />
            <input
              type="file"
              {...register("paraTwoImage", {
                onChange: paraTwoImagePreviewHandler,
                validate: {
                  checkFileType: (value) => { if (value[0]) { const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']; return acceptedTypes.includes(value[0].type) || "Invalid file type (JPG, PNG, WEBP)."; } return true; },
                  checkFileSize: (value) => { if (value[0]) { return value[0].size <= 2 * 1024 * 1024 || "Image too large. Max 2MB."; } return true; }
                }
              })}
              style={{ border: "none" }}
            />
            {errors.paraTwoImage && <p className="error-message">{errors.paraTwoImage?.message}</p>}
            <textarea
              rows="10"
              placeholder="Blog Second Sub Paragraph Comes Here..."
              {...register("paraTwoDescription", {
                validate: value =>
                  (watch('paraTwoTitle') && !value) ? "Description is required if paragraph title is provided." :
                  (watch('paraTwoTitle') && value && value.length < 50) ? "Min 50 chars for description." :
                  (watch('paraTwoTitle') && value && value.length > 2500) ? "Max 2500 chars for description." :
                  true
              })}
            />
            {errors.paraTwoDescription && <p className="error-message">{errors.paraTwoDescription?.message}</p>}
          </div>
          <div className="sub-para">
            <input
              type="text"
              placeholder="Paragraph three title"
              {...register("paraThreeTitle", {
                minLength: { value: 5, message: "Paragraph title min 5 chars." },
                maxLength: { value: 100, message: "Paragraph title max 100 chars." }
              })}
            />
            {errors.paraThreeTitle && <p className="error-message">{errors.paraThreeTitle?.message}</p>}
            <img
              src={
                paraThreeImagePreview
                  ? `${paraThreeImagePreview}`
                  : "/imgPL.webp"
              }
              alt="subParaThreeImg"
            />
            <input
              type="file"
              {...register("paraThreeImage", {
                onChange: paraThreeImagePreviewHandler,
                validate: {
                  checkFileType: (value) => { if (value[0]) { const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']; return acceptedTypes.includes(value[0].type) || "Invalid file type (JPG, PNG, WEBP)."; } return true; },
                  checkFileSize: (value) => { if (value[0]) { return value[0].size <= 2 * 1024 * 1024 || "Image too large. Max 2MB."; } return true; }
                }
              })}
              style={{ border: "none" }}
            />
            {errors.paraThreeImage && <p className="error-message">{errors.paraThreeImage?.message}</p>}
            <textarea
              rows="10"
              placeholder="Blog Third Sub Paragraph Comes Here..."
              {...register("paraThreeDescription", {
                validate: value =>
                  (watch('paraThreeTitle') && !value) ? "Description is required if paragraph title is provided." :
                  (watch('paraThreeTitle') && value && value.length < 50) ? "Min 50 chars for description." :
                  (watch('paraThreeTitle') && value && value.length > 2500) ? "Max 2500 chars for description." :
                  true
              })}
            />
            {errors.paraThreeDescription && <p className="error-message">{errors.paraThreeDescription?.message}</p>}
          </div>
          <div className="publish-box">
            <label>Wants to publish now?</label>
            <select {...register("published")}>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>
          <button className="create-btn" type="submit">
            POST BLOG
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateBlog;
