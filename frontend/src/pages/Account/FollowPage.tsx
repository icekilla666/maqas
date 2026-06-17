import { FOLLOWINGS_PAGE } from "@/utils/constants";
import { useLocation } from "react-router-dom";

const FollowPage = () => {
  const location = useLocation();
  const isFollowings = location.pathname == FOLLOWINGS_PAGE;
  return (
    <section>
      <div className="container">
        {isFollowings ? <h1>подписки</h1> : <h1>подписчики</h1>}
      </div>
    </section>
  );
};

export default FollowPage;
