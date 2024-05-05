import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { useSignOutAccount } from "@/lib/react-query/queryAndMutations.ts";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext.tsx";

const TopBar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext()

  useEffect(() => {
    if (isSuccess) {
      navigate('/sign-in');
    }
  }, [isSuccess]);

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/logos/logo.png"
            alt="logo"
            width={48}
          />
        </Link>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}
          >
            <img
              src="/assets/images/logout.svg"
              alt="Log out"
              width={24}
              height={24}
            />
          </Button>

          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              className="rounded-full"
              src={user.imageUrl || "/assets/images/profile.svg"}
              alt="My profile"
              width={24}
              height={24}
            />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default TopBar;
