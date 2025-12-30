import { useState, useEffect } from 'react';
import { useContent, SiteContent } from '@/contexts/ContentContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, X, Save, Eye } from 'lucide-react';

const Admin = () => {
  const { content, setContent } = useContent();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<SiteContent>(content);
  const [newCardUrl, setNewCardUrl] = useState('');

  useEffect(() => {
    setFormData(content);
  }, [content]);

  const handleSave = async () => {
    try {
      await setContent(formData);
      toast({
        title: "保存成功",
        description: "内容已更新，访客刷新页面即可看到新内容",
      });
    } catch (error) {
      toast({
        title: "保存失败",
        description: "请检查网络连接或重试",
        variant: "destructive",
      });
    }
  };

  const addCard = () => {
    if (!newCardUrl.trim()) {
      toast({
        title: "请输入图片 URL",
        variant: "destructive",
      });
      return;
    }
    setFormData({
      ...formData,
      detail: {
        ...formData.detail,
        cards: [...formData.detail.cards, newCardUrl.trim()],
      },
    });
    setNewCardUrl('');
  };

  const removeCard = (index: number) => {
    setFormData({
      ...formData,
      detail: {
        ...formData.detail,
        cards: formData.detail.cards.filter((_, i) => i !== index),
      },
    });
  };

  const moveCard = (index: number, direction: 'up' | 'down') => {
    const newCards = [...formData.detail.cards];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newCards.length) return;
    [newCards[index], newCards[newIndex]] = [newCards[newIndex], newCards[index]];
    setFormData({
      ...formData,
      detail: {
        ...formData.detail,
        cards: newCards,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 glass px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors touch-feedback"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">返回首页</span>
        </button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/detail')}
            className="gap-1"
          >
            <Eye size={16} />
            预览
          </Button>
          <Button size="sm" onClick={handleSave} className="gap-1">
            <Save size={16} />
            保存
          </Button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* 首页设置 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">
            首页设置
          </h2>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="home-title">主标题</Label>
              <Input
                id="home-title"
                value={formData.home.title}
                onChange={(e) => setFormData({
                  ...formData,
                  home: { ...formData.home, title: e.target.value }
                })}
                placeholder="输入首页主标题"
              />
            </div>
            
            <div>
              <Label htmlFor="home-subtitle">副标题</Label>
              <Input
                id="home-subtitle"
                value={formData.home.subtitle}
                onChange={(e) => setFormData({
                  ...formData,
                  home: { ...formData.home, subtitle: e.target.value }
                })}
                placeholder="输入首页副标题"
              />
            </div>
            
            <div>
              <Label htmlFor="home-cover">封面图 URL</Label>
              <Input
                id="home-cover"
                value={formData.home.coverImage}
                onChange={(e) => setFormData({
                  ...formData,
                  home: { ...formData.home, coverImage: e.target.value }
                })}
                placeholder="输入封面图片 URL"
              />
              {formData.home.coverImage && (
                <div className="mt-2 rounded-lg overflow-hidden w-32 h-48 bg-muted">
                  <img 
                    src={formData.home.coverImage} 
                    alt="封面预览" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 详情页设置 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">
            详情页设置
          </h2>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="detail-title">主标题</Label>
              <Input
                id="detail-title"
                value={formData.detail.title}
                onChange={(e) => setFormData({
                  ...formData,
                  detail: { ...formData.detail, title: e.target.value }
                })}
                placeholder="输入详情页主标题"
              />
            </div>
            
            <div>
              <Label htmlFor="detail-subtitle">副标题</Label>
              <Input
                id="detail-subtitle"
                value={formData.detail.subtitle}
                onChange={(e) => setFormData({
                  ...formData,
                  detail: { ...formData.detail, subtitle: e.target.value }
                })}
                placeholder="输入详情页副标题"
              />
            </div>
          </div>
        </section>

        {/* 卡片图片管理 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">
            卡片图片管理
          </h2>
          
          {/* 添加新卡片 */}
          <div className="flex gap-2">
            <Input
              value={newCardUrl}
              onChange={(e) => setNewCardUrl(e.target.value)}
              placeholder="输入图片 URL"
              onKeyDown={(e) => e.key === 'Enter' && addCard()}
            />
            <Button onClick={addCard} size="icon" variant="outline">
              <Plus size={20} />
            </Button>
          </div>

          {/* 卡片列表 */}
          <div className="space-y-2">
            {formData.detail.cards.map((card, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border"
              >
                <div className="w-12 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                  <img src={card} alt={`卡片 ${index + 1}`} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground truncate">{card}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => moveCard(index, 'up')}
                    disabled={index === 0}
                    className="h-8 w-8"
                  >
                    ↑
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => moveCard(index, 'down')}
                    disabled={index === formData.detail.cards.length - 1}
                    className="h-8 w-8"
                  >
                    ↓
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeCard(index)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 二维码设置 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">
            二维码设置
          </h2>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="qr-image">二维码图片 URL</Label>
              <Input
                id="qr-image"
                value={formData.detail.qrImage}
                onChange={(e) => setFormData({
                  ...formData,
                  detail: { ...formData.detail, qrImage: e.target.value }
                })}
                placeholder="输入二维码图片 URL"
              />
              {formData.detail.qrImage && (
                <div className="mt-2 rounded-lg overflow-hidden w-24 h-24 bg-muted">
                  <img 
                    src={formData.detail.qrImage} 
                    alt="二维码预览" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="qr-text">二维码说明文字</Label>
              <Input
                id="qr-text"
                value={formData.detail.qrText}
                onChange={(e) => setFormData({
                  ...formData,
                  detail: { ...formData.detail, qrText: e.target.value }
                })}
                placeholder="例如：长按二维码扫码"
              />
            </div>
          </div>
        </section>

        {/* 保存按钮 */}
        <div className="pt-4 pb-8">
          <Button onClick={handleSave} className="w-full" size="lg">
            <Save className="mr-2" size={20} />
            保存所有更改
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
