export default function ContentBox({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full max-w-screen-xl px-4">{children}</div>;
}
