# Work in progress
## A social media application showcase. 
### Built with React / Typescript / Vite

Built as a showcase for a social media application. The application is built with React, Typescript and Vite. The application uses Appwrite as a backend service for authentication, database and file storage. The application is a showcase for a social media application where users can create posts, like posts, comment on posts and follow other users. The application is built with a mobile first approach and is responsive.

### Live showcase built & deployed it Vercel
[Demo Link](https://acube-media.vercel.app/)

#### Packages used:

Styling: [Tailwind](https://tailwindcss.com/) \
Database: [Appwrite](https://appwrite.io) \
Routing: [React Router](https://reactrouter.com/) \
Some UI Components: [ShadCN](https://ui.shadcn.com/docs)

```Node version min. requirement: v20 and higher```

#### How to run:
Create a `.env.local` file and populate the values with you account details.
````
VITE_APPWRITE_PROJECT_ID=
VITE_APPWRITE_URL='https://cloud.appwrite.io/v1'
VITE_APPWRITE_MEDIA_STORAGE_ID=
VITE_APPWRITE_DATABASE_ID=

VITE_SAVES_COLLECTION_ID=
VITE_USER_COLLECTION_ID=
VITE_POST_COLLECTION_ID=
````

Install packages
``npm install``\
Run application on dev mode
``npm run dev``\
Create a production build
``npm run build``
