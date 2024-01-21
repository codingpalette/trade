import { Button } from "@/components/ui/button";
import { Camera, Menu } from "lucide-react";

export default function WritePage() {
  return (
    <>
      <div className="my-4">
        <Button variant="outline" size="icon">
          <Camera className="h-4 w-4" />
        </Button>
      </div>
      <div>
        <h1>WritePage</h1>
      </div>
    </>
  );
}
