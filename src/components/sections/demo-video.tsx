import { Section } from "../section";
import HeroVideoDialog from "../ui/hero-video-dialog";

export function DemoVideo() {
  return (
    <Section id="demo">
      <div className="relative">
        <HeroVideoDialog
          className="dark:hidden block"
          animationStyle="from-center"
          videoSrc="https://youtu.be/JMYqvPTIE2E"
          thumbnailSrc="/blackboard.png"
          thumbnailAlt="Hero Video"
        />
        <HeroVideoDialog
          className="hidden dark:block"
          animationStyle="from-center"
          videoSrc="https://youtu.be/JMYqvPTIE2E"
          thumbnailSrc="/blackboard.png"
          thumbnailAlt="Hero Video"
        />
      </div>
    </Section>
  );
}
