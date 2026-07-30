import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@web-noise-cleaner/ui/components/ui/item";
import { TriangleAlert } from "lucide-react";

const ImportantNotice = () => {
  return (
    <Item className="ring ring-mauve-300 rounded-2xl bg-accent-foreground/60 shadow my-4">
      <ItemMedia variant="icon">
        <TriangleAlert className="text-red-500" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-red-400">重要</ItemTitle>
        <ItemDescription className="text-foreground/80">
          解凍したフォルダがPCの中に無いと拡張機能が読みこまれないので、誤って削除しないように特定のフォルダに置くなどの対策が必要になります。
        </ItemDescription>
      </ItemContent>
    </Item>
  );
};

export default ImportantNotice;
