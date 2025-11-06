export function LoadingIndicator() {
  return (
    <div className="mb-4 flex justify-start">
      <div className="max-w-[80%] rounded-lg bg-gray-200 px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
