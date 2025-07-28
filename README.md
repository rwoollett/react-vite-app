<h1 align="center">Dashboard Application for NetProc processors activity</h1>

<br />
The net processor use the CSToken service to get connected into a backend pool of processors to 
provide functionality to the front end applications. Uses the CSToken service api to show the request and 
acquire of the shared token to enter the CS in the pool of netproc processor.

<br />

# 🧬 Project structure

This is the structure of the files in the project:

```sh
    │
    ├── public                # files for online access
    │   └── vite.svg
    ├── src                   # React web application source
    │   ├── client             
    │   │   └── wsock.ts      # connect to a ws service
    │   ├── components        # dir of Components on pages
    │   │   ├── Banner.tsx
    │   │   ├── Button.tsx
    │   │   ├── DateDisplay.tsx
    │   │   ├── Dropdown.tsx
    │   │   ├── Greeting.tsx
    │   │   ├── NavBar.tsx
    │   │   ├── Signout.tsx
    │   │   ├── Skeleton.tsx
    │   │   ├── StatusAlert.tsx
    │   │   └── Table.tsx
    │   ├── context           # dir of react context and provider 
    │   │   └── websocket.ts  # context websocket message by service
    │   ├── hooks             # dir of Use hooks for shared actions
    │   │   ├── use-signedin-authenticate.tsx
    │   │   ├── use-sort.tsx
    │   │   └── use-websocket-context.tsx
    │   ├── pages             # dir of Pages from a route with react router
    │   │   ├── HomePage.tsx
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
    |   │   │   └── data.ts   # dispatch actions to data state in root store
    │   │   ├── api           # Redux toolkit create api reducers
    |   │   │   ├── ipApi.ts
    |   │   │   └── usersApi.ts
    │   │   └── reducers
    |   │       ├── data.ts   # General data reducer for app state
    |   │       └── store.ts  # Compined reducers to a root state
    |   │        # This exports the useAppSelector and useAppDispatch.
    |   │
    │   ├── styles            # dir of Styles (based with Bulma modular sass)
    │   │   ├── __mixins.scss
    │   │   ├── __variables.scss
    │   │   └── main.scss
    │   ├── types             # dir of typescript types
    │   │   ├── coutdown.ts
    │   │   ├── cstoken.ts
    │   │   ├── geoLocation.ts
    │   │   ├── imageData.ts
    │   │   ├── index.ts
    │   │   ├── statusErrors.ts
    │   │   ├── ttt.ts
    │   │   └── user.ts
    │   ├── utility           # dir of shared functions
    │   │   ├── date.ts
    │   │   ├── DrawingTTT.ts
    │   │   ├── functions.ts
    │   │   └── searchImage.ts
    │   ├── App.tsx           # App component
    │   ├── main.tsx          # main react entry point to html
    │   ├── RootComponent.tsx # Router component for react router
    │   └── vite-env.d.ts
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
