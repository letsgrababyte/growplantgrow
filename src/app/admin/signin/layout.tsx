// This layout bypasses the admin layout requirement
// It allows the signin page to render without admin authentication
export default function AdminSignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
