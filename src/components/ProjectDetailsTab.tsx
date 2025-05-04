
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProjectDetailsTabProps {
  notes: string;
  setNotes: (notes: string) => void;
  materials: string;
  setMaterials: (materials: string) => void;
  tags: string;
  setTags: (tags: string) => void;
  handleSave: () => void;
}

const ProjectDetailsTab = ({
  notes,
  setNotes,
  materials,
  setMaterials,
  tags,
  setTags,
  handleSave
}: ProjectDetailsTabProps) => {
  return (
    <div className="glass p-6 rounded-2xl bg-glass-100/20 backdrop-blur-sm space-y-6">
      <div>
        <Label htmlFor="notes">Project Notes</Label>
        <Textarea 
          id="notes" 
          placeholder="Add notes about your glass project..." 
          className="mt-1 min-h-[150px]"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      
      <div>
        <Label>Project Images</Label>
        <div className="mt-2 border-2 border-dashed border-muted rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-2">
            Drop images here or click to upload
          </p>
          <Button variant="outline" size="sm">
            Upload Images
          </Button>
        </div>
      </div>
      
      <div>
        <Label htmlFor="materials">Materials Used</Label>
        <Textarea 
          id="materials" 
          placeholder="List the glass materials used in this project..." 
          className="mt-1"
          rows={3}
          value={materials}
          onChange={(e) => setMaterials(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          placeholder="Add tags separated by commas (e.g. fused, bowl, blue)"
          className="mt-1"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      
      <Button className="w-full md:w-auto" onClick={handleSave}>Save Project Details</Button>
    </div>
  );
};

export default ProjectDetailsTab;
