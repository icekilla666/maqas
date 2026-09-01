import AddPostTip from "./AddPostTip";
import AddPostEditor from "./AddPostEditor";
import AddPostAction from "./AddPostAction";

const AddPostLayout = () => {
  return (
    <div className="add-post-layout">
      <AddPostEditor />
      <aside className="add-post-sidebar">
        <AddPostTip />

        <AddPostAction />
      </aside>
    </div>
  );
};

export default AddPostLayout;
