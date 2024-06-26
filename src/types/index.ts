export type INewUser = {
  name: string;
  email: string;
  password: string;
  username: string;
}

export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
}

export type IUser = {
  email: string;
  name: string;
  username: string;
  id: string;
  imageUrl: string;
  bio: string;
}

export type INavLink = {
  image: string;
  to: string;
  text: string;
}

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  imageId: string;
  imageUrl: URL;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};
