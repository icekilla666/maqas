import MainButton, {
  type MainButtonProps,
} from "@/components/ui/Buttons/MainButton";
interface ListButtonsProps {
  btns: MainButtonProps[];
}
const ListButtons = ({ btns }: ListButtonsProps) => {
  return (
    <ul className="btn-list">
      {btns.map((btn) => (
        <li>
          <MainButton onClick={btn.onClick} typesBtn="list">
            {btn.children}
          </MainButton>
        </li>
      ))}
    </ul>
  );
};

export default ListButtons;
