import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SiteContent {
  home: {
    title: string;
    subtitle: string;
    coverImage: string;
  };
  detail: {
    title: string;
    subtitle: string;
    cards: string[];
    qrImage: string;
    qrText: string;
  };
}

const defaultContent: SiteContent = {
  home: {
    title: "探索无限可能",
    subtitle: "开启您的专属之旅",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=1200&fit=crop",
  },
  detail: {
    title: "精选内容",
    subtitle: "为您呈现最优质的体验",
    cards: [
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&h=900&fit=crop",
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=600&h=900&fit=crop",
      "https://images.unsplash.com/photo-1560015534-cee980ba7e13?w=600&h=900&fit=crop",
      "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&h=900&fit=crop",
      "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=600&h=900&fit=crop",
    ],
    qrImage: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://example.com",
    qrText: "长按二维码扫码",
  },
};

interface ContentContextType {
  content: SiteContent;
  setContent: (content: SiteContent) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const API_URL = '/api/content';

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从 API 加载内容
  const fetchContent = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          setContentState(data);
        }
      } else {
        throw new Error('Failed to fetch content');
      }
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Failed to load content');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // 更新内容到 API
  const setContent = async (newContent: SiteContent) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContent),
      });
      
      if (response.ok) {
        setContentState(newContent);
      } else {
        throw new Error('Failed to save content');
      }
    } catch (err) {
      console.error('Error saving content:', err);
      throw err;
    }
  };

  return (
    <ContentContext.Provider value={{ content, setContent, isLoading, error }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within ContentProvider');
  }
  return context;
}
