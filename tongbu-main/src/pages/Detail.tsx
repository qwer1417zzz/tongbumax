import { useContent } from '@/contexts/ContentContext';
import { useNavigate } from 'react-router-dom';
import CardSwiper from '@/components/CardSwiper';
import { ArrowLeft } from 'lucide-react';

const Detail = () => {
  const { content, isLoading } = useContent();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 glass px-4 py-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors touch-feedback"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">返回</span>
        </button>
      </header>

      {/* 标题区域 */}
      <section className="px-6 pt-8 pb-4 text-center animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 tracking-tight">
          {content.detail.title}
        </h1>
        <p className="text-muted-foreground">
          {content.detail.subtitle}
        </p>
      </section>

      {/* 卡片滑动区域 */}
      <section className="py-6 animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
        <CardSwiper images={content.detail.cards} />
      </section>

      {/* 二维码区域 */}
      <section className="px-6 py-8 flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="qr-container flex flex-col items-center">
          <div className="w-40 h-40 rounded-xl overflow-hidden bg-background mb-4">
            <img
              src={content.detail.qrImage}
              alt="二维码"
              className="w-full h-full object-contain"
              // 支持长按识别
              data-long-press="true"
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            {content.detail.qrText}
          </p>
        </div>
      </section>

      {/* 底部安全区域占位 */}
      <div className="h-8" />
    </div>
  );
};

export default Detail;
