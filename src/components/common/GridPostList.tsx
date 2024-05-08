import { Models } from "appwrite";
import { useUserContext } from "@/context/AuthContext.tsx";
import { Link } from "react-router-dom";
import PostStats from "@/components/common/PostStats.tsx";

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
}

const GridPostList = ({ posts, showUser = true, showStats = true }: GridPostListProps) => {
  const { user } = useUserContext()

  return (
    <ul className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7 max-w-5xl">
      {posts.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80">
          <Link to={`/post/${post.$id}`} className="grid-post_link">
            <img
              className="w-full h-full object-cover"
              src={post.imageUrl}
              alt="post image"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img src={post.creator.imageUrl} alt="ownder" height={24} width={24} className="rounded-full"/>
                <p className="line-clamp-1">{post.creator.name}</p>
              </div>
            )}

            {showStats && (
              <PostStats post={post} userId={user.id} />
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default GridPostList
