import { Models } from "appwrite"
import { Link } from "react-router-dom"

type ProfileCardProps = {
  user: Models.Document;
};

const ProfileCard = ({ user }: ProfileCardProps) => {
  return (
    <Link to={`/profile/${user.$id}`} className="user-card">
      <img
        src={user.imageUrl || "/assets/images/profile.svg"}
        alt="creator"
        loading="lazy"
        width={60}
        height={60}
        className="rounded-full"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>
    </Link>
  )
}

export default ProfileCard
