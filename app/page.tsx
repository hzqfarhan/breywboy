import { auth } from "@/lib/auth";
import { SplashScreen } from "@/components/layout/SplashScreen";

export default async function RootPage() {
  const session = await auth();
  
  let destination = "/login";
  if (session) {
    if (session.user?.role === "ADMIN") {
      destination = "/admin";
    } else {
      destination = "/app";
    }
  }

  return <SplashScreen destination={destination} />;
}
