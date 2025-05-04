
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, MessageSquare, Share2 } from 'lucide-react';

interface CommunityPostProps {
  id: string;
  username: string;
  avatarUrl?: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  likes: number;
  comments: number;
  colorClass?: string;
}

const CommunityPost = ({
  id,
  username,
  avatarUrl,
  title,
  description,
  imageUrl,
  tags,
  likes,
  comments,
  colorClass = 'glass-card'
}: CommunityPostProps) => {
  return (
    <Card className={`${colorClass} overflow-hidden border-none`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">by {username}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 space-y-3">
        <p className="text-sm">{description}</p>
        
        {imageUrl && (
          <div className="w-full rounded-md overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-48 object-cover" 
            />
          </div>
        )}
        
        <div className="flex flex-wrap gap-1">
          {tags.map(tag => (
            <span 
              key={tag} 
              className="text-xs bg-muted px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 justify-between">
        <div className="flex gap-1 text-sm text-muted-foreground">
          <span>{likes} likes</span>
          <span>•</span>
          <span>{comments} comments</span>
        </div>
        
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <BookmarkPlus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CommunityPost;
