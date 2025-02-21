"use client";

import { useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { addFeedback } from "@/actions/feedback/add-feedback";
import { getFeedbacks } from "@/actions/feedback/get-feedbacks";
import { upvoteFeedback, downvoteFeedback } from "@/actions/feedback/upvote";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThumbsUp, ThumbsDown, Plus } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Feedback {
  id: string;
  message: string;
  rating: number;
  category: "bug" | "feature-request" | "general" | "other";
  upvotes: number;
  created_at: string;
  user: {
    full_name: string;
    avatar_url: string | null;
  };
}

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
  rating: z.number().min(1).max(5),
  category: z.enum(["bug", "feature-request", "general", "other"]),
});

function FeedbackSkeleton() {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16 mt-1" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      <Skeleton className="h-4 w-3/4 mt-4" />
      <Skeleton className="h-4 w-1/2 mt-2" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}

export function FeedbackTab() {
  const [tab, setTab] = useQueryState("status");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      rating: 5,
      category: "general",
    },
  });

  const loadFeedbacks = useCallback(async () => {
    setIsLoading(true);
    const result = await getFeedbacks({
      status: tab as "in-review" | "scheduled" | "completed",
    });
    if (result?.data?.success) {
      setFeedbacks(result.data.data);
    }
    setIsLoading(false);
  }, [tab]);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await addFeedback(values);
    if (result?.data?.success) {
      setIsOpen(false);
      form.reset();
      loadFeedbacks();
    }
  };

  const handleVote = async (id: string, isUpvote: boolean) => {
    const action = isUpvote ? upvoteFeedback : downvoteFeedback;
    const result = await action({ feedbackId: id });
    if (result?.data?.success) {
      loadFeedbacks();
    }
  };

  const tabs = [
    { value: "in-review", label: "In Review" },
    { value: "scheduled", label: "Scheduled" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="w-full px-4 md:px-8 py-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Feedback</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Feedback
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Feedback</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bug">Bug</SelectItem>
                          <SelectItem value="feature-request">
                            Feature Request
                          </SelectItem>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={tab || "in-review"} onValueChange={setTab}>
        <TabsList className="justify-start rounded-none h-auto p-0 bg-transparent space-x-4 md:space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent text-primary data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2 text-sm md:text-base whitespace-nowrap"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <>
              <FeedbackSkeleton />
              <FeedbackSkeleton />
              <FeedbackSkeleton />
            </>
          ) : (
            feedbacks.map((feedback) => (
              <div key={feedback.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={feedback.user.avatar_url ?? undefined}
                        className="rounded-full"
                      />
                      <AvatarFallback className="rounded-full border border-gray-200 text-gray-500">
                        {feedback.user.full_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{feedback.user.full_name}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(feedback.created_at), "PPP")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(feedback.id, true)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <span>{feedback.upvotes}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(feedback.id, false)}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-2">{feedback.message}</p>
                <div className="mt-2 flex gap-2">
                  <Badge className="capitalize">{feedback.category}</Badge>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 text-yellow-500"
                  >
                    {"★".repeat(feedback.rating)}
                    <span className="text-xs text-primary">
                      {feedback.rating}
                    </span>
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </Tabs>
    </div>
  );
}
