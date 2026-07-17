import type { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const SearchInput = ({ className = "", ...props }: SearchInputProps) => {
  return (
    <div className={`search-input ${className}`.trim()}>
      <Search className="search-input__icon" size={24} />
      <input
        className="search-input__field input"
        {...props}
      />
    </div>
  );
};

export default SearchInput;
