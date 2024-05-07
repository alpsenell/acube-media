import PostForm from "@/components/forms/PostForm.tsx"
import { useParams } from "react-router-dom"
import { useGetPostById } from "@/lib/react-query/queryAndMutations.ts";
import Spinner from "@/components/common/Spinner.tsx";

const EditPost = () => {
  const { id } = useParams()
  // @ts-expect-error library error
  const { data: post, isPending } = useGetPostById(id)

  if (isPending) {
    return <Spinner />
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start">
          <img
            src="/assets/images/create-post.svg"
            alt="create"
            height={24}
            width={24}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">
            Edit the Post
          </h2>
        </div>

        <PostForm action="Update" post={post} />
      </div>
    </div>
  )
}

export default EditPost
