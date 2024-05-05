import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSignOutAccount } from '@/lib/react-query/queryAndMutations.ts';
import { useUserContext } from '@/context/AuthContext.tsx';
import { SIDE_BAR_LINKS } from '@/constants';
import { INavLink } from "@/types";
import { Button } from "@/components/ui/button.tsx";

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const { mutate: signOut, isSuccess } = useSignOutAccount()
  const navigate = useNavigate()
  const { user } = useUserContext()

  useEffect(() => {
    if (isSuccess) {
      navigate('/sign-in');
    }
  }, [isSuccess]);

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/logos/logo.png"
            alt="logo"
            width={48}
          />
        </Link>

        <Link
          to={`profile/${user.id}`}
          className="flex gap-3 items-center"
        >
          <img
            className="rounded-full"
            src={user.imageUrl || "/assets/images/profile.svg"}
            alt="My profile"
            width={36}
            height={36}
          />
          <div className="flex flex-col">
            <p className="text-base font-bold">{user.name}</p>
            <p className="text-xs text-light-3">{user.email}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {SIDE_BAR_LINKS.map((link: INavLink) => {
            const isActive = pathname === link.to;

            return (
              <li
                key={link.to}
                className={
                 `leftsidebar-link group p-2 ${isActive && 'bg-primary-500'}`
                }
              >
                <Link to={link.to} className="flex gap-3 items-center">
                  <img
                    className={
                    `group-hover:invert-white ${isActive && 'invert-white'}`
                    }
                    src={`/assets/images/${link.image}.svg`}
                    alt={link.text}
                    width={24}
                    height={24}
                  />
                  <p className="text-base font-bold">{link.text}</p>
                </Link>
              </li>
            )}
          )}
        </ul>
    </div>

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
        <p className="">Logout</p>
      </Button>
</nav>
)
  ;
};

export default LeftSidebar;
