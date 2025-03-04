"use client";

import { useEffect, useRef, useState } from "react";
import {
  BotIcon as Robot,
  CheckCircle,
  Loader2,
  Maximize2,
  Minus,
  Plus,
  Search,
  X,
  XCircle,
} from "lucide-react";
import useAppData from "@/hooks/useAppData";

type LogEntry = {
  timestamp: string;
  request: string[][];
  response: {
    match: boolean;
    name: string;
    merged: string[];
  }[];
};

type RequestLog = {
  userId: string;
  progress: number;
  startTime: string;
  status: "accepted" | "in-progress" | "error";
  logs: LogEntry[];
};

type LogsData = {
  [key: string]: RequestLog;
};

export default function AIRequestLogger() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [logs, setLogs] = useState<LogsData | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [unseenLogsCount, setUnseenLogsCount] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { aiWorkers } = useAppData();
  useEffect(() => {
    setLogs(aiWorkers);
    setSelectedFile(Object.keys(aiWorkers)[0]);
    setUnseenLogsCount(Object.keys(aiWorkers).length);
    setIsWorking(aiWorkers && Object.values(aiWorkers).some((worker) => worker.status === "in-progress"));
  }, [aiWorkers]);

  const handleButtonClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsVisible(true);
      setUnseenLogsCount(0);
    } else {
      setIsVisible(false);
      setIsOpen(false);
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const currentLog = selectedFile && logs ? logs[selectedFile] : null;

  const filteredLogs =
    currentLog?.logs.flatMap((log) =>
      log.response.filter(
        (res) =>
          res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          res.merged.some((item) =>
            item.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      ),
    ) || [];

  const getStatusIcon = (status: RequestLog["status"]) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <>
      <button
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
          isWorking ? "bg-purple-500 animate-pulse-shadow" : "bg-blue-500"
        }`}
        onClick={handleButtonClick}
      >
        {unseenLogsCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {unseenLogsCount}
          </div>
        )}
        {isWorking ? (
          <Loader2 className="h-6 w-6 text-white animate-spin" />
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

      {isOpen && logs && (
        <div
          className={`fixed z-40 overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-300 ${
            isExpanded
              ? "inset-4 md:inset-10 lg:inset-20"
              : "bottom-24 right-6 w-96 max-h-[75vh]"
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
                  setIsOpen(false);
                  setIsExpanded(false);
                }}
                className="rounded p-1 hover:bg-gray-100 transition-colors duration-200"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="border-b p-2 flex overflow-x-auto">
            {Object.entries(logs).map(([fileName, log]) => (
              <button
                key={fileName}
                onClick={() => setSelectedFile(fileName)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 flex items-center gap-2 mr-2 ${
                  selectedFile === fileName
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {getStatusIcon(log.status)}
                <span className="truncate max-w-[120px]">{fileName}</span>
              </button>
            ))}
          </div>

          <div className="border-b p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search courses..."
                className="w-full rounded-md border bg-white border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {currentLog && (
            <div className="p-4 border-b">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">Status:</span>
                <span
                  className={`capitalize ${
                    currentLog.status === "accepted"
                      ? "text-green-600"
                      : currentLog.status === "in-progress"
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  {currentLog.status.replace("-", " ")}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="font-semibold">Progress:</span>
                <span>{(currentLog.progress).toFixed(2)}%</span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      currentLog.status === "error"
                        ? "bg-red-600"
                        : "bg-blue-600"
                    }`}
                    style={{ width: `${currentLog.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div
            className={`overflow-auto p-4 ${
              isExpanded ? "h-[calc(100%-16rem)]" : "max-h-[calc(75vh-16rem)]"
            }`}
          >
            {filteredLogs.length > 0 ? (
              <div className="space-y-4">
                {filteredLogs.map((log, index) => {
                  const baseName =
                    currentLog?.logs[0].request[index]?.[0] || "";
                  const allCourses = currentLog?.logs[0].request[index] || [];
                  const mergedCourses = new Set(log.merged);
                  const notAddedCourses = allCourses.filter(
                    (course) => !mergedCourses.has(course),
                  );

                  return (
                    <div
                      key={index}
                      className="rounded-lg border p-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {log.match ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        )}
                        <h3 className="font-medium text-base text-gray-900">
                          {log.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{baseName}</p>
                      <div className="space-y-2">
                        {log.merged.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm bg-green-50 p-2 rounded"
                          >
                            <Plus className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-green-700">{item}</span>
                          </div>
                        ))}
                        {notAddedCourses.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm bg-red-50 p-2 rounded"
                          >
                            <Minus className="h-4 w-4 text-red-500 flex-shrink-0" />
                            <span className="text-red-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
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
