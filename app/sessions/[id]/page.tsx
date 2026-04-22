"use client";

import { use, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSessions } from "@/context/SessionContext";
import { MENTORS } from "@/lib/data";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, CheckCircle, Target, BookOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { GoogleGenAI } from "@google/genai";

// Need to unwrap the dynamic route params in next 15 safely. 
// Since this is generic we just use an assumption
export default function SessionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { sessions, updateNotes, saveSummary } = useSessions();
  const [session, setSession] = useState(sessions.find(s => s.id === id));
  const mentor = session ? MENTORS.find(m => m.id === session.mentorId) : null;
  
  const [localNotes, setLocalNotes] = useState(session?.notes || "");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // If notes changed in context, upate local
    const s = sessions.find(s => s.id === id);
    setSession(s);
  }, [sessions, id]);

  const handleSaveNotes = () => {
    updateNotes(id, localNotes);
  };

  const handleGenerateSummary = async () => {
    const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!key) {
      alert("Gemini API key is missing. Please add it to your environment variables.");
      return;
    }

    if (!localNotes.trim()) return;

    // Save notes first
    handleSaveNotes();
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: key });
      
      const prompt = `
You are an expert AI Session Summarizer and Mentor Assistant. A student just had a mentoring session. 
They took the following raw notes during or after the session. 
Extract and structure a polished summary following EXACTLY this JSON structure, with no markdown formatting around the JSON string (just raw JSON so I can parse it):
{
  "takeaways": ["str", "str", "str"],
  "actionItems": ["str", "str"],
  "nextTopics": ["str"]
}

Rules:
- takeaways: Extract 3 key learnings or insights from the notes. Keep them professional and clear.
- actionItems: Extract 2-3 actionable tasks the student should do next. Start with a verb.
- nextTopics: Suggest 1-2 topics they should cover in theirNEXT session based on these notes.

Raw Notes:
"""
${localNotes}
"""
`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text;
      if (text) {
         // Clean up potentially wrapped markdown json block
         const cleanJsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
         const parsed = JSON.parse(cleanJsonStr);
         
         saveSummary(id, {
           takeaways: parsed.takeaways,
           actionItems: parsed.actionItems,
           nextTopics: parsed.nextTopics,
         });
      }

    } catch (error) {
      console.error("Error generating summary:", error);
      alert("Failed to generate summary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!session || !mentor) return <div>Session not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col h-full">
      <Link href="/sessions" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Sessions
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Session Context & Notes */}
        <div className="flex-1 flex flex-col gap-6">
           <div className="card p-6 flex items-center gap-5">
              <Image src={mentor.avatar} alt={mentor.name} width={64} height={64} className="rounded-full shadow-sm border border-gray-100" referrerPolicy="no-referrer" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Session with {mentor.name}</h1>
                <p className="text-gray-500 text-sm mt-1">
                  {format(parseISO(session.date), "EEEE, MMMM d, yyyy")} at {session.time}
                </p>
              </div>
           </div>

           <div className="card flex flex-col flex-1 overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h2 className="text-[15px] font-semibold text-gray-900 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
                  Your Context & Notes
                </h2>
                {localNotes !== session.notes && (
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md">Unsaved changes</span>
                )}
             </div>
             
             <textarea
               className="flex-1 w-full p-6 text-sm text-gray-600 bg-gray-50 border-none resize-none focus:ring-0 placeholder:text-gray-400 leading-relaxed"
               placeholder="Write down what you learned, key insights, challenges discussed, and next steps..."
               value={localNotes}
               onChange={(e) => setLocalNotes(e.target.value)}
             />

             <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
                <button
                  onClick={handleSaveNotes}
                  disabled={localNotes === session.notes}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  Save Notes
                </button>
                <button
                  onClick={handleGenerateSummary}
                  disabled={!localNotes.trim() || isGenerating}
                  className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2 text-indigo-200 group-hover:text-white transition-colors" />
                  )}
                  {session.summary ? "Regenerate Summary" : "Generate AI Summary"}
                </button>
             </div>
           </div>
        </div>

        {/* Right Side: AI Summary Output */}
        <div className="w-full md:w-[400px] flex-shrink-0">
          <div className="ai-gradient rounded-xl shadow-sm relative overflow-hidden h-full">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-500" />
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
                AI Summary
              </h2>

              {!session.summary ? (
                <div className="text-center py-12 px-4">
                   <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-6 h-6 text-indigo-300" />
                   </div>
                   <h3 className="text-sm font-medium text-gray-900 mb-2">No summary yet</h3>
                   <p className="text-xs text-gray-500 leading-relaxed">
                     Write your session notes and click generate to magically extract key takeaways and action items.
                   </p>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   
                   {/* Takeaways */}
                   <div>
                     <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-3 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1.5 text-indigo-500" />
                        Key Takeaways
                     </h3>
                     <ul className="space-y-3">
                       {session.summary.takeaways.map((item, i) => (
                         <li key={i} className="text-sm text-gray-700 leading-relaxed bg-white/60 p-3 rounded-lg border border-indigo-50 shadow-sm">
                           {item}
                         </li>
                       ))}
                     </ul>
                   </div>

                   {/* Action Items */}
                   <div>
                     <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 mb-3 flex items-center">
                        <Target className="w-4 h-4 mr-1.5 text-rose-500" />
                        Action Items
                     </h3>
                     <ul className="space-y-3">
                       {session.summary.actionItems.map((item, i) => (
                         <li key={i} className="flex flex-start gap-3 bg-white/60 p-3 rounded-lg border border-rose-50 shadow-sm group">
                            <div className="w-4 h-4 rounded border-2 border-rose-200 mt-0.5 group-hover:border-rose-400 transition-colors flex-shrink-0" />
                            <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                         </li>
                       ))}
                     </ul>
                   </div>

                   {/* Next Topics */}
                   <div>
                     <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3 flex items-center">
                        <BookOpen className="w-4 h-4 mr-1.5 text-emerald-500" />
                        Next Session Topics
                     </h3>
                     <ul className="list-disc pl-5 space-y-2">
                       {session.summary.nextTopics.map((item, i) => (
                         <li key={i} className="text-sm text-gray-700 marker:text-emerald-300">
                           {item}
                         </li>
                       ))}
                     </ul>
                   </div>

                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Ensure icon uses FileText import
import { FileText } from "lucide-react";
