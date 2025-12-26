'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, ThumbsUp, ThumbsDown, Calendar, DollarSign, MapPinned, Trees } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import type { City } from '@/lib/types';

interface CityCardProps {
  city: City;
}

export function CityCard({ city }: CityCardProps) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(city.likes);
  const [dislikeCount, setDislikeCount] = useState(city.dislikes);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`city-${city.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'cities',
          filter: `id=eq.${city.id}`,
        },
        (payload: any) => {
          if (payload.new) {
            setLikeCount(payload.new.likes);
            setDislikeCount(payload.new.dislikes);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [city.id, supabase]);

  const handleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const newLiked = !liked;
      const newLikeCount = newLiked ? likeCount + 1 : likeCount - 1;
      const newDislikeCount = liked && disliked ? dislikeCount : disliked ? dislikeCount - 1 : dislikeCount;

      setLiked(newLiked);
      setLikeCount(newLikeCount);
      if (disliked) {
        setDisliked(false);
        setDislikeCount(newDislikeCount);
      }

      const { error } = await supabase
        .from('cities')
        .update({
          likes: newLikeCount,
          dislikes: newDislikeCount,
        })
        .eq('id', city.id);

      if (error) {
        console.error('Error updating likes:', error);
        setLiked(!newLiked);
        setLikeCount(likeCount);
        if (disliked !== (liked && disliked ? false : disliked ? false : disliked)) {
          setDisliked(disliked);
          setDislikeCount(dislikeCount);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDislike = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const newDisliked = !disliked;
      const newDislikeCount = newDisliked ? dislikeCount + 1 : dislikeCount - 1;
      const newLikeCount = disliked && liked ? likeCount : liked ? likeCount - 1 : likeCount;

      setDisliked(newDisliked);
      setDislikeCount(newDislikeCount);
      if (liked) {
        setLiked(false);
        setLikeCount(newLikeCount);
      }

      const { error } = await supabase
        .from('cities')
        .update({
          likes: newLikeCount,
          dislikes: newDislikeCount,
        })
        .eq('id', city.id);

      if (error) {
        console.error('Error updating dislikes:', error);
        setDisliked(!newDisliked);
        setDislikeCount(dislikeCount);
        if (liked !== (disliked && liked ? false : liked ? false : liked)) {
          setLiked(liked);
          setLikeCount(likeCount);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={city.cover_image || 'https://images.unsplash.com/photo-1517154421773-0529f29ea451'}
          alt={city.name_ko}
          fill
          className="object-cover transition-transform group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-bold text-xl">{city.name_ko}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{city.name_en}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {city.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-2 pb-4">
        {/* 필터 정보 Key-Value */}
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">예산:</span>
            <span className="font-medium">{city.budget}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinned className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">지역:</span>
            <span className="font-medium">{city.region}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trees className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">환경:</span>
            <span className="font-medium">{city.environment?.join(', ') || '-'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">최고 계절:</span>
            <span className="font-medium">{city.best_season?.join(', ') || '-'}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-2 pt-4 border-t">
        {/* 좋아요 버튼 */}
        <Button
          variant={liked ? 'default' : 'outline'}
          size="sm"
          onClick={handleLike}
          disabled={isLoading}
          className={liked ? 'bg-red-500 hover:bg-red-600' : ''}
        >
          <ThumbsUp className="h-4 w-4 mr-2" />
          <span>{likeCount}</span>
        </Button>

        {/* 싫어요 버튼 */}
        <Button
          variant={disliked ? 'default' : 'outline'}
          size="sm"
          onClick={handleDislike}
          disabled={isLoading}
          className={disliked ? 'bg-blue-500 hover:bg-blue-600' : ''}
        >
          <ThumbsDown className="h-4 w-4 mr-2" />
          <span>{dislikeCount}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
