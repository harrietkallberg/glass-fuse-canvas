
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Plus, Home, Users, MessageSquare } from "lucide-react";

const Navigation = () => {
  return (
    <div className="glass fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full flex items-center gap-6">
      <Link to="/" className="text-foreground font-medium">GlassFuse</Link>
      
      <div className="flex-1 flex justify-center gap-2">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="rounded-full">
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </Link>
        <Link to="/community">
          <Button variant="ghost" size="sm" className="rounded-full">
            <Users className="w-4 h-4 mr-2" />
            Community
          </Button>
        </Link>
        <Link to="/messages">
          <Button variant="ghost" size="sm" className="rounded-full">
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center gap-2">
        <Link to="/create">
          <Button size="sm" className="rounded-full bg-primary text-primary-foreground">
            <Plus className="w-4 h-4 mr-1" />
            New Curve
          </Button>
        </Link>
        <Link to="/profile">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Navigation;
