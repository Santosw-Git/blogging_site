import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import { useEditorContext } from "../context/Editor.context";
import { Tag } from "./tags.component";
import { useSession } from "../context/User.context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const PublishForm = () => {
  const characterLimit = 200;
  const tagLimit = 7;
  let navigate = useNavigate();
  let {
    blog,
    blog: { banner, title, des, content, tags },
    setEditorState,
    setBlog,
  } = useEditorContext();

  let {
    userAuth: { accessToken },
  } = useSession();

  const handleCloseEvent = () => {
    setEditorState("editor");
  };

  const handleBlogTitleChange = (event) => {
    let input = event.target;
    setBlog({ ...blog, title: input.value });
  };

  const handleBlogDescriptionChange = (event) => {
    let input = event.target;
    setBlog({ ...blog, des: input.value });
  };

  const handleTitleKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13 || event.keyCode === 188) {
      event.preventDefault();

      let tag = event.target.value;
      console.log(tag.length);

      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          console.log(tag);

          setBlog({ ...blog, tags: [...tags, tag] });
        }
      } else {
        toast.error(`You can only add ${tagLimit} tags`);
      }

      event.target.value = "";
    }
  };

  const handlePublishBlog = (event) => {
    if (event.target.className.includes("disabled")) {
      return;
    }
    if (!title.length) {
      return toast.error(`Please give a title`);
    }

    if (!des.length) {
      return toast.error(`Please give a description`);
    }
    if (!tags.length) {
      return toast.error(`Please give a tags`);
    }

    let loadingToast = toast.loading("Publishing...");

    event.target.classList.add("disabled");

    let blogObj = {
      title,
      banner,
      des,
      tags,
      content,
      draft: false,
    };
    axios
      .post(import.meta.env.VITE_SERVER_URL + "/publish-form", blogObj, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        toast.dismiss(loadingToast);
        event.target.classList.remove("disabled");
        toast.success("Published successfully");

        setTimeout(() => {
          navigate("/");
        }, 500);
      })
      .catch(({ response }) => {
        event.target.classList.add("disabled");
        toast.dismiss(loadingToast);
        toast.error(response.data.error);
      });
  };
  return (
    <AnimationWrapper>
      <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
        <Toaster />
        <button
          className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={handleCloseEvent}
        >
          <i className="fi fi-br-cross"></i>
        </button>

        <div className="max-w-[550px] center">
          <p className="text-dark-gre mb-1">Preview</p>

          <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-1">
            <img src={banner} />
          </div>
          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
            {title}
          </h1>
          <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
            {des}
          </p>
        </div>
        <div className="border-grey lg:border-1 lg:pl-8">
          <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
          <input
            type="text"
            placeholder="Blog Title"
            defaultValue={title}
            className="input-box pl-4"
            onChange={handleBlogTitleChange}
          />
          <p className="text-dark-grey mb-2 mt-9">
            Short description about ypur blog
          </p>
          <textarea
            maxLength={characterLimit}
            defaultValue={des}
            className="h-40 resize-none leading-7 input-box pl-4"
            onChange={handleBlogDescriptionChange}
            onKeyDown={handleTitleKeyDown}
          ></textarea>
          <p className="mt-1 text-dark-grey text-sm text-right">
            {characterLimit - des.length} characters left
          </p>

          <p className="text-dark-grey mb-2 mt-9">
            Topics - (Helps in searching and ranking your blog post){" "}
          </p>
          <div className="relative input-box pl-2 py-2 pb-4">
            <input
              type="text "
              placeholder="Topic"
              className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
              onKeyDown={handleKeyDown}
            />
            {tags.map((tag, i) => {
              return <Tag key={i} tagIndex={i} tag={tag} />;
            })}
          </div>
          <p className="mt-1 mb-4 text-dark-grey text-right">
            {tagLimit - tags.length} Tags left
          </p>
          <button className="btn-dark px-8" onClick={handlePublishBlog}>
            Publish
          </button>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export { PublishForm };
