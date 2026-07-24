import TitlePage from "@/components/common/TitlePage";
import UsersList from "@/components/common/UsersList";
import SearchInput from "@/components/ui/Inputs/SearchInput";
import Loader from "@/components/ui/Loaders/Loader";
import { useDebounce } from "@/hooks/useDebounce";

import { useUsersFindQuery } from "@/lib/usersQueries";
import { useState } from "react";

const ChatsPage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { data: users = [], isLoading } = useUsersFindQuery(debouncedSearch);
  return (
    <section>
      <div className="container">
        <TitlePage title="Чаты" />
        <SearchInput
          className="w-full mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="введите юзернейм"
        />
        {isLoading && <Loader />}
        {users ? <UsersList users={users} /> : <h1>ниче не надйено</h1>}
      </div>
    </section>
  );
};

export default ChatsPage;
