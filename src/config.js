const config = {
  // basename: only at build time to set, and don't add '/' at end off BASENAME for breadcrumbs, also don't put only '/' use blank('') instead,
  // like '/berry-material-react/react/default'
  basename: '',
  defaultPath: '/',
  fontFamily: `'Roboto', sans-serif`,
  borderRadius: 6,
  outlinedFilled: true,
  theme: 'light',
  // 'en' - English, 'fr' - French, 'ro' - Romanian, 'zh' - Chinese
  i18n: 'en',
  rtlLayout: false,
  jwt: {
      secret: 'SECRET-KEY',
      timeout: '1 days'
  },
  firebase: {
      apiKey: 'AIzaSyBernKzdSojh_vWXBHt0aRhf5SC9VLChbM',
      authDomain: 'berry-material-react.firebaseapp.com',
      projectId: 'berry-material-react',
      storageBucket: 'berry-material-react.appspot.com',
      messagingSenderId: '901111229354',
      appId: '1:901111229354:web:a5ae5aa95486297d69d9d3',
      measurementId: 'G-MGJHSL8XW3'
  },
  auth0: {
      client_id: 'HvYn25WaEHb7v5PBT7cTYe98XATStX3r',
      domain: 'demo-localhost.us.auth0.com'
  }
};

export default config;
