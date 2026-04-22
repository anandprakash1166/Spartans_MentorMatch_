"use client";

import { useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { X, Calendar as CalendarIcon, Clock, CheckCircle } from "lucide-react";
import { type Mentor } from "@/lib/data";
import { useSessions } from "@/context/SessionContext";
import { cn } from "@/lib/utils";
import Image from "next/image";

type BookingModalProps = {
  mentor: Mentor;
  onClose: () => void;
};

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30"
];

export default function BookingModal({ mentor, onClose }: BookingModalProps) {
  const { bookSession } = useSessions();
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Generate current week starting from today
  const today = new Date();
  const weekDates = Array.from({ length: 7 }).map((_, i) => addDays(today, i));

  const handleBook = () => {
    if (!selectedDate || !selectedTime) return;
    bookSession(mentor.id, selectedDate, selectedTime);
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2000); // Auto close after success
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="card w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <Image
              src={mentor.avatar}
              alt={mentor.name}
              width={48}
              height={48}
              className="rounded-full object-cover border border-gray-100"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Book Session</h2>
              <p className="text-sm text-gray-500">with {mentor.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-500 max-w-sm">
                Your 30-minute session with {mentor.name} is scheduled for{" "}
                <span className="font-semibold text-gray-900">
                  {selectedDate && format(selectedDate, "MMM d, yyyy")} at {selectedTime}
                </span>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Calendar Grid */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                  Select Date
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {weekDates.map((date) => {
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime(null); // Reset time when date changes
                        }}
                        className={cn(
                          "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                          isSelected
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                            : "bg-white border-gray-200 text-gray-600 hover:border-indigo-400 hover:bg-indigo-50"
                        )}
                      >
                        <span className="text-xs uppercase font-medium opacity-80">
                          {format(date, "EEE")}
                        </span>
                        <span className="text-lg font-bold mt-1">
                          {format(date, "d")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    Select Time (30 min)
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {TIME_SLOTS.map((time) => {
                      const isSelected = selectedTime === time;
                      // Simulate some random unavailable slots based on date and mentor (stable randomness)
                      const seed = mentor.name.length + dateToSeed(selectedDate) + time.length;
                      const isAvailable = seed % 4 !== 0;

                      return (
                        <button
                          key={time}
                          disabled={!isAvailable}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "slot transition-all",
                            !isAvailable
                              ? "booked"
                              : isSelected
                              ? "active"
                              : "hover:border-indigo-400 hover:bg-indigo-50"
                          )}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {!isSuccess && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {selectedDate && selectedTime ? (
                <>
                  <span className="font-medium text-gray-900">
                    {format(selectedDate, "MMM d")}
                  </span>{" "}
                  · {selectedTime} (30m)
                </>
              ) : (
                "Please select a date and time"
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!selectedDate || !selectedTime}
                onClick={handleBook}
                className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-200"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function dateToSeed(date: Date) {
  return date.getDate() + date.getMonth() + date.getFullYear();
}
