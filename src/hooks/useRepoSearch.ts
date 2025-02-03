import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

const useRepoSearch = (initialQuery: string, delay: number = 300) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedSearchQuery] = useDebounce(searchQuery, delay);

  return { searchQuery, setSearchQuery, debouncedSearchQuery };
};

export default useRepoSearch;
