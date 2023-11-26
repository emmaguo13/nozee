export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "nozee",
  description: "zkp-based authentication using jwt",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Login",
      href: "/login",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Privacy",
      href: "/privacy",
    },
    {
      title: "Guidelines",
      href: "/guidelines",
    },
  ],
  links: {
    github: "https://github.com/sehyunc/nozee",
  },
}
