import Link from "next/link";
import { Home, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-32 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-8xl font-bold gradient-text mb-4">404</div>
        <FileQuestion className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold mb-2">页面未找到</h1>
        <p className="text-muted-foreground mb-8">
          你访问的页面不存在或已被移动
        </p>
        <Button asChild>
          <Link href="/">
            <Home className="w-4 h-4" />
            返回首页
          </Link>
        </Button>
      </div>
    </div>
  );
}
