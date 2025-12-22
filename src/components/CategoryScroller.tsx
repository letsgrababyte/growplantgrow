'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function CategoryScroller() {
  const router = useRouter();
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // All categories list
  const categories = [
    'Planners',
    'Journals',
    'Coloring Pages',
    'Wall Art',
    'Botanical Papers',
    'Garden Planners',
    'Wedding',
    'Kids & School',
    'Home Organizing',
    'Labels & Stickers',
    'Recipe Cards',
    'Business Templates',
    'Branding Kits',
    'Canva Templates',
    'Digital Notebooks',
    'GoodNotes Planners',
    'Activity Packs',
    'Ebooks',
    'Guides & Workbooks',
    'Bundles',
    'Mega Packs',
    'Seasonal',
    'Holiday',
    'Mindfulness',
    'Manifestation',
    'Moon Journals',
    'Classroom Posters',
    'Kids Printables',
    'Vintage Botanicals',
    'Freebies',
  ];
  
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState(categories);
  
  // Get current category from pathname
  const getCurrentCategory = () => {
    if (pathname?.startsWith('/shop/category/')) {
      const categoryFromPath = pathname.replace('/shop/category/', '');
      return decodeURIComponent(categoryFromPath);
    }
    return '';
  };
  
  const selectedCategory = getCurrentCategory();

  // Same grey color for all categories - gets darker on hover and click
  const uniformGreyClass = 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700';

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollability();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
      return () => {
        scrollElement.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [categories]);

  const handleCategoryClick = (category: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Navigate to dedicated category page
    const encodedCategory = encodeURIComponent(category);
    const url = `/shop/category/${encodedCategory}`;
    console.log('Navigating to category:', category, url);
    router.push(url);
  };

  // Filter categories based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredCategories(
        categories.filter((cat) => cat.toLowerCase().includes(query))
      );
    }
  }, [searchQuery, categories]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
  };

  const handleSearchFocus = () => {
    setShowDropdown(true);
  };

  const handleCategorySelect = (category: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('Dropdown category selected:', category);
    setSearchQuery('');
    setShowDropdown(false);
    const encodedCategory = encodeURIComponent(category);
    const url = `/shop/category/${encodedCategory}`;
    console.log('Navigating to:', url);
    router.push(url);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to shop page with search query
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowDropdown(false);
    } else {
      // If empty, navigate to all products
      router.push('/shop');
      setShowDropdown(false);
    }
  };

  const handleAllCategoriesClick = () => {
    // Navigate to shop page (all products)
    router.push('/shop');
    setSearchQuery('');
    setShowDropdown(false);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 py-2 sm:py-3">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-3 relative">
          {/* Scroll Left Button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="flex-shrink-0 p-2 sm:p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors z-10 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Scroll categories left"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Scrollable Categories Container with Fade Effects */}
          <div className="flex-1 relative overflow-hidden">
            {/* Fade gradient on the left - hides categories as they scroll off left side */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
            )}
            
            {/* Fade gradient on the right - hides categories as they scroll behind All Categories */}
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
            
            {/* Scrollable Categories */}
            <div
              ref={scrollRef}
              className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((category) => {
                const isSelected = category === selectedCategory;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Category button clicked:', category);
                      const encodedCategory = encodeURIComponent(category);
                      const url = `/shop/category/${encodedCategory}`;
                      console.log('Navigating to:', url);
                      router.push(url);
                    }}
                    className={`flex-shrink-0 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap min-h-[44px] cursor-pointer relative z-20 ${
                      isSelected 
                        ? 'bg-gray-300 ring-2 ring-gray-500 text-gray-900' 
                        : uniformGreyClass
                    }`}
                    style={{ borderRadius: '0' }}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scroll Right Button */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="flex-shrink-0 p-2 sm:p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors z-10 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Scroll categories right"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Search Box with Dropdown - Stationary on Right */}
          <div className="flex-shrink-0 relative z-30 min-w-[200px] sm:min-w-[250px]">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                placeholder="all categories"
                className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 min-h-[44px] placeholder:text-gray-400"
                style={{ borderRadius: '0' }}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 shadow-lg max-h-[300px] overflow-y-auto z-50 dropdown-scroll"
              >
                {/* All Categories Option */}
                <button
                  type="button"
                  onClick={handleAllCategoriesClick}
                  className={`w-full text-left px-4 py-2 text-xs sm:text-sm hover:bg-gray-100 transition-colors ${
                    pathname === '/shop' || pathname === '/'
                      ? 'bg-gray-200 font-semibold'
                      : ''
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    All Categories
                  </span>
                </button>
                
                {/* Divider */}
                <div className="border-t border-gray-200 my-1" />

                {/* Category List */}
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => {
                    const isSelected = category === selectedCategory;
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={(e) => handleCategorySelect(category, e)}
                        className={`w-full text-left px-4 py-2 text-xs sm:text-sm hover:bg-gray-100 transition-colors cursor-pointer ${
                          isSelected ? 'bg-gray-200 font-semibold' : ''
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-2 text-xs sm:text-sm text-gray-500">
                    No categories found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .dropdown-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .dropdown-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .dropdown-scroll::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        .dropdown-scroll::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}

