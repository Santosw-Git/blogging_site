import { getDay } from "../common/date";
import { Link } from "react-router-dom";
const BlogPostCard = ({ content, author }) => {
  let {
    blog_id: id,
    publishedAt,
    des,
    banner,
    tags,
    title,
    activity: { total_likes },
  } = content;

  let { fullname, profile_img, username } = author;
  return (
    <Link
      to={`/blog/${id}`}
      className="flex gap-8 items-center border-grey pb-5 mb-4"
    >
      <div className="full">
        <div className="flex gap-2 items-cnter mb-7">
          <img src={profile_img} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">
            {fullname} @ {username}
          </p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
        </div>
        <h1 className="blog-title">{title}</h1>
        <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">
          {des}
        </p>
        <div className="flex gap-4 mt-7">
          <span className="btn-light py-1 px-4">{tags[0]}</span>
          <span className="ml-3 flex items-center gap-2 text-dark-grey">
            <i className="fi fi-rr-heart text-xl">{total_likes}</i>
          </span>
        </div>
      </div>

      <div className="h-28 aspect-square bg-grey">
        <img
          src={banner}
          className="w-full h-full aspect-square object-cover"
        />
      </div>
    </Link>
  );
};

export { BlogPostCard };