import { Dumbbell, MapPin, Calendar, Loader2 } from "lucide-react";
import { SubscribeInput } from "./ui/subscribe-input";
import Image from "next/image";
import AvatarCircles from "./ui/avatar-circles";
import { avatars } from "@/lib/avatars";
import { getSubscriberCount } from "@/actions/subscribe-action";

export async function UnderConstruction() {
  const subscriberCountResponse = await getSubscriberCount();
  const subscriberCount = subscriberCountResponse.success ? (
    subscriberCountResponse.data.count
  ) : (
    <Loader2 className="w-4 h-4 animate-spin" />
  );
  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 pb-2">
        <Image
          src="/logo/logo_black.png"
          alt="GymBrah"
          width={32}
          height={32}
        />
        <h1 className="font-mono bg-gradient-to-r from-primary dark:via-primary dark:to-muted-foreground to-[#000] bg-clip-text text-4xl font-bold text-transparent">
          GymBrah
        </h1>
      </div>

      <p className="text-xl font-medium text-muted-foreground">
        Your all-in-one platform to{" "}
        <span className="text-foreground">discover, compare, and access</span>{" "}
        gyms and fitness classes near you.
      </p>

      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <MapPin className="h-5 w-5 text-primary" />
          <span>Find gyms by location and amenities</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Calendar className="h-5 w-5 text-primary" />
          <span>Book classes and sessions instantly</span>
        </div>
      </div>

      <div className="mt-8">
        <SubscribeInput />
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <AvatarCircles avatarUrls={avatars} />
        <span className="flex items-center gap-1">
          Join <p className="font-bold">{subscriberCount}</p> members in waiting
          list.
        </span>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Coming soon. Be the first to know when we launch.
      </p>
    </div>
  );
}
