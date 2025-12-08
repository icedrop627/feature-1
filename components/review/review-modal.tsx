'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, DollarSign, Wifi, Coffee, Bus, Utensils, Shield } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityName: string;
}

export function ReviewModal({ isOpen, onClose, cityName }: ReviewModalProps) {
  const [overallRating, setOverallRating] = useState(0);
  const [costRating, setCostRating] = useState(0);
  const [internetRating, setInternetRating] = useState(0);
  const [workspaceRating, setWorkspaceRating] = useState(0);
  const [transportRating, setTransportRating] = useState(0);
  const [foodRating, setFoodRating] = useState(0);
  const [safetyRating, setSafetyRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [stayDuration, setStayDuration] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI only - no actual functionality
    console.log('Review submitted:', {
      cityName,
      overallRating,
      ratings: { costRating, internetRating, workspaceRating, transportRating, foodRating, safetyRating },
      title,
      content,
      stayDuration,
    });
    onClose();
  };

  const RatingStars = ({ rating, setRating, icon: Icon, label }: any) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <Label className="text-sm">{label}</Label>
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`h-6 w-6 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground/30'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">{rating > 0 ? rating : '-'}</span>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{cityName} 리뷰 작성</DialogTitle>
          <DialogDescription>
            실제 경험을 공유하여 다른 노마드들에게 도움을 주세요
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Overall Rating */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">종합 평점</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setOverallRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= overallRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-lg font-semibold">
                {overallRating > 0 ? `${overallRating}.0` : '평가해주세요'}
              </span>
            </div>
          </div>

          <Separator />

          {/* Detailed Ratings */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">세부 평가</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RatingStars
                rating={costRating}
                setRating={setCostRating}
                icon={DollarSign}
                label="생활비 (가성비)"
              />
              <RatingStars
                rating={internetRating}
                setRating={setInternetRating}
                icon={Wifi}
                label="인터넷 속도"
              />
              <RatingStars
                rating={workspaceRating}
                setRating={setWorkspaceRating}
                icon={Coffee}
                label="작업 공간"
              />
              <RatingStars
                rating={transportRating}
                setRating={setTransportRating}
                icon={Bus}
                label="대중교통"
              />
              <RatingStars
                rating={foodRating}
                setRating={setFoodRating}
                icon={Utensils}
                label="음식/맛집"
              />
              <RatingStars
                rating={safetyRating}
                setRating={setSafetyRating}
                icon={Shield}
                label="치안/안전"
              />
            </div>
          </div>

          <Separator />

          {/* Stay Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">체류 기간</Label>
            <Select value={stayDuration} onValueChange={setStayDuration}>
              <SelectTrigger id="duration">
                <SelectValue placeholder="선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1week">1주일 미만</SelectItem>
                <SelectItem value="1-2weeks">1-2주</SelectItem>
                <SelectItem value="2-4weeks">2-4주</SelectItem>
                <SelectItem value="1-3months">1-3개월</SelectItem>
                <SelectItem value="3months+">3개월 이상</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Review Title */}
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              type="text"
              placeholder="리뷰 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Review Content */}
          <div className="space-y-2">
            <Label htmlFor="content">상세 리뷰</Label>
            <textarea
              id="content"
              className="w-full min-h-[150px] px-3 py-2 text-sm rounded-md border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              placeholder="이 도시에서의 경험을 상세히 적어주세요&#10;&#10;- 어떤 점이 좋았나요?&#10;- 어떤 점이 아쉬웠나요?&#10;- 다른 노마드들에게 팁이 있다면?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">최소 50자 이상 작성해주세요</p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" className="flex-1">
              리뷰 등록하기
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
