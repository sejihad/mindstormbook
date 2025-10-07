import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { clearErrors, getCategory } from "../actions/categoryAction";
import Loader from "./layout/Loader/Loader";
const Categories = () => {
  const dispatch = useDispatch();
  const { loading, error, categories } = useSelector(
    (state) => state.categories
  );
  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const animationFrameId = useRef(null);
  const clickStartX = useRef(0);
  const clickStartY = useRef(0);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    // Prevent text selection during drag
    const preventSelection = (e) => {
      if (isDragging) {
        e.preventDefault();
      }
    };

    // Handle mouse down - start drag or click
    const handleMouseDown = (e) => {
      clickStartX.current = e.clientX;
      clickStartY.current = e.clientY;
      setIsDragging(false); // Reset dragging state
      slider.style.cursor = "grabbing";
      slider.style.scrollBehavior = "auto";
      startX.current = e.pageX - slider.offsetLeft;
      scrollLeft.current = slider.scrollLeft;
    };

    // Handle mouse move - determine if it's a drag
    const handleMouseMove = (e) => {
      const moveX = Math.abs(e.clientX - clickStartX.current);
      const moveY = Math.abs(e.clientY - clickStartY.current);

      // Only consider it dragging if movement is more than 5px (to distinguish from click)
      if (moveX > 5 || moveY > 5) {
        setIsDragging(true);
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX.current) * 2;
        slider.scrollLeft = scrollLeft.current - walk;
      }
    };

    // Handle mouse up - end drag or process click
    const handleMouseUp = (e) => {
      slider.style.cursor = "grab";
      slider.style.scrollBehavior = "smooth";

      // If it was a drag, prevent click actions
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
      setIsDragging(false);
    };

    // Touch event handlers for mobile
    const handleTouchStart = (e) => {
      clickStartX.current = e.touches[0].clientX;
      clickStartY.current = e.touches[0].clientY;
      setIsDragging(false);
      slider.style.scrollBehavior = "auto";
      startX.current = e.touches[0].pageX - slider.offsetLeft;
      scrollLeft.current = slider.scrollLeft;
    };

    const handleTouchMove = (e) => {
      const moveX = Math.abs(e.touches[0].clientX - clickStartX.current);
      const moveY = Math.abs(e.touches[0].clientY - clickStartY.current);

      if (moveX > 5 || moveY > 5) {
        setIsDragging(true);
        e.preventDefault();
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - startX.current) * 2;
        slider.scrollLeft = scrollLeft.current - walk;
      }
    };

    const handleTouchEnd = (e) => {
      slider.style.scrollBehavior = "smooth";
      if (isDragging) {
        e.preventDefault();
      }
      setIsDragging(false);
    };

    // Auto-scroll logic
    const autoScroll = () => {
      if (!isDragging) {
        const slider = sliderRef.current;
        if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) {
          slider.scrollLeft = 0;
        } else {
          slider.scrollLeft += 0.5; // Slower scroll speed for better UX
        }
      }
      animationFrameId.current = requestAnimationFrame(autoScroll);
    };

    // Start auto-scroll
    animationFrameId.current = requestAnimationFrame(autoScroll);

    // Add event listeners
    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mousemove", handleMouseMove);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mouseleave", handleMouseUp);
    slider.addEventListener("selectstart", preventSelection);
    slider.addEventListener("touchstart", handleTouchStart, { passive: false });
    slider.addEventListener("touchmove", handleTouchMove, { passive: false });
    slider.addEventListener("touchend", handleTouchEnd);

    return () => {
      // Cleanup
      cancelAnimationFrame(animationFrameId.current);
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mousemove", handleMouseMove);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mouseleave", handleMouseUp);
      slider.removeEventListener("selectstart", preventSelection);
      slider.removeEventListener("touchstart", handleTouchStart);
      slider.removeEventListener("touchmove", handleTouchMove);
      slider.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section className="py-10 bg-gradient-to-br from-indigo-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Browse by Category
            </h2>
            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide px-1 md:px-4 cursor-grab select-none py-5"
              style={{ scrollBehavior: "smooth", userSelect: "none" }}
            >
              {categories && categories.length > 0 ? (
                categories.map((cat, i) => (
                  <Link
                    to={`/category/${cat.slug}`}
                    key={`${cat.name}-${i}`}
                    className="flex flex-col items-center min-w-[100px] sm:min-w-[120px] transition-transform hover:scale-110 hover:shadow-xl flex-shrink-0"
                    onClick={(e) => {
                      if (isDragging) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                  >
                    <div className="bg-white p-4 rounded-full shadow-md hover:ring-2 hover:ring-indigo-500 transition duration-300">
                      <img
                        src={cat.image.url}
                        alt={cat.name}
                        className="w-14 h-14 object-contain"
                        draggable="false"
                      />
                    </div>
                    <p className="mt-3 text-sm font-medium text-gray-700 text-center uppercase tracking-wide">
                      {cat.name}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="w-full text-center text-gray-500 text-sm italic">
                  No categories available
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Categories;
