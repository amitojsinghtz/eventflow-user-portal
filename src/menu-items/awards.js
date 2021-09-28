import { IconListCheck, IconArchive, IconFileText, IconUser } from '@tabler/icons'

//-----------------------|| AWARDS MENU ITEMS ||-----------------------//




export const awards = {
  id: 'main-menu',
  type: 'group',
  children: [
    {
      id: 'submit-entry',
      title: 'Start Submission',
      type: 'item',
      url: '/submission/form',
      icon: IconListCheck,
      breadcrumbs: false,
    },
    // {
    //   id: 'entry-cart',
    //   title: 'Submission Cart',
    //   type: 'item',
    //   url: '/cart',
    //   icon: IconShoppingCart,
    //   breadcrumbs: false,
    // },
    {
      id: 'entry-records',
      title: 'Submission Records',
      type: 'item',
      url: '/submission/list',
      icon: IconFileText,
      breadcrumbs: false,
    },
    {
      id: 'paid-records',
      title: 'Paid Records',
      type: 'item',
      url: '/records',
      icon: IconArchive,
      breadcrumbs: false,
    },
    // {
    //   id: 'entry-records',
    //   title: 'Submission Records',
    //   type: 'item',
    //   url: '/records',
    //   icon: IconFileText,
    //   breadcrumbs: false,
    // },
  ],
}

export const profile = {
  id: 'profile-menu',
  type: 'group',
  children: [
    // {
    //     id: 'profile',
    //     title: 'User Profile',
    //     type: 'item',
    //     url: '/edit/profile',
    //     icon: IconUser,
    //     breadcrumbs: false
    // },
    {
      id: 'profile',
      title: 'Entrant Profile',
      type: 'item',
      url: '/entrant/form',
      icon: IconUser,
      breadcrumbs: false,
    },
  ],
}

