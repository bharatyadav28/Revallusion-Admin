import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

export default function CustomPagination({
  currentPage,
  setCurrentPage,
  totalPages,
}: Props) {
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const getPaginationRange = () => {
    const delta = 2; // Number of pages to show around the current page
    const range: (number | string)[] = [];

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Add first page if not already included
    if (!range.includes(1)) {
      range.unshift(1);
      if (range[1] !== 2) range.splice(1, 0, "...");
    }

    // Add last page if not already included
    if (!range.includes(totalPages)) {
      if (range[range.length - 1] !== totalPages - 1) range.push("...");
      range.push(totalPages);
    }

    return range;
  };

  const paginationRange = getPaginationRange();

  return (
    <Pagination className="overflow-x-auto mt-4 w-full px-4">
      <PaginationContent className=" flex items-center  ">
        <PaginationItem className="cursor-pointer">
          <PaginationPrevious to="#" onClick={handlePrevious}>
            Previous
          </PaginationPrevious>
        </PaginationItem>

        {paginationRange.map((item, index) =>
          typeof item === "number" ? (
            <PaginationItem key={index} className="cursor-pointer">
              <PaginationLink
                to="#"
                onClick={() => goToPage(item)}
                className={
                  currentPage === item
                    ? "bg-[#fff] text-black hover:bg-primary hover:text-black"
                    : "bg-[var(--lightpurple)] hover:bg-[var(--softpurple)] text-[#fff]"
                }
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={index} className="cursor-pointer">
              <PaginationEllipsis />
            </PaginationItem>
          )
        )}

        <PaginationItem className="cursor-pointer">
          <PaginationNext to="#" onClick={handleNext}>
            Next
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
