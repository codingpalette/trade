import { Database } from "@/type/database.types";

import Image from "next/image";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export interface Artwork {
  artist: string;
  art: string;
}

export const works: Artwork[] = [
  {
    artist: "Ornella Binni",
    art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80",
  },
  {
    artist: "Tom Byrom",
    art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
  },
  {
    artist: "Vladimir Malyavko",
    art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
  },
];

interface ProductContentProps {
  data: Database["public"]["Tables"]["products"]["Row"] & {
    product_images: Database["public"]["Tables"]["product_images"]["Row"][];
    profiles: Database["public"]["Tables"]["profiles"]["Row"] | null;
  };
}

export default function ProductContent({ data }: ProductContentProps) {
  return (
    <>
      <div className="mx-auto my-4">
        <h2 className="mb-4 text-2xl font-semibold">{data?.title}</h2>
        <p className="mb-8 leading-relaxed">{data?.content}</p>
        {data.product_images.length > 0 && (
          <>
            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
              <div className="flex w-max space-x-4 p-4">
                {data?.product_images.map((artwork) => (
                  <div key={artwork.id} className="shrink-0">
                    <div className="relative overflow-hidden">
                      <Image
                        src={`${artwork.image_url}/middle`}
                        alt={`Photo by ${artwork.id}`}
                        className="h-full w-full object-cover"
                        width={300}
                        height={400}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </>
        )}
      </div>
    </>
  );
}
