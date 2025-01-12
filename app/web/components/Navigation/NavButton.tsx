import { Typography, TypographyProps } from "@mui/material";
import classNames from "classnames";
import NotificationBadge from "components/NotificationBadge";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { baseRoute } from "routes";

import { useNavLinkStyles } from "./useNavLinkStyles";

interface NavButtonProps {
  route: string;
  label: string;
  labelVariant?: Exclude<TypographyProps["variant"], undefined>;
  notificationCount?: number;
}

export default function NavButton({
  route,
  label,
  labelVariant = "h3",
  notificationCount,
}: NavButtonProps) {
  const classes = useNavLinkStyles();
  const pathname = usePathname() || "";
  const isActive =
    route === baseRoute ? pathname === route : pathname.includes(route);

  return (
    <Link
      href={route}
      className={classNames(classes.link, {
        [classes.notification]: !!notificationCount,
        [classes.selected]: isActive,
      })}
    >
      <NotificationBadge count={notificationCount}>
        <Typography variant={labelVariant} className={classes.label} noWrap>
          {label}
        </Typography>
      </NotificationBadge>
    </Link>
  );
}
