import Spinner from "@/components/common/Spinner.tsx"
import { useGetRecentPosts } from "@/lib/react-query/queryAndMutations.ts"
import { Models } from "appwrite"
import PostCard from "@/components/common/PostCard.tsx"

const Home = () => {
  const {
    data: posts,
    isPending: arePostsLoading,
  } = useGetRecentPosts()

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {
            arePostsLoading && !posts ? (
              <Spinner />
            ) : (
              <ul className="flex flex-col flex-1 gap-9 w-full">
                {
                  posts?.documents.map((post: Models.Document) => {
                    return (<PostCard key={post.caption} post={post} />)
                  })
                }
              </ul>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Home
