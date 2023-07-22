import React, { createContext, useState } from 'react';

interface Category {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  category: Category;
  semi_categories: Array<string>;
  hashtags: Array<string>;
  photos: Array<string>;
  rep_pic: string;
}

interface ForestContextType {
  category: Category;
  setCategory: React.Dispatch<React.SetStateAction<Category>>;
  semiCategories: any[];
  setSemiCategories: React.Dispatch<React.SetStateAction<any[]>>;
  post: Post;
  setPost: React.Dispatch<React.SetStateAction<Post>>;
}

const ForestContext = createContext<ForestContextType>({
  category: { id: 0, name: '' },
  setCategory: () => {},
  semiCategories: [],
  setSemiCategories: () => {},
  post: { id: 0, title: "", subtitle: "", content: "", category: {id: 0, name: ''}, semi_categories: [], hashtags: [], photos: [], rep_pic: "" },
  setPost: () => {}
});

const ForestProvider = ({ children }: any) => {
  const [category, setCategory] = useState<Category>({ id: 0, name: '' });
  const [semiCategories, setSemiCategories] = useState<any[]>([]);
  const [post, setPost] = useState<Post>({ id: 0, title: "", subtitle: "", content: "", category: {id: 0, name: ''}, semi_categories: [], hashtags: [], photos: [], rep_pic: "" })

  return (
    <ForestContext.Provider value={{ category, setCategory, semiCategories, setSemiCategories, post, setPost }}>
      {children}
    </ForestContext.Provider>
  );
};

export { ForestContext, ForestProvider };
