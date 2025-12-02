// This layout bypasses the admin layout requirement
export default function UnauthorizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

