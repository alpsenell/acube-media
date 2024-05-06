import { Link, useLocation } from "react-router-dom";
import { BOTTOM_BAR_LINKS } from "@/constants";
import { INavLink } from "@/types";

const BottomBar = () => {
  const { pathname } = useLocation();

  return (
    <section className="bottom-bar">
      {BOTTOM_BAR_LINKS.map((link: INavLink) => {
        const isActive = pathname === link.to;

        return (
          <Link
            key={link.to}
            to={link.to}
            className={
              `flex-center flex-col gap-1 p-2 transition
              ${isActive && 'bg-primary-500 rounded-[12px]'}`
            }
          >
            <img
              className={
                `${isActive && 'invert-white'}`
              }
              src={`/assets/images/${link.image}.svg`}
              alt={link.text}
              width={16}
              height={16}
            />
            <p className="text-light-2 text-xs">{link.text}</p>
          </Link>
        )}
      )}
    </section>
  );
};

export default BottomBar;
