import IconButton from "@/components/ui/Buttons/IconButton";
import { Plus } from "lucide-react";

const AddPost = () => {
  return (
    <IconButton
      typeBtn="primary"
      className="add-post-btn"
      onClick={() => console.log("Add post clicked")}
    >
      <Plus color="white" />
    </IconButton>
  );
};

export default AddPost;
