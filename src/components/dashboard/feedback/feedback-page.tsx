"use client";

import { useEffect, useState } from "react";
import { AddFeedback } from "./add-fedback";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFeedbacks } from "@/actions/feedback/feedback";
import { voteFeedback } from "@/actions/feedback/votes";
import { type ActionResponse } from "@/actions/types/action-response";
import { toast } from "sonner";

interface Feedback {
  id: string;
  message: string;
  rating: number;
  category: string;
  status: string;
  upvotes: number;
  created_at: string;
  user_id: string;
  user: {
    full_name: string;
    avatar_url: string | null;
  };
}

export const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  "in-review": "bg-blue-100 text-blue-800 hover:bg-blue-200",
  resolved: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
};

export const categoryColors = {
  bug: "bg-red-100 text-red-800 hover:bg-red-200",
  "feature-request": "bg-violet-100 text-violet-800 hover:bg-violet-200",
  general: "bg-slate-100 text-slate-800 hover:bg-slate-200",
  question: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
  performance: "bg-pink-100 text-pink-800 hover:bg-pink-200",
};

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<{
    [key: string]: "upvote" | "downvote" | null;
  }>({});

  async function loadFeedbacks() {
    try {
      const result = await getFeedbacks();
      if (result?.data) {
        const response = result.data as ActionResponse;
        if (response.success && response.data) {
          setFeedbacks(response.data as Feedback[]);
          const firstFeedback = (response.data as Feedback[])[0];
          if (firstFeedback) {
            setCurrentUserId(firstFeedback.user_id);
          }
        }
      }
    } catch (error) {
      console.error("Error loading feedbacks:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleVote = async (
    feedbackId: string,
    voteType: "upvote" | "downvote"
  ) => {
    try {
      const response = await voteFeedback({ feedbackId, voteType });
      if (!response?.data) return;

      const result = response.data as ActionResponse;
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setUserVotes((prev) => ({
        ...prev,
        [feedbackId]: voteType,
      }));

      await loadFeedbacks();
    } catch (error) {
      toast.error("Failed to vote");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Feedback</h1>
          <AddFeedback />
        </div>
        <div className="text-center">Loading feedbacks...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Feedback</h1>
        <AddFeedback />
      </div>

      <div className="grid gap-4 sm:gap-6">
        {feedbacks.map((feedback) => (
          <Card key={feedback.id} className="overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-2">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg">
                  {feedback.user.avatar_url ? (
                    <AvatarImage
                      src={feedback.user.avatar_url}
                      alt={feedback.user.full_name}
                    />
                  ) : (
                    <AvatarFallback className="rounded-lg bg-gradient-to-br from-green-500 via-teal-500 to-green-800">
                      <span className="text-white text-sm">
                        {feedback.user.full_name[0]?.toUpperCase() || "U"}
                      </span>
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <CardTitle className="text-sm font-medium">
                    {feedback.user.full_name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {new Date(feedback.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex flex-wrap gap-2">
                <Badge
                  className={`text-xs ${
                    categoryColors[
                      feedback.category as keyof typeof categoryColors
                    ]
                  }`}
                >
                  {feedback.category}
                </Badge>
                <Badge
                  className={`text-xs ${
                    statusColors[feedback.status as keyof typeof statusColors]
                  }`}
                >
                  {feedback.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 sm:mb-4 break-words">
                {feedback.message}
              </p>
              <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="space-x-1 px-2 sm:px-3"
                    onClick={() => handleVote(feedback.id, "upvote")}
                  >
                    <ArrowBigUp
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${
                        userVotes[feedback.id] === "upvote"
                          ? "fill-current"
                          : ""
                      }`}
                    />
                    <span className="text-sm">{feedback.upvotes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="space-x-1 px-2 sm:px-3"
                    onClick={() => handleVote(feedback.id, "downvote")}
                  >
                    <ArrowBigDown
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${
                        userVotes[feedback.id] === "downvote"
                          ? "fill-current"
                          : ""
                      }`}
                    />
                  </Button>
                  <Badge variant="outline" className="text-xs hidden sm:block">
                    {feedback.rating} ★
                  </Badge>
                </div>
                <div className="flex sm:hidden items-center gap-2">
                  <Badge
                    className={`text-xs ${
                      categoryColors[
                        feedback.category as keyof typeof categoryColors
                      ]
                    }`}
                  >
                    {feedback.category}
                  </Badge>
                  <Badge
                    className={`text-xs ${
                      statusColors[feedback.status as keyof typeof statusColors]
                    }`}
                  >
                    {feedback.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
