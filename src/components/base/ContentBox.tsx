export default function ContentBox({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mx-auto w-full  px-4">{children}</div>;
}
