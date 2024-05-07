import { useGetPostById } from "@/lib/react-query/queryAndMutations.ts";
import { Link, useParams } from "react-router-dom";
import Spinner from "@/components/common/Spinner.tsx";
import { timeAgo } from "@/helpers.ts";
import { useUserContext } from "@/context/AuthContext.tsx";
import { Button } from "@/components/ui/button.tsx";


const PostDetails = () => {
  const { id } = useParams()
  const { data: post, isPending } = useGetPostById(id || '')
  const { user } = useUserContext()

  const handleDeletePost = () => {

  }

  return (
    <div className="post_details-container">
      {isPending ? <Spinner /> : (
        <div className="post_details-card">
          <img
            className="post_details-img"
            src={post?.imageUrl}
            alt=""
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link to={`/profile/${post?.creator.$id}`} className="flex items-center gap-3">
                <img
                  className="rounded-full w-8 h-8 lg:h-12 lg:w-12"
                  src={post?.creator?.imageUrl}
                  alt="Post creator image"
                />

                <div className="flex flex-col">
                  <p className="text-sm text-light-1">
                    {post?.creator?.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="text-xs text-light-2">{timeAgo(post?.$createdAt)}</p>
                    -
                    <p className="text-xs text-light-2">{post?.location}</p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  className={user.id !== post?.creator.$id ? 'hidden' : ''}
                  to={`/update-post/${post?.$id}`}
                >
                  <img
                    src="/assets/images/edit.svg"
                    alt="Edit post"
                    width={28}
                    height={28}
                  />
                </Link>

                <Button
                  className={
                    `${user.id !== post?.creator.$id ? 'hidden' : ''}
                    ghost_details - delete_btn`
                  }
                  variant="ghost"
                  onClick={handleDeletePost}
                >
                  <img
                    src="/assets/images/delete.svg"
                    alt="Delete post"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="w-full border border-amber-700"/>

            <Link to={`/posts/${post?.$id}`}>
              <div className="small-medium lg:base-medium py-5">
                <p>{post?.caption}</p>

                {
                  post?.tags[0] !== '' ?
                    <ul className="flex gap-1 mt-2">
                      {post?.tags.map((tag: string) => (
                          <li key={tag} className="text-light-3">
                            #{tag}
                          </li>
                        )
                      )}
                    </ul>
                    : ''
                }
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetails
