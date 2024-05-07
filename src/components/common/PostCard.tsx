import { Models } from "appwrite"
import { Link } from "react-router-dom"
import { timeAgo } from "@/helpers.ts"
import { useUserContext } from "@/context/AuthContext.tsx"
import PostStats from "@/components/common/PostStats.tsx"

type PostCardProps = {
  post: Models.Document
}

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext()

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              className="rounded-full w-12 lg:h12"
              src={post?.creator?.imageUrl}
              alt="Post creator image"
            />
          </Link>

          <div className="flex flex-col">
            <p className="text-sm text-light-1">
              {post?.creator?.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="text-xs text-light-2">{timeAgo(post.$createdAt)}</p>
              -
              <p className="text-xs text-light-2">{post.location}</p>
            </div>
          </div>
        </div>

        <Link
          className={`${user.id !== post.creator.$id && 'hidden'}`}
          to={`/update-post/${post.$id}`}
        >
          <img
            src="/assets/images/edit.svg"
            alt="Edit post"
            width={24}
            height={24}
          />
        </Link>
      </div>

      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>

          {
            post.tags[0] !== '' ?
              <ul className="flex gap-1 mt-2">
                {post.tags.map((tag: string) => (
                    <li key={tag} className="text-light-3">
                      #{tag}
                    </li>
                  )
                )}
              </ul>
              : ''
          }
        </div>

        <img
          className="post-card-img"
          src={post.imageUrl}
          alt="post image"
        />
      </Link>

      <PostStats post={post} userId={user.id}/>
    </div>
  )
}

export default PostCard
