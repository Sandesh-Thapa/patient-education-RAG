export default function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      fill="none"
      {...props}
    >
      <path
        d="M96 64c0 17.674-14.326 32-32 32-5.164 0-10.04-1.224-14.336-3.38L32 96l3.38-17.664A31.88 31.88 0 0 1 32 64c0-17.674 14.326-32 32-32s32 14.326 32 32z"
        className="stroke-white"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M56 56h8v-8h8v8h8v8h-8v8h-8v-8h-8z"
        className="fill-white"
        strokeWidth={10}
      />
    </svg>
  );
}
