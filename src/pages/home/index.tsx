import { FeaturesSection } from "./features-section"
import { HeroSection } from "./hero-section"
import { PlaygroundSection } from "./playground-section"
import { StackSection } from "./stack-section"

export function Component() {
  return (
    <>
      <HeroSection />
      <StackSection />
      <FeaturesSection />
      <PlaygroundSection />
    </>
  )
}
