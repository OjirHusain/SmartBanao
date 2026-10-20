import React, { useState, useEffect } from 'react';
import {
  Play,
  CheckCircle,
  Lock,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Clock,
  Sparkles,
  Award,
  BookOpen,
} from 'lucide-react';
import { Course, CourseLesson, LessonProgress, UserProfile } from '../types/index.ts';
import { api } from '../lib/api.ts';

interface CoursePlayerProps {
  course: Course;
  hasAccess: boolean;
  user: UserProfile | null;
  onBack: () => void;
  onBuyCourse: () => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  hasAccess,
  user,
  onBack,
  onBuyCourse,
}) => {
  // Find initial lesson (first preview lesson or first lesson if hasAccess)
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson>(() => {
    if (hasAccess && allLessons.length > 0) return allLessons[0];
    const preview = allLessons.find((l) => l.is_free_preview);
    return preview || allLessons[0];
  });

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    course.modules.forEach((m) => {
      init[m.id] = true;
    });
    return init;
  });

  const [progressMap, setProgressMap] = useState<Record<string, boolean>>({});
  const [savingProgress, setSavingProgress] = useState(false);

  // Load progress if user is logged in
  useEffect(() => {
    if (!user) return;
    // We can fetch or match progress
    // If progress is passed or fetched via API:
  }, [user, course.id]);

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const handleSelectLesson = (lesson: CourseLesson) => {
    if (!hasAccess && !lesson.is_free_preview) {
      return;
    }
    setSelectedLesson(lesson);
  };

  const handleToggleComplete = async (lessonId: string) => {
    if (!user) return;
    const current = Boolean(progressMap[lessonId]);
    const nextState = !current;
    setProgressMap((prev) => ({ ...prev, [lessonId]: nextState }));

    try {
      setSavingProgress(true);
      await api.saveCourseProgress(course.id, lessonId, nextState, nextState ? 100 : 0);
    } catch (err) {
      console.error('Failed to save progress', err);
    } finally {
      setSavingProgress(false);
    }
  };

  const currentIndex = allLessons.findIndex((l) => l.id === selectedLesson?.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const completedCount = Object.values(progressMap).filter(Boolean).length;
  const progressPercent = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 flex flex-col">
      {/* Top Bar */}
      <div className="h-14 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 bg-slate-950/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Catalog</span>
          </button>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <h2 className="text-xs sm:text-sm font-bold text-slate-200 truncate">
            {course.title}
          </h2>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {hasAccess ? (
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <span className="hidden sm:inline font-mono text-[11px] text-sky-400">
                {completedCount}/{allLessons.length} Completed
              </span>
              <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={onBuyCourse}
              className="text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
            >
              Unlock Full Course
            </button>
          )}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Video Player & Lesson Notes */}
        <div className="lg:col-span-8 flex flex-col bg-black overflow-y-auto">
          {/* Video Container */}
          <div className="relative aspect-video bg-black flex items-center justify-center">
            {selectedLesson?.video_url ? (
              <video
                key={selectedLesson.id}
                src={selectedLesson.video_url}
                controls
                autoPlay
                className="w-full h-full object-contain"
                poster="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80"
              >
                Your browser does not support HTML5 video.
              </video>
            ) : (
              <div className="p-8 text-center max-w-md space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Lesson Locked</h3>
                <p className="text-xs text-slate-400">
                  This premium lesson is part of the full curriculum. Purchase this course or Bundle B to access all 12 video modules with source code.
                </p>
                <button
                  onClick={onBuyCourse}
                  className="mt-2 px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm"
                >
                  Purchase Lifetime Access
                </button>
              </div>
            )}
          </div>

          {/* Lesson Details & Actions */}
          <div className="p-5 sm:p-6 bg-slate-900 border-t border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-sky-400 mb-1">
                  <span>Lesson {currentIndex + 1} of {allLessons.length}</span>
                  {selectedLesson?.duration_seconds && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">
                        {Math.floor(selectedLesson.duration_seconds / 60)} mins
                      </span>
                    </>
                  )}
                  {selectedLesson?.is_free_preview && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-400 font-semibold">Free Preview</span>
                    </>
                  )}
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-white">
                  {selectedLesson?.title}
                </h1>
              </div>

              {hasAccess && (
                <button
                  onClick={() => handleToggleComplete(selectedLesson.id)}
                  disabled={savingProgress}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                    progressMap[selectedLesson.id]
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {progressMap[selectedLesson.id] ? 'Completed' : 'Mark as Complete'}
                  </span>
                </button>
              )}
            </div>

            {selectedLesson?.description && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
                {selectedLesson.description}
              </p>
            )}

            {/* Previous & Next Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                disabled={!prevLesson}
                onClick={() => prevLesson && handleSelectLesson(prevLesson)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 py-1.5 px-3 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Lesson</span>
              </button>

              <button
                disabled={!nextLesson}
                onClick={() => nextLesson && handleSelectLesson(nextLesson)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 py-1.5 px-3 rounded-lg transition-colors"
              >
                <span>Next Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Modules & Lessons Playlist */}
        <div className="lg:col-span-4 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-full overflow-y-auto">
          <div className="p-4 border-b border-slate-800 bg-slate-950 sticky top-0 z-10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Course Syllabus
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {course.modules.length} Modules · {allLessons.length} Lessons
            </p>
          </div>

          <div className="divide-y divide-slate-800/60 flex-1">
            {course.modules.map((module) => {
              const isExpanded = expandedModules[module.id] ?? true;
              return (
                <div key={module.id} className="py-2">
                  {/* Module Accordion Header */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-slate-900/50 transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-300 line-clamp-1">
                      {module.title}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>

                  {/* Lesson List */}
                  {isExpanded && (
                    <div className="mt-1 space-y-0.5 px-2">
                      {module.lessons.map((lesson) => {
                        const isSelected = selectedLesson?.id === lesson.id;
                        const isCompleted = progressMap[lesson.id];
                        const isLocked = !hasAccess && !lesson.is_free_preview;

                        return (
                          <button
                            key={lesson.id}
                            disabled={isLocked}
                            onClick={() => handleSelectLesson(lesson)}
                            className={`w-full p-2.5 rounded-lg flex items-start gap-2.5 text-left text-xs transition-colors ${
                              isSelected
                                ? 'bg-sky-950/80 text-white border border-sky-800/80'
                                : isLocked
                                ? 'text-slate-600 cursor-not-allowed opacity-75'
                                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {isCompleted ? (
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                              ) : isLocked ? (
                                <Lock className="w-3.5 h-3.5 text-slate-600" />
                              ) : (
                                <Play className="w-3.5 h-3.5 text-sky-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`line-clamp-2 ${isSelected ? 'font-semibold text-white' : 'font-medium'}`}>
                                {lesson.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                                <span>{Math.floor(lesson.duration_seconds / 60)}m</span>
                                {lesson.is_free_preview && (
                                  <>
                                    <span>·</span>
                                    <span className="text-emerald-400">Preview</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
