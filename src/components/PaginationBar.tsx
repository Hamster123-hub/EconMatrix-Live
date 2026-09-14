import React from 'react';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showingText?: string;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showingText,
}) => {
  if (totalPages <= 1) return null;

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Build page numbers array with intelligent windowing if totalPages > 7
  let pageNumbers: number[] = [];
  if (totalPages <= 7) {
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (currentPage <= 4) {
      pageNumbers = [1, 2, 3, 4, 5];
    } else if (currentPage >= totalPages - 3) {
      pageNumbers = [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    } else {
      pageNumbers = [
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
      ];
    }
  }

  return (
    <div className="w-full pt-8 pb-4 border-t border-slate-200 mt-8 flex flex-col items-center justify-center space-y-2">
      {/* Segmented Connected Pagination Control Bar */}
      <div className="inline-flex items-center rounded-md border border-slate-300/80 bg-slate-200/60 p-0.5 overflow-hidden shadow-2xs">
        {/* First Page button « */}
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageClick(1)}
          className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center font-extrabold text-base transition cursor-pointer border-r border-slate-300/80 ${
            currentPage === 1
              ? 'bg-[#EBF0F5] text-slate-400 cursor-not-allowed opacity-50'
              : 'bg-[#EBF0F5] hover:bg-slate-300 text-[#0B1E36]'
          }`}
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Previous Page button ‹ */}
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageClick(currentPage - 1)}
          className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center font-extrabold text-base transition cursor-pointer border-r border-slate-300/80 ${
            currentPage === 1
              ? 'bg-[#EBF0F5] text-slate-400 cursor-not-allowed opacity-50'
              : 'bg-[#EBF0F5] hover:bg-slate-300 text-[#0B1E36]'
          }`}
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Page Number Buttons */}
        {pageNumbers.map((pageNum) => {
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center font-mono font-extrabold text-base transition cursor-pointer border-r border-slate-300/80 ${
                isActive
                  ? 'bg-[#0B1E36] text-white border-[#0B1E36] shadow-2xs z-10'
                  : 'bg-white text-[#0B1E36] hover:bg-slate-100'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Page button › */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageClick(currentPage + 1)}
          className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center font-extrabold text-base transition cursor-pointer border-r border-slate-300/80 ${
            currentPage === totalPages
              ? 'bg-white text-slate-400 cursor-not-allowed opacity-50'
              : 'bg-white hover:bg-slate-100 text-[#0B1E36]'
          }`}
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Last Page button » */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageClick(totalPages)}
          className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center font-extrabold text-base transition cursor-pointer ${
            currentPage === totalPages
              ? 'bg-[#EBF0F5] text-slate-400 cursor-not-allowed opacity-50'
              : 'bg-[#EBF0F5] hover:bg-slate-300 text-[#0B1E36]'
          }`}
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {showingText && (
        <div className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wider">
          {showingText}
        </div>
      )}
    </div>
  );
};
