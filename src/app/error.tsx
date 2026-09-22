"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-smg">Something went wrong</p>
      <h1 className="mt-2 font-display text-3xl">We could not load this page</h1>
      <p className="mt-2 max-w-md text-sm text-white/55">{error.message}</p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-smg px-5 py-2 text-sm font-semibold text-black"
      >
        Try again
      </button>
    </div>
  );
}
