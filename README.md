<h1 align="center">Dashboard Application for NetProc processors activity</h1>

<br />
The net processor use the CSToken service to get connected into a backend pool of processors to 
provide functionality to the front end applications. Uses the CSToken service api to show the request and 
acquire of the shared token to enter the CS in the pool of netproc processor.

<br />

# 🧬 Project structure

This is the structure of the files in the project:

```
────┐
    ├── public                # files for online access
    │   ├── styles            # public styles
    │   │   └── coastalDream.jpgvite.svg
    │   └── vite.svg
    ├── src                   # React web application source
    │   ├── client             
    │   │   └── wsock.ts      # connect to a ws service
    │   ├── components        # dir of Components on pages
    │   │   ├── AddPostForm.tsx
    │   │   ├── Banner.tsx
    │   │   ├── Card.tsx
    │   │   ├── Countdown.tsx
    │   │   ├── CountdownCreate.tsx
    │   │   ├── CountdownList.tsx
    │   │   ├── DateDisplay.tsx
    │   │   ├── Dropdown.tsx
    │   │   ├── Greeting.tsx
    │   │   ├── ImageIcon.tsx
    │   │   ├── Moderation.tsx
    │   │   ├── NavBar.tsx
    │   │   ├── PopularCards.tsx
    │   │   ├── PostComponent.tsx
    │   │   ├── ReactionButton.tsx
    │   │   ├── SearchBar.tsx
    │   │   ├── SignOut.tsx
    │   │   ├── Skeleton.tsx
    │   │   ├── SortableTable.tsx
    │   │   ├── StatusAlert.tsx
    │   │   ├── Table.tsx
    │   │   └── TableMode.ts
    │   ├── context           # dir of react context and provider 
    │   │   └── websocket.ts  # context websocket message by service
    │   ├── hooks             # dir of Use hooks for shared actions
    │   │   ├── use-colour-scheme.tsx
    │   │   ├── use-signedin-authenticate.tsx
    │   │   ├── use-sort.tsx
    │   │   └── use-websocket-context.tsx
    │   ├── pages             # dir of Pages from a route with react router
    │   │   ├── dashboard
    │   │   │   ├── ClientNode.tsx
    │   │   │   ├── ClientToken.tsx
    │   │   │   ├── Dashboard.tsx
    |   │   │   └── NetworkList.tsx
    │   │   ├── CountdownPage.tsx
    │   │   ├── FlipImagePage.tsx
    │   │   ├── HomePage.tsx
    │   │   ├── LivePosts.tsx
    │   │   ├── LivePostsPage.tsx
    │   │   ├── NotFoundPage.tsx
    │   │   ├── ProtectedRoute.tsx
    │   │   ├── SignIn.tsx
    │   │   ├── SignUp.tsx
    │   │   ├── TTTPage.tsx
    │   │   └── UserPage.tsx
    │   ├── resources         # dir of Constants var
    │   │   ├── api-constants.ts
    │   │   └── routes-constants.ts
    │   ├── store             # dir of Redux reducers
    │   │   ├── actions
    |   │   │   ├── data.ts   # dispatch actions to data state in root store
    |   │   │   └── ttt.ts    # dispatch actions to tictactoe in root store
    │   │   ├── api           # Redux toolkit create api reducers
    |   │   │   ├── authenticatedUsersApi.tsx
    |   │   │   ├── authorUsersSlice.ts
    |   │   │   ├── cstokenSlice.ts
    |   │   │   ├── ipApi.ts
    |   │   │   └── postsSlice.ts
    │   │   ├── reducers
    |   │   │   ├── data.ts   
    |   │   │   ├── store.ts   # Compined reducers to a root state  
    |   │   │   ├── theme.ts  
    |   │   │   └── ttt.ts  
    │   │   └── services
    |   │       └── baseQueryWithReauth.ts  
    |   │
    │   ├── styles           
    │   │   ├── coastal-32x32
    │   │   ├── favicon-32x32
    │   │   └── main.scss
    │   ├── theme           
    │   │   └── colorMap.ts
    │   ├── types              # dir of typescript types
    │   │   ├── authuser.ts
    │   │   ├── coutdown.ts
    │   │   ├── cstoken.ts
    │   │   ├── geoLocation.ts
    │   │   ├── imageData.ts
    │   │   ├── index.ts
    │   │   ├── livePosts.ts
    │   │   ├── statusErrors.ts
    │   │   ├── ttt.ts
    │   │   └── wsuser.ts
    │   ├── utility            # dir of shared functions
    │   │   ├── date.ts
    │   │   ├── DrawingTTT.ts
    │   │   ├── fetchData.ts
    │   │   ├── functions.ts
    │   │   └── searchImage.ts
    │   ├── App.tsx            # App component
    │   ├── homepage.json
    │   ├── main.tsx           # main react entry point to html
    │   ├── RootComponent.tsx  # Router component for react router
    │   └── vite-env.d.ts
    ├── .dockerignore
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── README.md
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.js
```

<br/>

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
## Vite/React/Lint Package json

Production build:
    "react": "^19.1.0",

Modern dev dependencies for Vite 7 + React 19 + Lint 9 versions.

- "@vitejs/plugin-react": "^4.6.0"
- "vite": "^7.0.4"
- "eslint": "^9.14.0"
- "@typescript-eslint/parser": "^8.12.0"
- "@typescript-eslint/eslint-plugin": "^8.12.0"
- "eslint-plugin-react-hooks": "^5.2.0"
- "eslint-plugin-react-refresh": "^0.4.20"
- "@eslint/config-array": "^0.23.0"
- "@eslint/eslintrc": "^3.1.0"

### Other dev dependencies versions
- "@types/lodash": "^4.17.20"
- "@types/node": "^24.0.15"
- "@types/react": "^19.1.8"
- "@types/react-dom": "^19.1.6"
- "classnames": "^2.3.2"
- "globals": "^16.3.0"
- "sass": "^1.89.2"
- "typescript": "~5.8.3"
