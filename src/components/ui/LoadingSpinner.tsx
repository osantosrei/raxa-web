/**
 * Renders a centered circular loading indicator styled with Tailwind CSS.
 *
 * @returns A JSX element containing a centered, animated spinner with a primary-colored border and a transparent top segment.
 */
export function LoadingSpinner() {
  return (
    <div className="flex min-h-40 items-center justify-center">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
