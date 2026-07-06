"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

interface Comment {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  slug: string;
}

export function CommentSection({ slug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 加载评论
  useEffect(() => {
    setLoading(true);
    fetch(`/api/comments/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data.comments || []);
      })
      .catch(() => {
        setError("加载评论失败");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // 提交评论
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      setError("请填写昵称和评论内容");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/comments/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, content }),
      });

      if (!res.ok) throw new Error("提交失败");

      const data = await res.json();
      setComments((prev) => [data.comment, ...prev]);
      setName("");
      setContent("");
    } catch {
      setError("评论提交失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-16">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">
          评论 <span className="text-muted-foreground">({comments.length})</span>
        </h2>
      </div>

      {/* 评论表单 */}
      <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 mb-8 space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">昵称</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="你的昵称"
            maxLength={50}
            className="max-w-xs"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">评论内容</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="说点什么吧..."
            maxLength={2000}
            rows={4}
          />
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {content.length}/2000 字
          </span>
          <Button type="submit" disabled={submitting} size="sm">
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            发布评论
          </Button>
        </div>
      </form>

      {/* 评论列表 */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          加载评论中...
        </div>
      ) : comments.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>还没有评论，来抢沙发吧！</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="glass-card rounded-xl p-5 animate-slide-up"
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10 bg-primary/15">
                  <AvatarFallback className="bg-primary/15 text-primary">
                    {comment.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{comment.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
