import EmptyState from "@/components/common/EmptyState";
import TitlePage from "@/components/common/TitlePage";
import { Ban } from "lucide-react";

const BlackListPage = () => {
  return (
    <section>
      <div className="container">
        <TitlePage title="Черный список" />
        <EmptyState
          icon={<Ban />}
          text="Черный список пуст. Здесь будут аккаунты, которые ты заблокируешь"
        />
      </div>
    </section>
  );
};

export default BlackListPage;
