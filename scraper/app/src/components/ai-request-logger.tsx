import { useEffect, useRef, useState } from "react";
import { BotIcon as Robot, Loader2, Maximize2, Search, X } from "lucide-react";
import { format } from "date-fns";
import useAppData from "@/hooks/useAppData";

type Response = {
  match: boolean;
  name: string;
  merged: string[];
};

type RequestLog = {
  timestamp: string;
  request: string[];
  response: Response | Response[];
};

export default function AIRequestLogger() {
  const { aiLogs, isAiWorking, unseenLogsCount, setUnseenLogsCount } =
    useAppData();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLogs(aiLogs);
  }, [aiLogs]);

  useEffect(() => {
    if (isOpen) {
      setUnseenLogsCount(0);
    }
  }, [isOpen]);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    if (typeof text !== "string") return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-300">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const filteredLogs = logs.filter((log) => {
    const query = searchQuery.toLowerCase();
    return log.response instanceof Array
      ? log.response.some(
          (res) =>
            res.name.toLowerCase().includes(query) ||
            res.merged.some((mergedName) =>
              mergedName.toLowerCase().includes(query),
            ),
        )
      : log.response.name.toLowerCase().includes(query) ||
          log.request.some((req) => req.toLowerCase().includes(query)) ||
          format(new Date(log.timestamp), "PPpp").toLowerCase().includes(query);
  });

  const handleButtonClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setIsOpen(false);
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <>
      <button
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
          isAiWorking ? "bg-purple-500 animate-pulse-shadow" : "bg-blue-500"
        }`}
        onClick={handleButtonClick}
      >
        {unseenLogsCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {unseenLogsCount}
          </div>
        )}
        {isAiWorking ? (
          <div className="animate-spin">
            <Loader2 className="h-6 w-6 text-white" />
          </div>
        ) : (
          <div
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180 scale-110" : "rotate-0 scale-100"
            }`}
          >
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Robot className="h-6 w-6 text-white" />
            )}
          </div>
        )}
      </button>

      {isOpen && (
        <div
          className={`fixed z-40 overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-300 ${
            isExpanded
              ? "inset-4 md:inset-10 lg:inset-20"
              : "bottom-24 right-6 w-96 max-h-[70vh]"
          } ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">AI Request Logs</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="rounded p-1 hover:bg-gray-100 transition-colors duration-200"
                aria-label={isExpanded ? "Minimize" : "Maximize"}
              >
                <Maximize2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => {
                    setIsOpen(false);
                    setIsExpanded(false);
                  }, 300);
                }}
                className="rounded p-1 hover:bg-gray-100 transition-colors duration-200"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="border-b p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search requests..."
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div
            className={`overflow-auto p-4 ${
              isExpanded ? "h-[calc(100%-8rem)]" : "max-h-[calc(70vh-8rem)]"
            }`}
          >
            {filteredLogs.length > 0 ? (
              <div className="space-y-4">
                {filteredLogs.map((log, index) => (
                  <div
                    key={index}
                    className="rounded-lg border p-4 hover:bg-gray-50 transition-colors duration-200 relative"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationName: "fadeIn",
                      animationDuration: "300ms",
                      animationFillMode: "both",
                    }}
                  >
                    <div className="mb-2 text-xs text-gray-500">
                      {format(new Date(log.timestamp), "PPpp")}
                    </div>

                    {Array.isArray(log.response) ? (
                      <>
                        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                          {log.response.length}
                        </div>
                        {log.response.map((res, idx) => (
                          <div key={idx} className="mb-3">
                            <h3 className="font-medium text-gray-900">
                              Request:
                            </h3>
                            <ul className="mt-1 list-inside list-disc text-sm text-gray-700">
                              {log.request.map((req, reqIdx) => (
                                <li key={reqIdx}>
                                  {highlightText(req, searchQuery)}
                                </li>
                              ))}
                            </ul>
                            <h3 className="font-medium text-gray-900">
                              Response:
                            </h3>
                            <div className="mt-1 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Match:</span>
                                <span
                                  className={
                                    res.match
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {res.match ? "Yes" : "No"}
                                </span>
                              </div>
                              {res.match && (
                                <>
                                  <div className="mt-1">
                                    <span className="font-medium">Name:</span>{" "}
                                    {highlightText(res.name, searchQuery)}
                                  </div>
                                  <div className="mt-1">
                                    <span className="font-medium">Merged:</span>
                                    <ul className="mt-1 list-inside list-disc text-gray-700">
                                      {res.merged.map((item, itemIdx) => (
                                        <li key={itemIdx}>
                                          {highlightText(item, searchQuery)}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div>
                        <h3 className="font-medium text-gray-900">Request:</h3>
                        <ul className="mt-1 list-inside list-disc text-sm text-gray-700">
                          {log.request.map((req, reqIdx) => (
                            <li key={reqIdx}>
                              {highlightText(req, searchQuery)}
                            </li>
                          ))}
                        </ul>
                        <h3 className="font-medium text-gray-900">Response:</h3>
                        <div className="mt-1 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Match:</span>
                            <span
                              className={
                                log.response.match
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {log.response.match ? "Yes" : "No"}
                            </span>
                          </div>
                          {log.response.match && (
                            <>
                              <div className="mt-1">
                                <span className="font-medium">Name:</span>{" "}
                                {highlightText(log.response.name, searchQuery)}
                              </div>
                              <div className="mt-1">
                                <span className="font-medium">Merged:</span>
                                <ul className="mt-1 list-inside list-disc text-gray-700">
                                  {log.response.merged.map((item, itemIdx) => (
                                    <li key={itemIdx}>
                                      {highlightText(item, searchQuery)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center text-gray-500">
                No matching logs found
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
