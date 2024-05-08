import { Models } from "appwrite"
import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost
} from "@/lib/react-query/queryAndMutations.ts"
import React, { useEffect, useState } from "react"
import { isPostLiked } from "@/helpers.ts"
import Spinner from "@/components/common/Spinner.tsx"

type PostStatsProps = {
  post?: Models.Document,
  userId: string;
}

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList = post?.likes.map((user: Models.Document) => user.$id)

  const [likes, setLikes] = useState(likesList)
  const [isSaved, setIsSaved] = useState(false)

  const { mutate: likePost } = useLikePost()
  const { mutate: savePost, isPending: isSavingPost} = useSavePost()
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavedPost()

  const { data: currentUser } = useGetCurrentUser()

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post?.$id
  )

  useEffect(() => {
    setIsSaved(!!savedPostRecord)
  }, [currentUser])

  const handleLikePost = (event: React.MouseEvent) => {
    event.stopPropagation()

    let newLikes = [...likes]

    if (newLikes.includes(userId)) {
      newLikes = newLikes.filter((id) => id !== userId)
    } else {
      newLikes.push(userId)
    }

    setLikes(newLikes)
    likePost({ postId: post?.$id || '', likesArray: newLikes })
  }

  const handleSavePost = (event: React.MouseEvent) => {
    event.stopPropagation()

    if (savedPostRecord) {
      setIsSaved(false)
      deleteSavedPost(savedPostRecord.$id)

      return
    }

    savePost({ postId: post?.$id || '', userId })
    setIsSaved(true)
  }

  return (
    <div className="flex justify-between items-center z-20 mt-5">
      <div className="flex gap-2 mr-5">
        <img
          className="cursor-pointer"
          src={
            `${isPostLiked(likes, userId) 
              ? '/assets/images/saved-hearth.svg' : '/assets/images/hearth.svg' }`
          }
          alt="like"
          width={24}
          height={24}
          onClick={handleLikePost}
        />
        <p className="text-xs lg:text-sm">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        {isSavingPost || isDeletingSaved
          ? <Spinner/>
          : <img
            className="cursor-pointer"
            src={
              `${isSaved ? '/assets/images/saved.svg' : '/assets/images/save.svg' }`
            }
            alt="like"
            width={24}
            height={24}
            onClick={handleSavePost}
          />
        }
      </div>
    </div>
  )
}

export default PostStats
