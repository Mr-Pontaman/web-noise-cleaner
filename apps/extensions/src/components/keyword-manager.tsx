import { useState, type FormEvent, type ChangeEvent } from "react";
import { z } from "zod";
import { Input } from "@web-noise-cleaner/ui/components/ui/input";
import { Button, buttonVariants } from "@web-noise-cleaner/ui/components/ui/button";
import { badgeVariants } from "@web-noise-cleaner/ui/components/ui/badge";
import { Card } from "@web-noise-cleaner/ui/components/ui/card";
import { cn } from "@web-noise-cleaner/ui/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@web-noise-cleaner/ui/components/ui/dialog";
import { X, RotateCcw } from "lucide-react";
import { NOISE_KEYWORDS } from "@/constants";
import { toast } from "sonner";

const keywordSchema = z
  .string()
  .min(1, "キーワードを入力してください")
  .max(50, "50文字以内で入力してください");

interface KeywordManagerProps {
  keywords: string[];
  onKeywordsChange: (newKeywords: string[]) => void;
}

export const KeywordManager = ({
  keywords,
  onKeywordsChange,
}: KeywordManagerProps) => {
  const [newKeyword, setNewKeyword] = useState("");

  const handleAddKeyword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = newKeyword.trim();

    const parsed = keywordSchema.safeParse(trimmed);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message, {
        position: "bottom-center",
      });
      return;
    }

    if (keywords.includes(trimmed)) {
      toast.error("既に存在します。", {
        position: "bottom-center",
      });
      return;
    }

    onKeywordsChange([...keywords, trimmed]);
    setNewKeyword("");
  };

  const handleDeleteKeyword = (wordToDelete: string) => {
    onKeywordsChange(keywords.filter((word) => word !== wordToDelete));
  };

  const handleResetKeywords = () => {
    onKeywordsChange([...NOISE_KEYWORDS]);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">除去キーワード</h3>
        <Dialog>
          <DialogTrigger
            className={cn(
              buttonVariants({ variant: "outline" }),
              "text-[10px]"
            )}
          >
            <RotateCcw className="size-3" />
            初期化
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>本当に初期化しますか?</DialogTitle>
              <DialogDescription className={"text-sm"}>
                デフォルトのキーワードセットにリセットされます。
              </DialogDescription>
              <div className="flex justify-center items-center gap-3">
                <DialogClose
                  render={<Button variant={"secondary"}>キャンセル</Button>}
                />
                <DialogClose
                  render={
                    <Button onClick={() => handleResetKeywords()}>はい</Button>
                  }
                />
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <form onSubmit={handleAddKeyword} className="flex items-center gap-2">
        <Input
          type="text"
          value={newKeyword}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewKeyword(e.target.value)
          }
          placeholder="追加するキーワード"
          className="h-8 text-xs flex-1"
        />
        <Button type="submit" size="xs">
          追加
        </Button>
      </form>

      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
        {keywords.map((word) => (
          <Button
            key={word}
            className={cn(
              badgeVariants({ variant: "secondary" }),
              "text-[11.5px]"
            )}
            onClick={() => handleDeleteKeyword(word)}
          >
            {word}
            <X />
          </Button>
        ))}
        {keywords.length === 0 && (
          <p className="text-xs italic text-muted-foreground py-1">
            キーワードがありません
          </p>
        )}
      </div>
    </Card>
  );
};
