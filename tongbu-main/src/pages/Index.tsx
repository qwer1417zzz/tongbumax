import { useContent } from '@/contexts/ContentContext';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { content, isLoading } = useContent();
  const navigate = useNavigate();

  const handleImageClick = () => {
    navigate('/detail');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-12 safe-area-top safe-area-bottom">
      {/* 标题区域 */}
      <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight">
          {content.home.title}
        </h1>
        <p className="text-lg text-muted-foreground">
          {content.home.subtitle}
        </p>
      </div>

      {/* 封面图片 */}
      <div 
        className="w-full max-w-md animate-fade-in-scale cursor-pointer"
        style={{ animationDelay: '0.3s' }}
        onClick={handleImageClick}
      >
        <div className="image-container card-ios aspect-[9/16] max-h-[60vh] mx-auto">
          <img
            src={content.home.coverImage}
            alt="封面图片"
            className="image-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* 提示文字 */}
      <p 
        className="mt-8 text-sm text-muted-foreground animate-fade-in-up touch-feedback"
        style={{ animationDelay: '0.5s' }}
        onClick={handleImageClick}
      >
        点击图片查看更多 →
      </p>
    </div>
  );
};

export default Index;
