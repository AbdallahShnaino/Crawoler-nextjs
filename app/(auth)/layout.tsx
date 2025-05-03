export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat">
      {children}
    </div>
  );
}
