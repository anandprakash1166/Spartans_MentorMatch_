"use client";

import { useSessions } from "@/context/SessionContext";
import { MENTORS } from "@/lib/data";
import { format, differenceInMinutes, parseISO, setHours, setMinutes } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Video, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MySessionsPage() {
  const { sessions, completeSession } = useSessions();

  const upcomingSessions = sessions.filter((s) => s.status === "upcoming").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastSessions = sessions.filter((s) => s.status === "past").sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getMentor = (mentorId: string) => MENTORS.find((m) => m.id === mentorId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Sessions</h1>
        <p className="text-gray-500">Track your upcoming meetings and review past summaries.</p>
      </div>

      <div className="space-y-12">
        {/* Upcoming Sessions */}
        <section>
          <div className="flex items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Upcoming</h2>
            <div className="ml-3 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
              {upcomingSessions.length}
            </div>
          </div>

          {upcomingSessions.length > 0 ? (
            <div className="grid gap-4">
              {upcomingSessions.map((session) => {
                const mentor = getMentor(session.mentorId);
                if (!mentor) return null;

                const sessionDateTime = new Date(`${session.date}T${session.time}`);
                const now = new Date();
                
                // Keep it simple for demo: just show formatted date.
                
                return (
                  <div key={session.id} className="card p-5 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Image src={mentor.avatar} alt={mentor.name} width={56} height={56} className="rounded-full flex-shrink-0" referrerPolicy="no-referrer" />
                      <div>
                        <h3 className="font-semibold text-lg">{mentor.name}</h3>
                        <p className="text-gray-500 text-sm">{mentor.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:items-end gap-3">
                       <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 w-fit">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {format(parseISO(session.date), "MMM d, yyyy")}
                          <span className="mx-2 text-gray-300">|</span>
                          <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                          {session.time}
                       </div>
                       <div className="flex gap-2 w-full sm:w-auto">
                          <button 
                            onClick={() => completeSession(session.id)}
                            className="flex-1 sm:flex-none inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-xl text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                          >
                            Mark Completed
                          </button>
                          <Link 
                            href={`/sessions/${session.id}`}
                            className="flex-1 sm:flex-none inline-flex justify-center items-center px-4 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Join Call
                          </Link>
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
              <p className="text-gray-500 text-sm">No upcoming sessions. Time to find a mentor!</p>
              <Link href="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                Explore Mentors &rarr;
              </Link>
            </div>
          )}
        </section>

        {/* Past Sessions */}
        <section>
          <div className="flex items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Past Sessions</h2>
          </div>

          {pastSessions.length > 0 ? (
            <div className="grid gap-4">
               {pastSessions.map((session) => {
                const mentor = getMentor(session.mentorId);
                if (!mentor) return null;

                const hasSummary = !!session.summary;
                const hasNotes = !!session.notes;

                return (
                  <Link href={`/sessions/${session.id}`} key={session.id} className="block group">
                    <div className="card p-5 hover:border-gray-300 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Image src={mentor.avatar} alt={mentor.name} width={48} height={48} className="rounded-full flex-shrink-0 grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100" referrerPolicy="no-referrer" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-0.5">
                            {format(parseISO(session.date), "MMM d, yyyy")}
                            <span className="mx-2">·</span>
                            Completed
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {hasSummary ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                             <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                             Summary Ready
                          </span>
                        ) : hasNotes ? (
                           <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                             Draft Notes
                          </span>
                        ) : null}
                        
                        <div className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-gray-700 bg-gray-50 border border-gray-200 group-hover:bg-gray-100 transition-colors">
                          <FileText className="w-4 h-4 mr-2" />
                          View Notes
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
             <div className="text-center py-8 text-gray-500 text-sm">
               No past sessions yet.
             </div>
          )}
        </section>
      </div>
    </div>
  );
}
