
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import CommunityPost from "@/components/CommunityPost";

// Mock data for posts
const mockPosts = [
  {
    id: "1",
    username: "glassartist",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    title: "Sunset Gradient Bowl",
    description: "Created this bowl using a gradual cooling technique to achieve the rich orange to yellow transition.",
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    tags: ["bowl", "fused", "gradient", "sunset"],
    likes: 42,
    comments: 8,
    colorClass: "glass-orange"
  },
  {
    id: "2",
    username: "fusionmaster",
    avatarUrl: "https://i.pravatar.cc/150?img=2",
    title: "Layered Glass Pendant",
    description: "Experimented with multiple thin layers for this translucent pendant. Really happy with the depth effect!",
    imageUrl: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
    tags: ["pendant", "layered", "jewelry", "blue"],
    likes: 31,
    comments: 5,
    colorClass: "glass-turquoise"
  },
  {
    id: "3",
    username: "glasscrafted",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    title: "Desert Landscape Panel",
    description: "This wall panel was inspired by desert landscapes. Used a special slow cooling for the sand texture.",
    imageUrl: "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151",
    tags: ["panel", "landscape", "textured", "amber"],
    likes: 56,
    comments: 12,
    colorClass: "glass-yellow"
  },
  {
    id: "4",
    username: "glassalchemy",
    avatarUrl: "https://i.pravatar.cc/150?img=4",
    title: "Spring Flower Plate",
    description: "Created this plate with embedded flowers. The gentle slumping schedule preserved all the details.",
    imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
    tags: ["plate", "floral", "slumped", "green"],
    likes: 38,
    comments: 7,
    colorClass: "glass-green"
  },
];

// Categories for filtering
const categories = ["All", "Bowls", "Plates", "Jewelry", "Wall Art", "Sculptures"];
const popularTags = ["fused", "gradient", "textured", "layered", "slumped", "tack-fused"];

const Community = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="min-h-screen bg-glass-gradient-1 pb-20">
      <Navigation />
      
      <div className="container mx-auto pt-24 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Community Gallery</h1>
          <p className="text-muted-foreground">
            Explore and get inspired by amazing glass fusion projects
          </p>
        </div>
        
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search projects, materials, techniques..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setSearchQuery(tag)}
                >
                  #{tag}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="trending" className="mb-8">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
            </TabsList>
            
            <div className="flex overflow-x-auto gap-2 p-1 no-scrollbar">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "secondary" : "ghost"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          <TabsContent value="trending" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockPosts.map((post) => (
                <CommunityPost
                  key={post.id}
                  id={post.id}
                  username={post.username}
                  avatarUrl={post.avatarUrl}
                  title={post.title}
                  description={post.description}
                  imageUrl={post.imageUrl}
                  tags={post.tags}
                  likes={post.likes}
                  comments={post.comments}
                  colorClass={post.colorClass}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="mt-6">
            <div className="glass p-16 rounded-2xl flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-medium mb-2">Recent Projects</h3>
              <p className="text-muted-foreground mb-4">
                The latest glass fusion projects from the community
              </p>
              <p>This section will show the most recently added projects</p>
            </div>
          </TabsContent>
          
          <TabsContent value="following" className="mt-6">
            <div className="glass p-16 rounded-2xl flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-medium mb-2">Following Feed</h3>
              <p className="text-muted-foreground mb-4">
                Projects from artists you follow will appear here
              </p>
              <p>Once you follow some artists, their work will show up here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Community;
