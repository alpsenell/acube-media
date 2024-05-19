import GridPostList from "@/components/common/GridPostList"
import Spinner from "@/components/common/Spinner.tsx"
import { useGetCurrentUser } from "@/lib/react-query/queryAndMutations.ts"

const LikedPosts = () => {
  const { data: currentUser } = useGetCurrentUser()

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Spinner />
      </div>
    )

  return (
    <>
      {currentUser.liked.length === 0 && (
        <p className="text-light-4">No liked posts</p>
      )}

      <GridPostList posts={currentUser.liked} showStats={false} />
    </>
  )
}

export default LikedPosts
