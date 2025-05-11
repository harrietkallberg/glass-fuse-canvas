
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

interface DashboardHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DashboardHeader = ({ searchQuery, setSearchQuery }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Your Firing Curves
        </h1>
        <p className="text-muted-foreground">Create and manage your glass fusion schedules</p>
      </div>
      
      <div className="flex gap-4 w-full md:w-auto">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <Link to="/create">
          <Button className="gap-1 bg-white/60 backdrop-blur-sm shadow-lg hover:bg-white/70 border border-white">
            New Curve
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
