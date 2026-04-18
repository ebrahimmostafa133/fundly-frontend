import { useState } from "react";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { BACKEND_URL } from "../../../config";

interface Props {
  images: { id: number; image: string }[];
  title: string;
}

export default function ImageSlider({ images, title }: Props) {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 rounded-2xl h-72 flex items-center justify-center text-gray-400 text-sm">
        No images available
      </div>
    );
  }

  const buildUrl = (src: string) =>
    src.startsWith("http") ? src : `${BACKEND_URL}${src}`;

  const prev = () =>
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));

  const next = () =>
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gray-100 group">
      {/* Main Image */}
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={buildUrl(images[current].image)}
          alt={`${title} — photo ${current + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>

      {/* Arrow Controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100"
          >
            <TbChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100"
          >
            <TbChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-white w-5"
                  : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}

      {/* Counter Badge */}
      <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
        {current + 1} / {images.length}
      </div>
    </div>
  );
}
