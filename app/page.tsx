"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Star, Clock, Calendar as CalendarIcon, X } from "lucide-react";
import { MENTORS } from "@/lib/data";
import { cn } from "@/lib/utils";
import BookingModal from "@/components/BookingModal";
import { MENTOR_SKILLS } from "@/lib/constants";

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [bookingMentor, setBookingMentor] = useState<typeof MENTORS[0] | null>(null);

  const filteredMentors = useMemo(() => {
    return MENTORS.filter((mentor) => {
      // Search
      const matchesSearch =
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.company.toLowerCase().includes(searchQuery.toLowerCase());

      // Skills
      const matchesSkills =
        selectedSkills.length === 0 ||
        selectedSkills.every((skill) => mentor.skills.includes(skill));

      return matchesSearch && matchesSkills;
    });
  }, [searchQuery, selectedSkills]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8 w-full">
      {/* Left Filter Panel */}
      <aside className="hidden md:block w-64 flex-shrink-0 space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {MENTOR_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-full border transition-colors",
                      selectedSkills.includes(skill)
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find your mentor</h1>
          <div className="relative max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-colors text-gray-900"
              placeholder="Search by name, role, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredMentors.length > 0 ? (
            filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="card p-5 flex flex-col md:flex-row gap-6 transition-shadow"
              >
                <div className="flex-shrink-0">
                  <Image
                    src={mentor.avatar}
                    alt={mentor.name}
                    width={96}
                    height={96}
                    className="rounded-full object-cover border border-gray-100"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{mentor.name}</h3>
                      <p className="text-gray-600 font-medium">
                        {mentor.role} at {mentor.company}
                      </p>
                      <div className="flex items-center gap-4 mt-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          <span className="font-semibold text-gray-900 mr-1">{mentor.rating}</span>
                          ({mentor.reviewsCount})
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setBookingMentor(mentor)}
                      className="inline-flex items-center justify-center px-6 py-2.5 text-xs rounded-xl text-white bg-indigo-600 font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
                    >
                      Book Session
                    </button>
                  </div>

                  {mentor.smartMatchReason && (
                    <p className="text-xs text-gray-600 italic px-3 py-2 bg-indigo-50/50 rounded-lg border-l-2 border-indigo-400 mb-4 leading-relaxed">
                      {mentor.smartMatchReason}
                    </p>
                  )}

                  <p className="text-gray-600 text-sm leading-relaxed mb-4 max-w-3xl">
                    {mentor.bio}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {mentor.skills.map((skill) => (
                      <span
                        key={skill}
                        className="tag"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No mentors found</h3>
              <p className="mt-2 text-sm text-gray-500">
                Try adjusting your filters or search query.
              </p>
            </div>
          )}
        </div>
      </main>

      {bookingMentor && (
        <BookingModal
          mentor={bookingMentor}
          onClose={() => setBookingMentor(null)}
        />
      )}
    </div>
  );
}
