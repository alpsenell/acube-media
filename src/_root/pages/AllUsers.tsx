import { useToast } from "@/components/ui/use-toast"
import Spinner from "@/components/common/Spinner.tsx"
import { useGetUsers } from "@/lib/react-query/queryAndMutations.ts"
import ProfileCard from "@/components/common/ProfileCard.tsx"

const AllUsers = () => {
  const { toast } = useToast()

  const { data: users, isLoading, isError  } = useGetUsers()

  if (isError) {
    toast({ title: "Something went wrong." })

    return
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isLoading && !users ? (
          <Spinner />
        ) : (
          <ul className="user-grid">
            {users?.documents.map((user) => (
              <li key={user?.$id} className="flex-1 min-w-[200px] w-full  ">
                <ProfileCard user={user} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default AllUsers
