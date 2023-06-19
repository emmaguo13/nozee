export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'nozee',
  description: 'zkp-based authentication using jwt',
  mainNav: [
    {
      title: 'Home',
      href: '/'
    },
    {
      title: 'Login',
      href: '/login'
    }
  ],
  links: {
    github: 'https://github.com/sehyunc/nozee'
  }
}
