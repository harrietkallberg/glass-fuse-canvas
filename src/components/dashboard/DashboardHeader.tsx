
import React from "react";
import SearchBar from "./SearchBar";

interface DashboardHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DashboardHeader = ({ searchQuery, setSearchQuery }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-white text-shadow-lg">
          Your Firing Curves
        </h1>
        <p className="text-muted-foreground">Create and manage your glass fusion schedules</p>
      </div>
      
      <div className="flex w-full md:w-auto">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
    </div>
  );
};

export default DashboardHeader;
