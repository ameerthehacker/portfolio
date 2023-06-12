import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://www.ameerthehacker.xyz",
  author: "Ameer Jhan",
  desc: "Ameer Jhan's life on the internet",
  title: "@ameerthehacker",
  ogImage: "ameer-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 3,
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/ameerthehacker",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/ameerthehacker/",
    linkTitle: `${SITE.title} on Instagram`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/ameerthehacker/",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:ameerjhanprof@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/ameerthehacker",
    linkTitle: `${SITE.title} on Twitter`,
    active: true,
  },
];
